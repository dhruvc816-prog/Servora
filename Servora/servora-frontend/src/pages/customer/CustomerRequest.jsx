import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function CustomerRequest() {
    const [form, setForm] = useState({ customerName: '', customerPhone: '', issueDescription: '', priority: '' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [requestId, setRequestId] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await api.post('/api/requests/customer', {  // ← change karo
                ...form,
                priority: form.priority === '' ? null : form.priority
            });
            setSuccess('Request submitted successfully!');
            setRequestId(res.data.data.id);
        } catch (err) {
            setError('Failed to create request. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
            {/* Ambient glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-lg animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-glow">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-1">Submit a Request</h1>
                    <p className="text-surface-400 text-sm">Describe your issue and we'll connect you with the right technician</p>
                </div>

                {/* Success card */}
                {success && (
                    <div className="glass-card p-6 mb-6 animate-scale-in border-emerald-500/20">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-emerald-300 font-medium">{success}</p>
                                <p className="text-surface-400 text-sm mt-1">Your Request ID:</p>
                                <p className="text-brand-300 font-mono text-xs bg-brand-500/10 px-3 py-1.5 rounded-lg inline-block mt-1 border border-brand-500/20">
                                    {requestId}
                                </p>
                                <p className="text-surface-500 text-xs mt-2">Save this ID to track your request status</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form card */}
                <div className="glass-card p-8">
                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-scale-in">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Your Name</label>
                            <input
                                id="customer-name"
                                placeholder="John Doe"
                                className="input-premium"
                                value={form.customerName}
                                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Phone Number</label>
                            <input
                                id="customer-phone"
                                placeholder="+91 98765 43210"
                                className="input-premium"
                                value={form.customerPhone}
                                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Describe Your Issue</label>
                            <textarea
                                id="customer-issue"
                                placeholder="Tell us what's wrong — the more detail, the faster we can help..."
                                className="input-premium min-h-[100px] resize-none"
                                value={form.issueDescription}
                                onChange={(e) => setForm({ ...form, issueDescription: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Priority</label>
                            <select
                                id="customer-priority"
                                className="input-premium"
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value || null })}
                            >
                                <option value="">✨ AI Auto-Detect Priority</option>
                                <option value="LOW">🟢 Low</option>
                                <option value="MEDIUM">🟡 Medium</option>
                                <option value="HIGH">🟠 High</option>
                                <option value="URGENT">🔴 Urgent</option>
                            </select>
                        </div>

                        <button
                            id="submit-request-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-primary flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <>
                                    Submit Request
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="mt-6 pt-6 border-t border-surface-800 flex justify-center gap-6">
                        <Link to="/customer/track" className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Track Request
                        </Link>
                        <Link to="/customer/chat" className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            AI Chat Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerRequest;