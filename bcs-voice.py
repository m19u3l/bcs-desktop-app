#!/usr/bin/env python3
"""
BCS Voice Assistant v1.0
Building Care Solutions - San Diego
Speak -> Whisper -> Qwen -> Backend API -> Done
"""

import whisper
import requests
import json
import subprocess
import tempfile
import os
import sys
import time

# ─── CONFIG ───────────────────────────────────────────
BACKEND = "http://localhost:3000/api"
OLLAMA  = "http://localhost:11434/api/generate"
MODEL   = "qwen2.5-coder-bcs-enhanced:latest"
WMODEL  = "base"
# ──────────────────────────────────────────────────────

BCS_SYSTEM = """You are the BCS voice assistant for Building Care Solutions,
a water damage restoration company in San Diego.

Extract intent and data from voice commands and return ONLY valid JSON.

Possible intents:
- add_client: name, phone, email, address
- create_estimate: client_name, description, amount
- create_invoice: client_name, description, amount
- add_note: subject, content
- schedule_job: client_name, date, time, type
- get_clients: (no extra data)
- get_jobs: (no extra data)

Examples:
Input: "New client Maria Garcia 619-555-1234"
Output: {"intent":"add_client","data":{"name":"Maria Garcia","phone":"619-555-1234"}}

Input: "Create estimate for John 2500 for water damage cleanup"
Output: {"intent":"create_estimate","data":{"client_name":"John","description":"water damage cleanup","amount":2500}}

Input: "Add note roof inspection completed at Ocean View property"
Output: {"intent":"add_note","data":{"subject":"roof inspection","content":"completed at Ocean View property"}}

Input: "Schedule job for Smith family Friday 9am water extraction"
Output: {"intent":"schedule_job","data":{"client_name":"Smith family","date":"Friday","time":"9am","type":"water extraction"}}

CRITICAL: Return ONLY a single JSON object. No text. No explanation. No markdown. No backticks. If you return anything other than pure JSON you have failed."""


