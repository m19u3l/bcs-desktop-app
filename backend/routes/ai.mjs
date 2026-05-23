import express from 'express';
import nodeFetch from 'node-fetch';
if (!globalThis.fetch) { globalThis.fetch = nodeFetch; }
import Anthropic from '@anthropic-ai/sdk';
import sqlite3pkg from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const { verbose } = sqlite3pkg;
const sqlite3 = verbose();
const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../database/bcs-database.db');
const db = new sqlite3.Database(dbPath);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/process-voice', async (req, res) => {
  try {
    const { text } = req.body;
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      tools: [
        {
          name: "create_estimate",
          description: "Creates a new estimate when user mentions amount and service",
          input_schema: {
            type: "object",
            properties: {
              client_name: { type: "string" },
              total_amount: { type: "number" },
              description: { type: "string" }
            },
            required: ["client_name", "total_amount", "description"]
          }
        },
        {
          name: "add_client",
          description: "Adds a new client to the database",
          input_schema: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              address: { type: "string" }
            },
            required: ["name"]
          }
        },
        {
          name: "create_invoice",
          description: "Creates a new invoice for a client",
          input_schema: {
            type: "object",
            properties: {
              client_name: { type: "string" },
              amount: { type: "number" },
              description: { type: "string" }
            },
            required: ["client_name", "amount", "description"]
          }
        },
        {
          name: "add_note",
          description: "Adds a note to the system",
          input_schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" }
            },
            required: ["title", "content"]
          }
        }
      ],
      messages: [{ role: "user", content: text }]
    });

    const toolUse = response.content.find(c => c.type === "tool_use");
    
    if (!toolUse) {
      return res.json({ message: response.content[0]?.text || "No response" });
    }

    const { name, input } = toolUse;

    if (name === "add_client") {
      db.run(
        "INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)",
        [input.name, input.email || null, input.phone || null, input.address || null],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, message: `Client ${input.name} added!` });
        }
      );
    }

    else if (name === "create_estimate") {
      db.get("SELECT id FROM clients WHERE name LIKE ? LIMIT 1", [`%${input.client_name}%`], (err, client) => {
        if (err || !client) return res.status(404).json({ error: `Client ${input.client_name} not found. Add them first!` });
        
        const estNumber = `EST-${new Date().toISOString().split("T")[0].replace(/-/g,"")}-${Math.floor(100+Math.random()*900)}`;
        
        db.run(
          "INSERT INTO estimates (estimate_number, client_id, title, description, total_amount, status) VALUES (?, ?, ?, ?, ?, ?)",
          [estNumber, client.id, input.description, input.description, input.total_amount, "draft"],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: `Estimate ${estNumber} created for ${input.client_name} - $${input.total_amount}` });
          }
        );
      });
    }

    else if (name === "create_invoice") {
      db.get("SELECT id FROM clients WHERE name LIKE ? LIMIT 1", [`%${input.client_name}%`], (err, client) => {
        if (err || !client) return res.status(404).json({ error: `Client ${input.client_name} not found!` });
        
        const invNumber = `INV-${new Date().toISOString().split("T")[0].replace(/-/g,"")}-${Math.floor(100+Math.random()*900)}`;
        
        db.run(
          "INSERT INTO invoices (invoice_number, client_id, amount, description, status) VALUES (?, ?, ?, ?, ?)",
          [invNumber, client.id, input.amount, input.description, "pending"],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: `Invoice ${invNumber} created for ${input.client_name} - $${input.amount}` });
          }
        );
      });
    }

    else if (name === "add_note") {
      db.run(
        "INSERT INTO notes (title, content, category, priority) VALUES (?, ?, ?, ?)",
        [input.title, input.content, "general", "normal"],
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, message: `Note saved: ${input.title}` });
        }
      );
    }

  } catch (error) {
    console.error("AI route error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'You are the BCS AI assistant for Building Care Solutions, a water damage restoration company in San Diego. Help with estimates, reports, client communications, and insurance documentation.',
      messages: [{ role: 'user', content: prompt }]
    });
    res.json({ response: response.content[0]?.text || 'No response' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy to Python ClaimScope engine; falls back to Claude if the service is offline
router.post('/generate-nlp', async (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'description is required' });

  // Try Python service first
  try {
    const pyRes = await fetch('http://127.0.0.1:8000/api/v2/estimates/generate-nlp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
      signal: AbortSignal.timeout(3000),
    });
    if (pyRes.ok) {
      const data = await pyRes.json();
      return res.json(data);
    }
  } catch (_) {
    // Python service offline — fall through to Claude
  }

  // Claude fallback
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: 'You are an Xactimate estimator for water damage and restoration. Return ONLY valid JSON matching this schema: {"status":"success","generatedPayload":{"assemblies":[{"code":"string","name":"string","quantity":number,"unit":"string","subtotalCents":number}]}}',
      messages: [{ role: 'user', content: `Generate Xactimate line items for: ${description}` }],
    });
    const text = response.content[0]?.text || '{}';
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}');
    return res.json(json);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
