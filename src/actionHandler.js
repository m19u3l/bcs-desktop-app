const db = require('./database');
const { runCommand } = require('./claudeService');
const { runLocalCommand } = require('./ollamaService');

// Use node-fetch for API calls to the backend
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const BACKEND_URL = 'http://localhost:3000/api';

async function handleUserCommand(text) {
  let result;
  
  try {
    // Try Claude first (high performance)
    result = await runCommand(text);
  } catch (err) {
    console.warn("⚠️ Claude (Online AI) unavailable, falling back to Ollama (Local AI)...");
    try {
      // Fallback to local Ollama if offline or API fails
      result = await runLocalCommand(text);
    } catch (localErr) {
      console.error("❌ Both AI services failed.");
      return { success: false, message: 'I am currently offline and cannot process that command.' };
    }
  }

  try {
    const { action, data, message } = result;

    switch (action) {
      case 'send_email':
        let recipient = data.to;
        if (!recipient && data.client_name) {
          const client = db.getClient(data.client_name);
          if (client && client.email) recipient = client.email;
        }
        if (!recipient) return { success: false, message: `I couldn't find an email for ${data.client_name}. Please provide one.` };
        
        const emailRes = await fetch(`${BACKEND_URL}/email/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: recipient, subject: data.subject, html: data.body })
        });
        const emailData = await emailRes.json();
        return { success: emailData.success, message: emailData.success ? `Email sent to ${recipient}` : 'Failed to send email.' };

      case 'check_inbox':
        const inboxRes = await fetch(`${BACKEND_URL}/email/inbox?limit=${data.limit || 5}`);
        const emails = await inboxRes.json();
        if (!emails || emails.length === 0) return { success: true, message: 'Your inbox is empty.' };
        const emailSummary = emails.map(e => `From: ${e.from}, Subject: ${e.subject}`).join('\n');
        return { success: true, message: `Here are your recent emails:\n${emailSummary}` };

      case 'create_invoice':
        db.addInvoice(data);
        return { success: true, message: `Invoice created for ${data.client_name}` };
      
      case 'create_estimate':
        db.addEstimate(data);
        return { success: true, message: `Estimate created for ${data.client_name}` };
      
      case 'add_client':
        db.addClient(data);
        return { success: true, message: `Client ${data.name} added!` };
      
      case 'create_project':
        db.createProject(data);
        return { success: true, message: `Project "${data.project_name}" created.` };
      
      case 'schedule_event':
        db.scheduleEvent(data);
        return { success: true, message: `Event "${data.title}" scheduled for ${data.date}.` };
      
      case 'create_work_order':
        db.createWorkOrder(data);
        return { success: true, message: `Work order created: ${data.title}` };
      
      case 'search_records':
        const results = db.searchRecords(data);
        if (results.length === 0) return { success: true, message: 'No records found matching that query.' };
        const summary = results.map(r => `${r.type}: ${r.name || r.invoice_number}`).join(', ');
        return { success: true, message: `I found: ${summary}` };
      
      case 'add_note':
        db.addNote(data);
        return { success: true, message: 'Note added successfully.' };

      case 'generate_pdf':
        // For now, we confirm the intent. Full PDF bridge requires specific record lookup.
        return { success: true, message: `I'm preparing the ${data.record_type} PDF for record ${data.record_id}. Please check the Prints folder.` };

      default:
        return { success: false, message: message || 'Command not understood.' };
    }
  } catch (err) {
    console.error("Action Handler Error:", err);
    return { success: false, message: 'Error: ' + err.message };
  }
}

module.exports = { handleUserCommand };
