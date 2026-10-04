import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { saveAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await login(email, password);
            console.log('token:', res.data.data.token);
            console.log('role:', res.data.data.role);
            const token = res.data.data.token;
            const role = res.data.data.role;
            saveAuth(token, role);

            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'TECHNICIAN') navigate('/technician');

        } catch (err) {
            console.log('Error:', err);
            setError('Invalid email or password');
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
            {/* Ambient glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md animate-slide-up">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4 shadow-glow">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-1">Servora</h1>
                    <p className="text-surface-400 text-sm">Sign in to your dashboard</p>
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
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="you@example.com"
                                className="input-premium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-surface-400 mb-2 uppercase tracking-wider">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="••••••••"
                                className="input-premium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <button
                            id="login-button"
                            onClick={handleLogin}
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
                                    Sign In
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-surface-800 text-center">
                        <p className="text-surface-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Customer links */}
                <div className="mt-6 text-center animate-fade-in">
                    <p className="text-surface-500 text-xs mb-3">Or continue as a customer</p>
                    <div className="flex gap-3 justify-center">
                        <Link to="/customer/request" className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Submit Request
                        </Link>
                        <span className="text-surface-700">•</span>
                        <Link to="/customer/track" className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Track Request
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;