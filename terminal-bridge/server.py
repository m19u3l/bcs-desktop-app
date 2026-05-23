#!/usr/bin/env python3
"""
BCS Terminal Bridge - Security & Pentest Terminal
WebSocket server on port 8765
"""

import asyncio
import websockets
import json
import subprocess
import os
import socket
import ssl
import urllib.request
import urllib.parse
import re
import base64
from datetime import datetime

# Pre-programmed security commands
COMMANDS = {
    # Network & DNS
    'dns': 'dig {target} ANY +noall +answer',
    'dns-mx': 'dig {target} MX +short',
    'dns-ns': 'dig {target} NS +short',
    'dns-txt': 'dig {target} TXT +short',
    'whois': 'whois {target}',
    'traceroute': 'traceroute -m 15 {target}',
    'ping': 'ping -c 4 {target}',
    'nslookup': 'nslookup {target}',

    # Port Scanning
    'portscan': 'nmap -Pn -sT -T4 --top-ports 100 {target}',
    'portscan-full': 'nmap -Pn -sT -p- {target}',
    'portscan-quick': 'nmap -Pn -F {target}',
    'service-scan': 'nmap -Pn -sV --version-intensity 5 {target}',

    # SSL/HTTPS
    'ssl-check': 'openssl s_client -connect {target}:443 -servername {target} </dev/null 2>/dev/null | openssl x509 -noout -text',
    'ssl-cert': 'echo | openssl s_client -connect {target}:443 2>/dev/null | openssl x509 -noout -dates -subject -issuer',
    'ssl-ciphers': 'nmap --script ssl-enum-ciphers -p 443 {target}',

    # Web Analysis
    'headers': 'curl -sI {target}',
    'curl': 'curl -s {target}',
    'robots': 'curl -s {target}/robots.txt',
    'sitemap': 'curl -s {target}/sitemap.xml',
    'tech-detect': 'curl -sI {target} | grep -iE "server|x-powered|x-aspnet|x-generator"',

    # Security Headers
    'sec-headers': 'curl -sI {target} | grep -iE "strict-transport|content-security|x-frame|x-xss|x-content-type"',

    # Directory/File Discovery
    'dirb': 'dirb {target} -r -z 10',
    'nikto': 'nikto -h {target} -Tuning 1234567890abc',

    # Vulnerability Scanning
    'vuln-scan': 'nmap -Pn --script vuln {target}',
    'xss-scan': 'nmap -Pn --script http-xssed {target}',
    'sql-scan': 'nmap -Pn --script http-sql-injection {target}',

    # Information Gathering
    'whatweb': 'whatweb {target}',
    'wappalyzer': 'curl -s {target} | grep -oE "(jquery|react|angular|vue|bootstrap|wordpress|drupal|joomla)" | sort -u',

    # Network Tools
    'netstat': 'netstat -an | grep LISTEN',
    'arp': 'arp -a',
    'ifconfig': 'ifconfig',
    'route': 'netstat -rn',
    'connections': 'netstat -an | grep ESTABLISHED',

    # Router/Gateway
    'gateway': 'netstat -rn | grep default',
    'router-scan': 'nmap -Pn -sT -p 80,443,8080,8443 {target}',

    # Process & System
    'processes': 'ps aux | head -50',
    'listening': 'lsof -i -P -n | grep LISTEN',

    # Cookie & Storage (browser-side commands - return instructions)
    'cookies': 'BROWSER_CMD:document.cookie',
    'localstorage': 'BROWSER_CMD:JSON.stringify(localStorage)',
    'sessionstorage': 'BROWSER_CMD:JSON.stringify(sessionStorage)',

    # JavaScript Injection Templates
    'inject-keylogger': 'BROWSER_INJECT:document.addEventListener("keypress",function(e){fetch("/log?k="+e.key)})',
    'inject-formgrab': 'BROWSER_INJECT:document.querySelectorAll("form").forEach(f=>f.addEventListener("submit",e=>console.log(new FormData(f))))',

    # Scraping
    'links': 'curl -s {target} | grep -oE \'href="[^"]+"\' | sed \'s/href="//;s/"$//\' | head -50',
    'images': 'curl -s {target} | grep -oE \'src="[^"]+\\.(jpg|jpeg|png|gif|svg)"\' | sed \'s/src="//;s/"$//\'',
    'scripts': 'curl -s {target} | grep -oE \'src="[^"]+\\.js"\' | sed \'s/src="//;s/"$//\'',
    'forms': 'curl -s {target} | grep -oE \'<form[^>]*>|<input[^>]*>\' | head -30',
    'emails': 'curl -s {target} | grep -oE \'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\'',

    # PDF Analysis
    'pdf-meta': 'exiftool {target}',
    'pdf-text': 'pdftotext {target} -',

    # Encoding/Decoding
    'base64-encode': 'echo -n "{target}" | base64',
    'base64-decode': 'echo "{target}" | base64 -d',
    'url-encode': 'python3 -c "import urllib.parse; print(urllib.parse.quote(\'{target}\'))"',
    'url-decode': 'python3 -c "import urllib.parse; print(urllib.parse.unquote(\'{target}\'))"',

    # Hash Generation
    'md5': 'echo -n "{target}" | md5',
    'sha1': 'echo -n "{target}" | shasum -a 1',
    'sha256': 'echo -n "{target}" | shasum -a 256',

    # Fake Site Detection
    'phishing-check': 'curl -sI {target} | grep -iE "location|server" && whois {target} | grep -iE "creation|registrar"',
}

