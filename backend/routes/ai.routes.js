const express = require('express');
const router = express.Router();
const { getAiAction } = require('../services/claudeService');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to your specific DB path
const dbPath = path.resolve(__dirname, '../database/bcs-database.db');
const db = new sqlite3.Database(dbPath);

router.post('/process-voice', async (req, res) => {
  try {
    const { text } = req.body;
    const aiResponse = await getAiAction(text);
    const toolUse = aiResponse.content.find(c => c.type === 'tool_use');

    if (!toolUse) {
      return res.json({ message: aiResponse.content[0].text });
    }

    const { name, input } = toolUse;

    if (name === "create_estimate") {
      // Find client ID first
      db.get("SELECT id FROM clients WHERE name LIKE ? LIMIT 1", [`%${input.client_name}%`], (err, client) => {
        if (err || !client) return res.status(404).json({ error: "Client not found. Add them first!" });

        const estNumber = `EST-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // THE FIX: 6 columns, 6 question marks
        const sql = `INSERT INTO estimates (estimate_number, client_id, title, description, total_amount, status) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [estNumber, client.id, input.description, input.description, input.total_amount, 'draft'];

        db.run(sql, params, function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ success: true, message: `Estimate ${estNumber} created for ${input.client_name}!` });
        });
      });
    }

    if (name === "add_client") {
      db.run(`INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)`, 
      [input.name, input.email || null, input.phone || null], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: `Client ${input.name} added successfully!` });
      });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
