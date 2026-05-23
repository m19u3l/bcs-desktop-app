const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools = [
  {
    name: "create_estimate",
    description: "Creates a new estimate. Use this when the user mentions a dollar amount and a service.",
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
    description: "Adds a new client to the database.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" }
      },
      required: ["name"]
    }
  }
];

async function getAiAction(userPrompt) {
  return await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    tools: tools,
    messages: [{ role: "user", content: userPrompt }]
  });
}

module.exports = { getAiAction };
