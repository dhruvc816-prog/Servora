import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getRequestById } from '../../services/requestService';

const getStatusBadge = (status) => {
    const map = {
        CREATED: 'badge-created',
        ASSIGNED: 'badge-assigned',
        ACCEPTED: 'badge-accepted',
        IN_PROGRESS: 'badge-in-progress',
        COMPLETED: 'badge-completed',
        CANCELLED: 'badge-cancelled',
        PAID: 'badge-paid',
    };
    return map[status] || 'badge-created';
};

const getPriorityBadge = (priority) => {
    const map = {
        LOW: 'priority-low',
        MEDIUM: 'priority-medium',
        HIGH: 'priority-high',
        URGENT: 'priority-urgent',
    };
    return map[priority] || '';
};

const statusSteps = ['CREATED', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];

function CustomerTrack() {
    const [requestId, setRequestId] = useState('');
    const [request, setRequest] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTrack = async () => {
        if (!requestId.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await getRequestById(requestId);
            setRequest(res.data.data);
        } catch (err) {
            setError('Request not found. Please check the ID and try again.');
            setRequest(null);
        }
        setLoading(false);
    };

    const currentStepIndex = request ? statusSteps.indexOf(request.status) : -1;

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
            {/* Ambient glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-lg animate-slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-brand-600 mb-4 shadow-glow">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-1">Track Request</h1>
                    <p className="text-surface-400 text-sm">Enter your request ID to see real-time status</p>
                </div>

                {/* Search card */}
                <div className="glass-card p-8">
                    <div className="flex gap-3">
                        <input
                            id="track-request-id"
                            placeholder="Paste your Request ID here..."
                            className="input-premium flex-1"
                            value={requestId}
                            onChange={(e) => setRequestId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                        />
                        <button
                            id="track-btn"
                            onClick={handleTrack}
                            disabled={loading}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium text-sm hover:shadow-glow transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                        >
                            {loading ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                            Track
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-scale-in">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}
                </div>

                {/* Result card */}
                {request && (
                    <div className="glass-card p-8 mt-6 animate-scale-in">
                        {/* Status timeline */}
                        {!['CANCELLED', 'PAID'].includes(request.status) && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between relative">
                                    {/* Progress line */}
                                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-surface-800" />
                                    <div
                                        className="absolute top-4 left-0 h-0.5 transition-all duration-700"
                                        style={{
                                            width: `${currentStepIndex >= 0 ? (currentStepIndex / (statusSteps.length - 1)) * 100 : 0}%`,
                                            background: currentStepIndex === statusSteps.length - 1
                                                ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                                : 'linear-gradient(90deg, #6366f1, #818cf8)',
                                        }}
                                    />

                                    {statusSteps.map((step, idx) => (
                                        <div key={step} className="relative flex flex-col items-center z-10">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                                                idx <= currentStepIndex
                                                    ? idx === statusSteps.length - 1 && idx <= currentStepIndex
                                                        ? 'bg-emerald-500 text-white shadow-lg'
                                                        : 'bg-brand-500 text-white shadow-glow'
                                                    : 'bg-surface-800 text-surface-500 border border-surface-700'
                                            }`}>
                                                {idx <= currentStepIndex ? (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    idx + 1
                                                )}
                                            </div>
                                            <span className={`text-xs mt-2 whitespace-nowrap ${
                                                idx <= currentStepIndex ? 'text-surface-300 font-medium' : 'text-surface-600'
                                            }`}>
                                                {step.replace('_', ' ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-900/50 border border-surface-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-surface-500">Customer</p>
                                        <p className="text-sm font-medium text-surface-200">{request.customerName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-surface-900/50 border border-surface-800">
                                <p className="text-xs text-surface-500 mb-1">Issue Description</p>
                                <p className="text-sm text-surface-300 leading-relaxed">{request.issueDescription}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-surface-900/50 border border-surface-800">
                                    <p className="text-xs text-surface-500 mb-2">Priority</p>
                                    <span className={`badge ${getPriorityBadge(request.priority)}`}>
                                        {request.priority}
                                    </span>
                                </div>
                                <div className="p-4 rounded-xl bg-surface-900/50 border border-surface-800">
                                    <p className="text-xs text-surface-500 mb-2">Status</p>
                                    <span className={`badge ${getStatusBadge(request.status)}`}>
                                        {request.status?.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-surface-900/50 border border-surface-800">
                                <p className="text-xs text-surface-500 mb-1">Assigned Technician</p>
                                <p className={`text-sm font-medium ${request.assignedTo ? 'text-surface-200' : 'text-surface-500 italic'}`}>
                                    {request.assignedTo || 'Not assigned yet — hang tight!'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-6 text-center animate-fade-in">
                    <div className="flex gap-4 justify-center">
                        <Link to="/customer/request" className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            New Request
                        </Link>
                        <span className="text-surface-700">•</span>
                        <Link to="/customer/chat" className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            AI Chat
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerTrack;