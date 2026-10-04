import { useState, useEffect } from 'react';
import { getMyJobs, updateStatus, getSummary } from '../../services/requestService';

const getStatusBadge = (status) => {
    const map = {
        ASSIGNED: 'badge-assigned',
        ACCEPTED: 'badge-accepted',
        IN_PROGRESS: 'badge-in-progress',
        COMPLETED: 'badge-completed',
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

const statusSteps = ['ASSIGNED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];

function TechnicianJobs() {
    const [jobs, setJobs] = useState([]);
    const [summaries, setSummaries] = useState({});
    const [loadingSummary, setLoadingSummary] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        const res = await getMyJobs();
        setJobs(res.data.data);
        setLoading(false);
    };

    const handleStatus = async (id, status) => {
        await updateStatus(id, status);
        fetchJobs();
    };

    const handleSummary = async (id) => {
        setLoadingSummary(prev => ({ ...prev, [id]: true }));
        const res = await getSummary(id);
        setSummaries({ ...summaries, [id]: res.data.data });
        setLoadingSummary(prev => ({ ...prev, [id]: false }));
    };

    const nextStatus = {
        ASSIGNED: 'ACCEPTED',
        ACCEPTED: 'IN_PROGRESS',
        IN_PROGRESS: 'COMPLETED',
    };

    const nextStatusLabel = {
        ASSIGNED: 'Accept Job',
        ACCEPTED: 'Start Work',
        IN_PROGRESS: 'Mark Complete',
    };

    const nextStatusIcon = {
        ASSIGNED: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ),
        ACCEPTED: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        IN_PROGRESS: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    const getProgressPercent = (status) => {
        const idx = statusSteps.indexOf(status);
        if (idx === -1) return 0;
        return ((idx + 1) / statusSteps.length) * 100;
    };

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-surface-100">My Jobs</h2>
                <p className="text-sm text-surface-500 mt-1">
                    {jobs.filter(j => j.status !== 'COMPLETED').length} active · {jobs.filter(j => j.status === 'COMPLETED').length} completed
                </p>
            </div>

            {/* Loading / Empty */}
            {loading ? (
                <div className="glass-card p-8 text-center">
                    <svg className="animate-spin h-8 w-8 mx-auto text-emerald-500 mb-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-surface-500 text-sm">Loading your jobs...</p>
                </div>
            ) : jobs.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <svg className="w-12 h-12 mx-auto text-surface-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-surface-400 font-medium">No jobs assigned yet</p>
                    <p className="text-surface-500 text-sm mt-1">Your assigned jobs will appear here</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="glass-card glass-card-hover p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                {/* Job info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg">🔧</span>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-surface-100 truncate">{job.customerName}</h3>
                                            <p className="text-sm text-surface-500">{job.customerPhone}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-surface-400 mb-4 leading-relaxed">{job.issueDescription}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className={`badge ${getPriorityBadge(job.priority)}`}>
                                            {job.priority}
                                        </span>
                                        <span className={`badge ${getStatusBadge(job.status)}`}>
                                            {job.status?.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mb-1">
                                        <div className="flex justify-between text-xs text-surface-500 mb-1.5">
                                            <span>Progress</span>
                                            <span>{Math.round(getProgressPercent(job.status))}%</span>
                                        </div>
                                        <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700 ease-out"
                                                style={{
                                                    width: `${getProgressPercent(job.status)}%`,
                                                    background: getProgressPercent(job.status) === 100
                                                        ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                                        : 'linear-gradient(90deg, #6366f1, #818cf8)',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row md:flex-col gap-2 md:ml-4">
                                    {nextStatus[job.status] && (
                                        <button
                                            onClick={() => handleStatus(job.id, nextStatus[job.status])}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:from-emerald-500/30 hover:to-emerald-600/30 transition-all duration-300 whitespace-nowrap"
                                            style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}
                                        >
                                            {nextStatusIcon[job.status]}
                                            {nextStatusLabel[job.status]}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleSummary(job.id)}
                                        disabled={loadingSummary[job.id]}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-brand-500/10 to-purple-500/10 text-brand-300 border border-brand-500/20 hover:from-brand-500/20 hover:to-purple-500/20 transition-all duration-300 whitespace-nowrap"
                                    >
                                        {loadingSummary[job.id] ? (
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        )}
                                        AI Summary
                                    </button>
                                </div>
                            </div>

                            {/* AI Summary */}
                            {summaries[job.id] && (
                                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-brand-500/5 to-purple-500/5 border border-brand-500/10 animate-scale-in">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span className="text-xs font-semibold text-brand-300 uppercase tracking-wider">AI Summary</span>
                                    </div>
                                    <p className="text-sm text-surface-300 leading-relaxed">{summaries[job.id]}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TechnicianJobs;