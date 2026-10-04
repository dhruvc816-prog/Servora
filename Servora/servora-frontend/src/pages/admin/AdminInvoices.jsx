import { useState, useEffect } from 'react';
import { getAllInvoices, markPaid, markUnpaid } from '../../services/invoiceService';

const getStatusBadge = (status) => {
    const map = {
        GENERATED: 'badge-generated',
        PAID: 'badge-paid',
        UNPAID: 'badge-unpaid',
    };
    return map[status] || 'badge-generated';
};

function AdminInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        const res = await getAllInvoices();
        setInvoices(res.data.data);
        setLoading(false);
    };

    const handlePaid = async (id) => {
        await markPaid(id);
        fetchInvoices();
    };

    const handleUnpaid = async (id) => {
        await markUnpaid(id);
        fetchInvoices();
    };

    const totalRevenue = invoices
        .filter(inv => inv.status === 'PAID')
        .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const pendingAmount = invoices
        .filter(inv => inv.status === 'GENERATED')
        .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-surface-100">Invoices</h2>
                <p className="text-sm text-surface-500 mt-1">{invoices.length} total invoices</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">Total Invoices</p>
                            <p className="text-2xl font-bold text-surface-100">{invoices.length}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">Revenue</p>
                            <p className="text-2xl font-bold text-gradient-green">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">Pending</p>
                            <p className="text-2xl font-bold text-gradient-warm">₹{pendingAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading / Empty */}
            {loading ? (
                <div className="glass-card p-8 text-center">
                    <svg className="animate-spin h-8 w-8 mx-auto text-brand-500 mb-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-surface-500 text-sm">Loading invoices...</p>
                </div>
            ) : invoices.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <svg className="w-12 h-12 mx-auto text-surface-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                    <p className="text-surface-400 font-medium">No invoices yet</p>
                    <p className="text-surface-500 text-sm mt-1">Invoices will appear here when jobs are completed</p>
                </div>
            ) : (
                /* Invoices Table */
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Request ID</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Generated At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id}>
                                        <td>
                                            <span className="text-xs text-surface-400 font-mono bg-surface-800/50 px-2 py-1 rounded-md">
                                                {inv.id?.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-xs text-surface-400 font-mono bg-surface-800/50 px-2 py-1 rounded-md">
                                                {inv.serviceRequestId?.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-surface-200 font-semibold">₹{inv.amount?.toLocaleString()}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(inv.status)}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-surface-400 text-sm">
                                                {new Date(inv.generatedAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                {inv.status === 'GENERATED' && (
                                                    <>
                                                        <button onClick={() => handlePaid(inv.id)} className="btn-success whitespace-nowrap">
                                                            ✓ Mark Paid
                                                        </button>
                                                        <button onClick={() => handleUnpaid(inv.id)} className="btn-warning whitespace-nowrap">
                                                            ✕ Mark Unpaid
                                                        </button>
                                                    </>
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

export default AdminInvoices;