def record_audio(seconds=7):
    """Record audio - press ENTER to stop early"""
    print(f"\n🎙️  Recording... press ENTER when done speaking!")
    tmp = tempfile.mktemp(suffix=".wav")
    proc = subprocess.Popen([
        "ffmpeg", "-y",
        "-f", "avfoundation",
        "-i", ":0",
        "-ar", "16000",
        "-ac", "1",
        tmp
    ], stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    input()
    proc.stdin.write(b"q")
    proc.stdin.flush()
    proc.wait()
    if not os.path.exists(tmp):
        raise Exception("Audio recording failed - check mic permissions")
    return tmp


def transcribe(audio_file):
    """Transcribe audio using Whisper"""
    print("📝 Transcribing...")
    model = whisper.load_model(WMODEL)
    result = model.transcribe(audio_file)
    text = result["text"].strip()
    print(f"   You said: \"{text}\"")
    return text


def understand(text):
    """Parse intent using Qwen via Ollama"""
    print("🤖 Qwen is thinking...")
    try:
        resp = requests.post(OLLAMA, json={
            "model": MODEL,
            "system": BCS_SYSTEM,
            "prompt": text,
            "stream": False
        }, timeout=120)
        resp_json = resp.json()
        raw = (resp_json.get("response") or resp_json.get("message", {}).get("content") or "").strip()
        if not raw:
            raise Exception(f"Empty response from Qwen: {resp_json}")
        # Strip markdown backticks if present
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()
        return json.loads(raw.split("\n")[0].strip())
    except json.JSONDecodeError:
        print(f"   Raw response: {raw}")
        raise Exception("Qwen returned invalid JSON - try rephrasing")


def execute(parsed):
    """Execute the action against the BCS backend API"""
    intent = parsed.get("intent")
    data   = parsed.get("data", {})

    if intent == "add_client":
        r = requests.post(f"{BACKEND}/clients", json=data)
        if r.status_code in [200, 201]:
            return f"Client added: {data.get('name', 'Unknown')}"
        return f"Failed to add client: {r.status_code}"

    elif intent == "create_estimate":
        client_r = requests.get(f"{BACKEND}/clients")
        clients = client_r.json()
        client_id = next((c["id"] for c in clients if data.get("client_name","").lower() in c.get("name","").lower()), 1)
        r = requests.post(f"{BACKEND}/estimates", json={
            "client_id": client_id,
            "estimate_number": f"EST-{__import__('time').strftime('%Y%m%d%H%M%S')}",
            "title": data.get("description", "Estimate"),
            "description": data.get("description", ""),
            "total_amount": data.get("amount", 0),
            "status": "draft"
        })
        if r.status_code in [200, 201]:
            return f"Estimate created for {data.get('client_name')} - ${data.get('amount')}"
        return f"Failed to create estimate: {r.status_code}"

    elif intent == "create_invoice":
        r = requests.post(f"{BACKEND}/invoices", json=data)
        if r.status_code in [200, 201]:
            return f"Invoice created for {data.get('client_name')} - ${data.get('amount')}"
        return f"Failed to create invoice: {r.status_code}"

    elif intent == "add_note":
        r = requests.post(f"{BACKEND}/notes", json={"title":data.get("subject","Note"),"content":data.get("content",""),"category":"general","priority":"normal"})
        if r.status_code in [200, 201]:
            return f"Note saved: {data.get('subject')}"
        return f"Failed to save note: {r.status_code}"

    elif intent == "schedule_job":
        r = requests.post(f"{BACKEND}/jobs", json=data)
        if r.status_code in [200, 201]:
            return f"Job scheduled for {data.get('client_name')} on {data.get('date')} at {data.get('time')}"
        return f"Failed to schedule job: {r.status_code}"

    elif intent == "get_clients":
        r = requests.get(f"{BACKEND}/clients")
        clients = r.json()
        if isinstance(clients, list):
            names = [c.get("name", "?") for c in clients[:5]]
            return f"You have {len(clients)} clients. Recent: {', '.join(names)}"
        return "Could not retrieve clients"

    elif intent == "get_jobs":
        r = requests.get(f"{BACKEND}/jobs")
        jobs = r.json()
        if isinstance(jobs, list):
            return f"You have {len(jobs)} jobs in the system"
        return "Could not retrieve jobs"

    else:
        return f"Unknown intent: {intent} - try rephrasing your command"


def speak(text):
    """Mac text-to-speech response"""
    clean = text.replace("'", "")
    os.system(f'say -v Samantha "{clean}"')


def check_backend():
    """Verify backend is running"""
    try:
        r = requests.get(f"{BACKEND}/clients", timeout=3)
        return True
    except:
        return False


def check_ollama():
    """Verify Ollama/Qwen is running"""
    try:
        r = requests.get("http://localhost:11434/api/tags", timeout=3)
        return True
    except:
        return False


def main():
    print("\n" + "=" * 55)
    print("  🏠 BCS Voice Assistant v1.0")
    print("  Building Care Solutions - San Diego")
    print("=" * 55)

    # Pre-flight checks
    print("\n🔍 Checking services...")

    if check_backend():
        print("  ✅ BCS Backend - Connected")
    else:
        print("  ❌ BCS Backend - NOT running!")
        print("     Run: cd ~/bcs-desktop-app && npm run dev")
        sys.exit(1)

    if check_ollama():
        print("  ✅ Ollama/Qwen - Connected")
    else:
        print("  ❌ Ollama - NOT running!")
        print("     Run: ollama serve")
        sys.exit(1)

    print("\n  Ready! Commands you can say:")
    print("  • New client [name] [phone]")
    print("  • Create estimate for [client] [amount] for [description]")
    print("  • Create invoice for [client] [amount]")
    print("  • Add note [subject] [content]")
    print("  • Schedule job for [client] [day] [time] [type]")
    print("  • List my clients")
    print("\n  Press Ctrl+C to quit")
    print("=" * 55)

    speak("BCS Voice Assistant ready. Press enter to speak.")

    while True:
        try:
            input("\n⏎  Press ENTER to speak...")
            audio = record_audio(seconds=10)

            text = transcribe(audio)
            os.remove(audio)

            if not text or len(text.strip()) < 3:
                print("❌ Didn't catch that, please try again")
                speak("I didn't catch that, please try again")
                continue

            parsed = understand(text)
            print(f"   Intent: {parsed.get('intent')}")
            print(f"   Data:   {json.dumps(parsed.get('data', {}), indent=2)}")

            result = execute(parsed)
            print(f"\n✅ {result}")
            speak(result)

        except KeyboardInterrupt:
            print("\n\n👋 BCS Voice Assistant stopped. Goodbye!")
            speak("Goodbye Miguel")
            sys.exit(0)
        except Exception as e:
            print(f"\n❌ Error: {e}")
            speak("There was an error, please try again")


if __name__ == "__main__":
    main()
