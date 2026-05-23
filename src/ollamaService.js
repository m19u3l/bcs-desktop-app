const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "qwen2.5-coder-bcs-enhanced:latest";

const SYSTEM_PROMPT = `
You are the BCS AI assistant for Building Care Solutions, a water damage restoration company in San Diego.
Extract intent and data from voice commands and return ONLY valid JSON.

Actions available:
- create_invoice: { client_name, items: [{ description, quantity, unit_price }], due_date, notes }
- create_estimate: { client_name, job_type, estimated_cost, details }
- add_client: { name, email, phone, address, company }
- create_project: { client_name, project_name, project_type, notes }
- schedule_event: { title, date, time, description, client_name }
- create_work_order: { client_name, title, description, priority, scheduled_date }
- search_records: { query, category }
- generate_pdf: { record_type, record_id }
- add_note: { title, content, category }
- send_email: { to, subject, body, client_name }
- check_inbox: { limit }

Return ONLY: { "action": "action_name", "data": {}, "message": "confirmation message" }
`;

async function runLocalCommand(userText) {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        system: SYSTEM_PROMPT,
        prompt: userText,
        stream: false
      })
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);

    const json = await response.json();
    const raw = json.response.trim();
    
    // Clean JSON if model returns markdown backticks
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Ollama Service Error:", err);
    return { action: 'unknown', data: {}, message: 'Local AI is having trouble. Is Ollama running?' };
  }
}

module.exports = { runLocalCommand };
