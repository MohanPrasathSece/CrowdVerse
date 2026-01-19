import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EarlyAccess = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [msg, setMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');

        try {
            const API_URL = process.env.REACT_APP_API_URL || '/api';
            await axios.post(`${API_URL}/beta/signup`, formData);

            setIsSuccess(true);
            localStorage.setItem('cv_beta_signed_up', 'true');
            setMsg('Success! You are on the list.');
        } catch (err) {
            setMsg(err.response?.data?.message || 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary-black flex items-center justify-center p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute top-8 left-0 right-0">
                <Link to="/" className="inline-flex items-center text-light-gray hover:text-off-white transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>
            </div>

            <div className="bg-secondary-black border border-dark-gray rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-slideUp">
                {!isSuccess ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-off-white mb-2 tracking-tight">Claim Early Access</h2>
                            <p className="text-light-gray leading-relaxed text-sm">
                                Join the waiting list and get <span className="text-emerald-400 font-bold">6 months of Pro Intelligence FREE</span> upon official launch.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-light-gray/70 mb-1 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-primary-black border border-dark-gray/60 rounded-xl px-4 py-3 text-off-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-light-gray/70 mb-1 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-primary-black border border-dark-gray/60 rounded-xl px-4 py-3 text-off-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-light-gray/70 mb-1 ml-1">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-primary-black border border-dark-gray/60 rounded-xl px-4 py-3 text-off-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            {msg && <div className={`text-sm text-center ${isSuccess ? 'text-emerald-400' : 'text-red-400'}`}>{msg}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-primary-black font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? 'Joining...' : 'Get Priority Access'}
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-light-gray/40 uppercase tracking-widest font-bold">No Credit Card Required · Join 2.4k+ others</p>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-off-white mb-4 tracking-tight">You're on the list!</h3>
                        <p className="text-light-gray leading-relaxed mb-8">
                            Thanks for your interest in CrowdVerse. We've reserved your <span className="text-emerald-400 font-bold">6 months of FREE Premium access</span>.
                            We'll email you at <span className="text-off-white font-medium">{formData.email}</span> as soon as we launch.
                        </p>
                        <Link to="/" className="inline-block w-full bg-dark-gray hover:bg-dark-gray/80 text-off-white font-semibold py-4 rounded-xl transition-all">
                            Back to Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EarlyAccess;
