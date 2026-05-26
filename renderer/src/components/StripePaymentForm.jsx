import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const StripePaymentForm = ({ amount, invoiceId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [stripe, setStripe] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadStripeConfig();
  }, []);

  const loadStripeConfig = async () => {
    try {
      // Fetch Stripe configuration
      const response = await fetch(`${API_BASE}/stripe-payments/config`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load Stripe configuration');
      }

      setConfig(data);

      // Load Stripe.js
      if (!window.Stripe) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => initializeStripe(data.publishableKey);
        document.body.appendChild(script);
      } else {
        initializeStripe(data.publishableKey);
      }
    } catch (error) {
      console.error('Error loading Stripe config:', error);
      onError(error.message);
      setLoading(false);
    }
  };

  const initializeStripe = async (publishableKey) => {
    try {
      const stripeInstance = window.Stripe(publishableKey);
      const elements = stripeInstance.elements();
      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      });

      card.mount('#stripe-card-element');
      setStripe(stripeInstance);
      setCardElement(card);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      onError('Failed to initialize payment form');
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !cardElement) {
      onError('Payment form not initialized');
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create payment intent
      const intentResponse = await fetch(`${API_BASE}/stripe-payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          invoiceId: invoiceId
        })
      });

      const intentData = await intentResponse.json();

      if (!intentData.success) {
        throw new Error(intentData.error || 'Failed to create payment intent');
      }

      // Step 2: Confirm payment with card details
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardElement
          }
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // Step 3: Confirm on backend
      const confirmResponse = await fetch(`${API_BASE}/stripe-payments/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          invoiceId: invoiceId
        })
      });

      const confirmData = await confirmResponse.json();

      if (confirmData.success) {
        onSuccess(confirmData);
      } else {
        throw new Error(confirmData.error || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-4">
        <div id="stripe-card-element"></div>
      </div>

      <button
        type="submit"
        disabled={processing}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >
        {processing ? 'Processing...' : `Pay $${parseFloat(amount).toFixed(2)}`}
      </button>
    </form>
  );
};

export default StripePaymentForm;
