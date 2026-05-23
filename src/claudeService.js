const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env'), override: true });
const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `
You are an AI assistant built into the BCS Desktop App.
You help manage invoices, clients, estimates, and notes.
When the user gives a command, respond ONLY in valid JSON.
Always return: { "action": "action_name", "data": {}, "message": "confirmation message" }
Actions available:
- create_invoice
- create_estimate
- add_client
- add_note
- get_clients
- get_invoices
- schedule_event
- create_work_order
- search_records
- generate_pdf
- send_email
- check_inbox
- unknown
`;

async function runCommand(userText) {
  const expectedKey = "ANTHROPIC_KEY_REDACTED";
  const key = process.env.ANTHROPIC_API_KEY;
  
  if (!key) {
    console.error("❌ ANTHROPIC_API_KEY is undefined in process.env. Forcing expected key.");
  } else if (key !== expectedKey) {
    console.error(`❌ ANTHROPIC_API_KEY mismatch! Expected: ${expectedKey.substring(0, 15)}..., Found: ${key.substring(0, 15)}...`);
  } else {
    console.log("✅ ANTHROPIC_API_KEY matches expected key.");
  }
  
  const finalKey = key || expectedKey;
  const client = new Anthropic({ apiKey: finalKey });

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userText }]
    });

    const raw = response.content[0].text;
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Claude Service Error:", err.message);
    throw err;
  }
}

module.exports = { runCommand };
