import { useState, useEffect } from 'react';
import { getAllRequests, createRequest, assignTechnician, cancelRequest } from '../../services/requestService';

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

function AdminRequests() {
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ customerName: '', customerPhone: '', issueDescription: '', priority: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        const res = await getAllRequests();
        setRequests(res.data.data);
        setLoading(false);
    };

    const handleCreate = async () => {
        const payload = {
            ...form,
            priority: form.priority === '' ? null : form.priority  // ← empty → null
        };
        await createRequest(payload);
        setShowForm(false);
        setForm({ customerName: '', customerPhone: '', issueDescription: '', priority: '' });
        fetchRequests();
    };

    const handleAssign = async (id, tid) => {
        console.log('Assigning:', id, tid);
        await assignTechnician(id, tid);
        fetchRequests();
    };

    const handleCancel = async (id) => {
        await cancelRequest(id);
        fetchRequests();
    };

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-surface-100">Service Requests</h2>
                    <p className="text-sm text-surface-500 mt-1">{requests.length} total requests</p>
                </div>
                <button
                    id="new-request-btn"
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        showForm
                            ? 'bg-surface-800 text-surface-300 border border-surface-700'
                            : 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow hover:shadow-glow-lg'
                    }`}
                >
                    {showForm ? (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            New Request
                        </>
                    )}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="glass-card p-6 mb-6 animate-slide-down">
                    <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Request
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">Customer Name</label>
                            <input
                                placeholder="John Doe"
                                className="input-premium"
                                value={form.customerName}
                                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">Customer Phone</label>
                            <input
                                placeholder="+91 98765 43210"
                                className="input-premium"
                                value={form.customerPhone}
                                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">Issue Description</label>
                            <textarea
                                placeholder="Describe the issue in detail..."
                                className="input-premium min-h-[80px] resize-none"
                                value={form.issueDescription}
                                onChange={(e) => setForm({ ...form, issueDescription: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-1.5 uppercase tracking-wider">Priority</label>
                            <select
                                className="input-premium"
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            >
                                <option value="">✨ AI Auto-Detect</option>
                                <option value="LOW">🟢 Low</option>
                                <option value="MEDIUM">🟡 Medium</option>
                                <option value="HIGH">🟠 High</option>
                                <option value="URGENT">🔴 Urgent</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                id="create-request-btn"
                                onClick={handleCreate}
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Create Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading skeleton */}
            {loading ? (
                <div className="glass-card p-8 text-center">
                    <svg className="animate-spin h-8 w-8 mx-auto text-brand-500 mb-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-surface-500 text-sm">Loading requests...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <svg className="w-12 h-12 mx-auto text-surface-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-surface-400 font-medium">No requests yet</p>
                    <p className="text-surface-500 text-sm mt-1">Create your first service request to get started</p>
                </div>
            ) : (
                /* Requests Table */
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Issue</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req.id}>
                                        <td>
                                            <div>
                                                <p className="font-medium text-surface-200">{req.customerName}</p>
                                                <p className="text-xs text-surface-500 mt-0.5">{req.customerPhone}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="text-surface-300 max-w-[200px] truncate">{req.issueDescription}</p>
                                        </td>
                                        <td>
                                            <span className={`badge ${getPriorityBadge(req.priority)}`}>
                                                {req.priority}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(req.status)}`}>
                                                {req.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`text-sm ${req.assignedTo ? 'text-surface-300' : 'text-surface-600 italic'}`}>
                                                {req.assignedTo || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {/* Assign */}
                                                {req.status === 'CREATED' && (
                                                    <div className="flex gap-1.5 items-center">
                                                        <input
                                                            id={`tech-${req.id}`}
                                                            placeholder="Tech ID"
                                                            className="w-28 px-2.5 py-1.5 rounded-lg bg-surface-900/80 border border-surface-700 text-xs text-surface-300 placeholder:text-surface-600 focus:border-brand-500/50 focus:outline-none transition-all"
                                                        />
                                                        <button
                                                            onClick={() => handleAssign(req.id, document.getElementById(`tech-${req.id}`).value)}
                                                            className="btn-secondary whitespace-nowrap"
                                                        >
                                                            Assign
                                                        </button>
                                                    </div>
                                                )}
                                                {/* Cancel */}
                                                {!['CANCELLED', 'PAID'].includes(req.status) && (
                                                    <button
                                                        onClick={() => handleCancel(req.id)}
                                                        className="btn-danger whitespace-nowrap"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminRequests;