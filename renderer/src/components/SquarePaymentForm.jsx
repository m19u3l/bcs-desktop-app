import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const SquarePaymentForm = ({ amount, invoiceId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [card, setCard] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadSquareConfig();
  }, []);

  const loadSquareConfig = async () => {
    try {
      // Fetch Square configuration
      const response = await fetch(`${API_BASE}/square-payments/config`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load Square configuration');
      }

      setConfig(data);

      // Load Square Web Payments SDK
      if (!window.Square) {
        const script = document.createElement('script');
        script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
        script.async = true;
        script.onload = () => initializeSquare(data);
        document.body.appendChild(script);
      } else {
        initializeSquare(data);
      }
    } catch (error) {
      console.error('Error loading Square config:', error);
      onError(error.message);
      setLoading(false);
    }
  };

  const initializeSquare = async (config) => {
    try {
      const payments = window.Square.payments(config.applicationId, config.locationId);
      const cardInstance = await payments.card();
      await cardInstance.attach('#square-card-container');

      setCard(cardInstance);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing Square:', error);
      onError('Failed to initialize payment form');
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!card) {
      onError('Payment form not initialized');
      return;
    }

    setProcessing(true);

    try {
      // Tokenize card
      const result = await card.tokenize();

      if (result.status === 'OK') {
        // Send payment to backend
        const response = await fetch(`${API_BASE}/square-payments/create-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sourceId: result.token,
            amount: parseFloat(amount),
            invoiceId: invoiceId
          })
        });

        const data = await response.json();

        if (data.success) {
          onSuccess(data);
        } else {
          throw new Error(data.error || 'Payment failed');
        }
      } else {
        throw new Error('Card tokenization failed');
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div id="square-card-container" className="border border-gray-300 rounded-lg p-4"></div>

      <button
        type="submit"
        disabled={processing}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? 'Processing...' : `Pay $${parseFloat(amount).toFixed(2)}`}
      </button>
    </form>
  );
};

export default SquarePaymentForm;