# Help text
HELP_TEXT = """
BCS Terminal Bridge - Security & Pentest Commands
================================================

NETWORK & DNS:
  dns <domain>           - Full DNS lookup
  dns-mx <domain>        - MX records
  dns-ns <domain>        - NS records
  whois <domain>         - WHOIS lookup
  traceroute <host>      - Trace route
  ping <host>            - Ping test

PORT SCANNING:
  portscan <host>        - Top 100 ports
  portscan-full <host>   - All 65535 ports
  service-scan <host>    - Service detection

SSL/HTTPS:
  ssl-check <host>       - Full SSL certificate
  ssl-cert <host>        - Certificate dates
  ssl-ciphers <host>     - Cipher enumeration

WEB ANALYSIS:
  headers <url>          - HTTP headers
  curl <url>             - Fetch page content
  robots <url>           - Robots.txt
  sitemap <url>          - Sitemap.xml
  sec-headers <url>      - Security headers

VULNERABILITY SCANNING:
  vuln-scan <host>       - Nmap vuln scripts
  xss-scan <host>        - XSS detection
  sql-scan <host>        - SQL injection scan
  nikto <url>            - Nikto web scanner

INFORMATION GATHERING:
  links <url>            - Extract all links
  images <url>           - Extract images
  scripts <url>          - Extract JS files
  forms <url>            - Extract forms
  emails <url>           - Extract emails
  tech-detect <url>      - Detect technologies

BROWSER COMMANDS:
  cookies                - Get cookies
  localstorage           - Get localStorage
  sessionstorage         - Get sessionStorage

NETWORK TOOLS:
  netstat                - Listening ports
  connections            - Active connections
  gateway                - Default gateway
  arp                    - ARP table
  route                  - Routing table

ENCODING:
  base64-encode <text>   - Base64 encode
  base64-decode <text>   - Base64 decode
  md5 <text>             - MD5 hash
  sha256 <text>          - SHA256 hash

SYSTEM:
  processes              - Running processes
  listening              - Listening services

Type 'help' for this menu
Type 'list' for all commands
Type 'shell <command>' for raw shell access
"""

async def execute_command(cmd_name, target=""):
    """Execute a pre-programmed command"""
    if cmd_name == 'help':
        return HELP_TEXT

    if cmd_name == 'list':
        return "Available commands:\n" + "\n".join(sorted(COMMANDS.keys()))

    if cmd_name.startswith('shell '):
        # Raw shell command
        raw_cmd = cmd_name[6:]
        try:
            result = subprocess.run(
                raw_cmd,
                shell=True,
                capture_output=True,
                text=True,
                timeout=60
            )
            output = result.stdout or result.stderr or "Command executed (no output)"
            return output
        except subprocess.TimeoutExpired:
            return "Error: Command timed out after 60 seconds"
        except Exception as e:
            return f"Error: {str(e)}"

    if cmd_name not in COMMANDS:
        return f"Unknown command: {cmd_name}\nType 'help' for available commands"

    cmd_template = COMMANDS[cmd_name]

    # Handle browser-side commands
    if cmd_template.startswith('BROWSER_CMD:'):
        return json.dumps({
            'type': 'browser_command',
            'code': cmd_template[12:]
        })

    if cmd_template.startswith('BROWSER_INJECT:'):
        return json.dumps({
            'type': 'browser_inject',
            'code': cmd_template[15:]
        })

    # Execute shell command
    cmd = cmd_template.format(target=target) if target else cmd_template

    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=120
        )
        output = result.stdout or result.stderr or "Command executed (no output)"
        return output
    except subprocess.TimeoutExpired:
        return "Error: Command timed out after 120 seconds"
    except Exception as e:
        return f"Error: {str(e)}"

async def handle_client(websocket, path):
    """Handle WebSocket client connections"""
    client_ip = websocket.remote_address[0]
    print(f"[{datetime.now()}] Client connected: {client_ip}")

    # Send welcome message
    await websocket.send(json.dumps({
        'type': 'system',
        'message': 'Connected to BCS Terminal Bridge\nType "help" for commands'
    }))

    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                command = data.get('command', '').strip()

                if not command:
                    continue

                print(f"[{datetime.now()}] {client_ip} > {command}")

                # Parse command and target
                parts = command.split(' ', 1)
                cmd_name = parts[0].lower()
                target = parts[1] if len(parts) > 1 else ""

                # Execute command
                result = await execute_command(cmd_name, target)

                # Send result
                await websocket.send(json.dumps({
                    'type': 'result',
                    'command': command,
                    'output': result
                }))

            except json.JSONDecodeError:
                await websocket.send(json.dumps({
                    'type': 'error',
                    'message': 'Invalid JSON'
                }))

    except websockets.exceptions.ConnectionClosed:
        print(f"[{datetime.now()}] Client disconnected: {client_ip}")

async def main():
    """Start the WebSocket server"""
    print("=" * 50)
    print("  BCS Terminal Bridge - Security & Pentest Tool")
    print("=" * 50)
    print(f"  WebSocket Server: ws://localhost:8765")
    print(f"  Started: {datetime.now()}")
    print("=" * 50)

    async with websockets.serve(handle_client, "localhost", 8765):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
