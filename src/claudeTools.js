const tools = [
  // --- INVOICES & ESTIMATES ---
  {
    name: 'create_invoice',
    description: 'Creates a new invoice for a client',
    input_schema: {
      type: 'object',
      properties: {
        client_name: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              description: { type: 'string' },
              quantity: { type: 'number' },
              unit_price: { type: 'number' }
            }
          }
        },
        due_date: { type: 'string' },
        notes: { type: 'string' }
      },
      required: ['client_name', 'items']
    }
  },
  {
    name: 'create_estimate',
    description: 'Creates a cost estimate for a job',
    input_schema: {
      type: 'object',
      properties: {
        client_name: { type: 'string' },
        job_type: { type: 'string' },
        estimated_cost: { type: 'number' },
        details: { type: 'string' }
      },
      required: ['client_name', 'job_type']
    }
  },

  // --- CLIENTS & PROJECTS ---
  {
    name: 'add_client',
    description: 'Adds a new client to the BCS database',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        address: { type: 'string' },
        company: { type: 'string' }
      },
      required: ['name']
    }
  },
  {
    name: 'create_project',
    description: 'Creates a new project for a client',
    input_schema: {
      type: 'object',
      properties: {
        client_name: { type: 'string' },
        project_name: { type: 'string' },
        project_type: { type: 'string', enum: ['restoration', 'reconstruction', 'dryout', 'general'] },
        notes: { type: 'string' }
      },
      required: ['client_name', 'project_name']
    }
  },

  // --- CALENDAR & WORK ORDERS ---
  {
    name: 'schedule_event',
    description: 'Schedules an event or appointment on the calendar',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        date: { type: 'string', description: 'YYYY-MM-DD format' },
        time: { type: 'string', description: 'HH:MM format' },
        description: { type: 'string' },
        client_name: { type: 'string' }
      },
      required: ['title', 'date']
    }
  },
  {
    name: 'create_work_order',
    description: 'Creates a work order for a job',
    input_schema: {
      type: 'object',
      properties: {
        client_name: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
        scheduled_date: { type: 'string' }
      },
      required: ['client_name', 'title']
    }
  },

  // --- EMAIL ---
  {
    name: 'send_email',
    description: 'Sends an email to a client or contact',
    input_schema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string' },
        body: { type: 'string' },
        client_name: { type: 'string', description: 'Name of the client if "to" is unknown' }
      },
      required: ['subject', 'body']
    }
  },
  {
    name: 'check_inbox',
    description: 'Checks the recent emails in the inbox',
    input_schema: {
      type: 'object',
      properties: {
        limit: { type: 'number', default: 5 }
      }
    }
  },

  // --- SEARCH & RETRIEVAL ---
  {
    name: 'search_records',
    description: 'Search for clients, invoices, estimates, or jobs',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category: { type: 'string', enum: ['clients', 'invoices', 'estimates', 'jobs', 'all'] }
      },
      required: ['query']
    }
  },

  // --- FILE GENERATION ---
  {
    name: 'generate_pdf',
    description: 'Generates a PDF file for a specific record',
    input_schema: {
      type: 'object',
      properties: {
        record_type: { type: 'string', enum: ['invoice', 'estimate', 'work_order'] },
        record_id: { type: 'string', description: 'ID or Number of the record' }
      },
      required: ['record_type', 'record_id']
    }
  },

  // --- NOTES ---
  {
    name: 'add_note',
    description: 'Adds a general note or log entry',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        category: { type: 'string' }
      },
      required: ['content']
    }
  }
];

module.exports = { tools };
