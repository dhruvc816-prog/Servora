import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminRequests from './AdminRequests';
import AdminInvoices from './AdminInvoices';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('requests');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const tabs = [
        {
            id: 'requests',
            label: 'Requests',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
        },
        {
            id: 'invoices',
            label: 'Invoices',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-mesh">
            {/* Ambient effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed -bottom-24 -right-24 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px] pointer-events-none" />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-surface-100">Servora</h1>
                            <p className="text-xs text-surface-500">Admin Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs text-brand-300 font-medium">Admin</span>
                        </div>
                        <button
                            id="admin-logout-btn"
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-800/50 border border-surface-700 text-surface-300 text-sm hover:bg-surface-700/50 hover:border-surface-600 transition-all duration-300"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            id={`tab-${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                                activeTab === tab.id
                                    ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30 shadow-glow'
                                    : 'bg-surface-900/50 text-surface-400 border border-surface-800 hover:border-surface-700 hover:text-surface-300'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 py-6 animate-fade-in" key={activeTab}>
                {activeTab === 'requests' && <AdminRequests />}
                {activeTab === 'invoices' && <AdminInvoices />}
            </div>
        </div>
    );
}

export default AdminDashboard;