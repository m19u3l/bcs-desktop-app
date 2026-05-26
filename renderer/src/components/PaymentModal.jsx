import React, { useState, useEffect } from 'react';
import SquarePaymentForm from './SquarePaymentForm';
import StripePaymentForm from './StripePaymentForm';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const PaymentModal = ({ invoice, onClose, onSuccess }) => {
  const [processor, setProcessor] = useState('square');
  const [paymentType, setPaymentType] = useState('full');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [error, setError] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, [invoice.id]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/payments/invoice/${invoice.id}`);
      const data = await response.json();
      setPaymentHistory(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const remainingBalance = invoice.amount - (invoice.amount_paid || 0);

  const getPaymentAmount = () => {
    if (paymentType === 'full') {
      return remainingBalance;
    }
    return parseFloat(customAmount) || 0;
  };

  const handlePaymentSuccess = (result) => {
    setError('');
    onSuccess(result);
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  const paymentAmount = getPaymentAmount();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            Pay Invoice #{invoice.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Invoice Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold">${invoice.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold text-green-600">
                ${(invoice.amount_paid || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Remaining Balance:</span>
              <span className="text-blue-600">${remainingBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment History */}
          {paymentHistory.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Payment History</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                  >
                    <div>
                      <span className="font-medium">${payment.amount.toFixed(2)}</span>
                      <span className="text-gray-500 ml-2">
                        ({payment.payment_method})
                      </span>
                    </div>
                    <span className="text-gray-600">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentType('full')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  paymentType === 'full'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Full Payment
                <div className="text-sm font-normal mt-1">
                  ${remainingBalance.toFixed(2)}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('partial')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  paymentType === 'partial'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Partial Payment
              </button>
            </div>
          </div>

          {/* Custom Amount Input */}
          {paymentType === 'partial' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  min="0.01"
                  max={remainingBalance}
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Processor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Processor
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProcessor('square')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  processor === 'square'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Square
              </button>
              <button
                type="button"
                onClick={() => setProcessor('stripe')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  processor === 'stripe'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Stripe
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Payment Form */}
          {paymentAmount > 0 && (
            <div className="border-t border-gray-200 pt-6">
              {processor === 'square' ? (
                <SquarePaymentForm
                  amount={paymentAmount}
                  invoiceId={invoice.id}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              ) : (
                <StripePaymentForm
                  amount={paymentAmount}
                  invoiceId={invoice.id}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}
            </div>
          )}

          {paymentAmount <= 0 && paymentType === 'partial' && (
            <div className="text-center text-gray-500 py-4">
              Enter a payment amount to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
