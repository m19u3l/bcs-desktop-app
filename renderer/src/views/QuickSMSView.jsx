import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const BCS_TEMPLATES = [
  { label: 'Appointment Reminder', text: 'Hi, this is Building Care Solutions. Your appointment is scheduled for tomorrow. Reply STOP to opt out. 858-737-8499' },
  { label: 'Estimate Ready', text: 'Your estimate from Building Care Solutions is ready for review. Please call 858-737-8499 or visit our office. Reply STOP to opt out.' },
  { label: 'Job Complete', text: 'Great news! Your job with Building Care Solutions is complete. Thank you for choosing us. Questions? Call 858-737-8499. Reply STOP to opt out.' },
  { label: 'Invoice Due', text: 'A payment is due on your Building Care Solutions invoice. Please call 858-737-8499 to arrange payment. Reply STOP to opt out.' },
  { label: 'Follow Up', text: 'Hi from Building Care Solutions! Following up on your recent service. We hope everything is great. Call 858-737-8499 with any questions. Reply STOP to opt out.' },
];

export default function QuickSMSView() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const sendSMS = async () => {
    if (!phoneNumber || !message) {
      setResult({ success: false, message: 'Please enter a phone number and message.' });
      return;
    }
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (!formattedPhone.startsWith('1')) formattedPhone = '1' + formattedPhone;
    formattedPhone = '+' + formattedPhone;
    setSending(true);
    setResult(null);
    try {
      const response = await fetch(`${API_BASE}/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: formattedPhone, message })
      });
      const data = await response.json();
      if (data.success) {
        setResult({ success: true, message: 'SMS sent successfully!' });
        setMessage('');
      } else {
        setResult({ success: false, message: 'Failed: ' + (data.error || 'Unknown error') });
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error: ' + error.message });
    } finally {
      setSending(false);
    }
  };

  const charCount = message.length;
  const msgCount = Math.ceil(charCount / 160) || 1;

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quick SMS</h1>
        <p className="text-sm text-gray-500 mt-1">Send a text message to any US phone number</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">To (Phone Number)</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Quick Templates */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Templates</label>
          <div className="flex flex-wrap gap-2">
            {BCS_TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => setMessage(t.text)}
                className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            maxLength={640}
            placeholder="Type your message here..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            {charCount} characters · {msgCount} message{msgCount > 1 ? 's' : ''}
          </p>
        </div>

        {/* Send Button */}
        <button
          onClick={sendSMS}
          disabled={sending}
          className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? 'Sending…' : 'Send SMS'}
        </button>

        {/* Result */}
        {result && (
          <div className={`p-3 rounded-lg text-sm font-medium ${result.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {result.message}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        SMS is sent via Building Care Solutions Twilio account. Standard carrier rates apply.
      </p>
    </div>
  );
}
