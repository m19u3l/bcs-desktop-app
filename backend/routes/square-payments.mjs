import express from 'express';
import { SquareClient, SquareEnvironment } from 'square';
import crypto from 'crypto';
import db from '../db.js';

const router = express.Router();

// Helper function to get Square client
async function getSquareClient() {
  const settings = await db.get('SELECT * FROM company_settings WHERE id = 1');

  if (!settings?.square_access_token) {
    throw new Error('Square access token not configured');
  }

  return new SquareClient({
    token: settings.square_access_token,
    environment: SquareEnvironment.Sandbox
  });
}

// Test Square API connection
router.get('/test-connection', async (req, res) => {
  try {
    const client = await getSquareClient();
    const response = await client.locations.list();

    res.json({
      success: true,
      message: 'Square API connection successful',
      locations: response.result.locations
    });
  } catch (error) {
    console.error('Square API test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create a payment
router.post('/create-payment', async (req, res) => {
  try {
    const { sourceId, amount, invoiceId } = req.body;

    if (!sourceId || !amount || !invoiceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: sourceId, amount, invoiceId'
      });
    }

    const settings = await db.get('SELECT * FROM company_settings WHERE id = 1');
    const client = await getSquareClient();

    // Create payment
    const paymentResponse = await client.payments.create({
      sourceId: sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'USD'
      },
      locationId: settings.square_location_id,
      note: `Invoice ${invoiceId}`
    });

    const payment = paymentResponse.result.payment;

    // Record payment in database
    await db.run(
      `INSERT INTO payments (invoice_id, amount, payment_method, payment_date, transaction_id, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        invoiceId,
        amount,
        'square',
        new Date().toISOString().split('T')[0],
        payment.id,
        'Square Payment'
      ]
    );

    // Update invoice status
    const invoice = await db.get('SELECT * FROM invoices WHERE id = ?', [invoiceId]);
    const paymentsSum = await db.get(
      'SELECT SUM(amount) as total_paid FROM payments WHERE invoice_id = ?',
      [invoiceId]
    );

    const totalPaid = paymentsSum?.total_paid || 0;
    let newStatus = 'pending';

    if (totalPaid >= invoice.amount) {
      newStatus = 'paid';
    } else if (totalPaid > 0) {
      newStatus = 'partial';
    }

    await db.run(
      'UPDATE invoices SET status = ?, amount_paid = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStatus, totalPaid, invoiceId]
    );

    res.json({
      success: true,
      payment: payment,
      invoiceStatus: newStatus
    });

  } catch (error) {
    console.error('Square payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Square configuration for frontend
router.get('/config', async (req, res) => {
  try {
    const settings = await db.get(
      'SELECT square_application_id, square_location_id FROM company_settings WHERE id = 1'
    );

    if (!settings?.square_application_id || !settings?.square_location_id) {
      return res.status(400).json({
        success: false,
        error: 'Square not configured'
      });
    }

    res.json({
      success: true,
      applicationId: settings.square_application_id,
      locationId: settings.square_location_id,
      environment: 'sandbox'
    });
  } catch (error) {
    console.error('Error fetching Square config:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
