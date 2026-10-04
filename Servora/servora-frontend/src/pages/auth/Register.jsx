import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';

function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'TECHNICIAN'
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            setError('');
            await register(form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleRegister();
    };

    const roleOptions = [
        { value: 'TECHNICIAN', label: 'Technician', icon: '🔧', desc: 'Handle service requests' },
        { value: 'ADMIN', label: 'Admin', icon: '👑', desc: 'Manage the platform' },
    ];

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
            {/* Ambient glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md animate-slide-up">
                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-brand-600 mb-4 shadow-glow">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-1">Join Servora</h1>
                    <p className="text-surface-400 text-sm">Create your account to get started</p>
                </div>

                {/* Card */}
                <div className="glass-card p-8">
                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-scale-in">
                            <p className="text-red-400 text-sm text-center flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Full Name</label>
                            <input
                                id="register-name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                className="input-premium"
                                value={form.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Email</label>
                            <input
                                id="register-email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                className="input-premium"
                                value={form.email}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Phone</label>
                            <input
                                id="register-phone"
                                name="phone"
                                type="text"
                                placeholder="+91 98765 43210"
                                className="input-premium"
                                value={form.phone}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Password</label>
                            <input
                                id="register-password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                className="input-premium"
                                value={form.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Role selector cards */}
                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Role</label>
                            <div className="grid grid-cols-2 gap-3">
                                {roleOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, role: opt.value })}
                                        className={`p-3 rounded-xl border text-left transition-all duration-300 ${form.role === opt.value
                                            ? 'border-brand-500/50 bg-brand-500/10 shadow-glow'
                                            : 'border-surface-700 bg-surface-900/50 hover:border-surface-600'
                                            }`}
                                    >
                                        <span className="text-lg">{opt.icon}</span>
                                        <p className={`text-sm font-medium mt-1 ${form.role === opt.value ? 'text-brand-300' : 'text-surface-300'}`}>
                                            {opt.label}
                                        </p>
                                        <p className="text-xs text-surface-500 mt-0.5">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            id="register-button"
                            onClick={handleRegister}
                            disabled={loading}
                            className="btn-primary mt-2 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <>
                                    Create Account
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-surface-800 text-center">
                        <p className="text-surface-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;