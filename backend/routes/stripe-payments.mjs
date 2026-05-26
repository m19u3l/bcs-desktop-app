import express from 'express';
import Stripe from 'stripe';
import db from '../db.js';

const router = express.Router();

// Helper function to get Stripe client
async function getStripeClient() {
  const settings = await db.get('SELECT * FROM company_settings WHERE id = 1');

  if (!settings?.stripe_api_key) {
    throw new Error('Stripe API key not configured');
  }

  return new Stripe(settings.stripe_api_key);
}

// Test Stripe API connection
router.get('/test-connection', async (req, res) => {
  try {
    const stripe = await getStripeClient();
    const balance = await stripe.balance.retrieve();

    res.json({
      success: true,
      message: 'Stripe API connection successful',
      balance: balance
    });
  } catch (error) {
    console.error('Stripe API test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, invoiceId } = req.body;

    if (!amount || !invoiceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, invoiceId'
      });
    }

    const stripe = await getStripeClient();

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        invoice_id: invoiceId
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Confirm payment (called after client-side confirmation)
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, invoiceId } = req.body;

    if (!paymentIntentId || !invoiceId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: paymentIntentId, invoiceId'
      });
    }

    const stripe = await getStripeClient();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const amount = paymentIntent.amount / 100;

      // Check if payment already recorded (idempotency)
      const existingPayment = await db.get(
        'SELECT id FROM payments WHERE transaction_id = ? AND payment_method = ?',
        [paymentIntent.id, 'stripe']
      );

      if (!existingPayment) {
        // Record payment
        await db.run(
          `INSERT INTO payments (invoice_id, amount, payment_method, payment_date, transaction_id, notes)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            invoiceId,
            amount,
            'stripe',
            new Date().toISOString().split('T')[0],
            paymentIntent.id,
            'Stripe Payment'
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
      }

      res.json({
        success: true,
        paymentIntent: paymentIntent
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment not completed',
        status: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Stripe payment confirmation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Stripe configuration for frontend
router.get('/config', async (req, res) => {
  try {
    const settings = await db.get(
      'SELECT stripe_publishable_key FROM company_settings WHERE id = 1'
    );

    if (!settings?.stripe_publishable_key) {
      return res.status(400).json({
        success: false,
        error: 'Stripe not configured'
      });
    }

    res.json({
      success: true,
      publishableKey: settings.stripe_publishable_key
    });
  } catch (error) {
    console.error('Error fetching Stripe config:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
