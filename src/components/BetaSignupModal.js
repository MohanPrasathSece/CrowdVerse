import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BetaSignupModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [msg, setMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Handle manual open via event
        const handleManualOpen = () => setIsOpen(true);
        window.addEventListener('open-beta-modal', handleManualOpen);

        // Check if user has already seen/signed up
        const hasSignedUp = localStorage.getItem('cv_beta_signed_up');
        if (!hasSignedUp) {
            // Show after a small delay
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('open-beta-modal', handleManualOpen);
            };
        }
        return () => window.removeEventListener('open-beta-modal', handleManualOpen);
    }, []);

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

            // Close automatically after 3 seconds
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);
        } catch (err) {
            setMsg(err.response?.data?.message || 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        // Don't show again effectively for this session, or maybe for a day.
        // For now, we won't set permanent flag on close, allowing them to sign up later.
        // But to avoid annoyance, maybe set a session flag? 
        // User asked for "popup on website load", usually implies checking if not done.
        sessionStorage.setItem('cv_beta_modal_closed', 'true');
    };

    if (!isOpen) return null;

    if (sessionStorage.getItem('cv_beta_modal_closed') && !isSuccess) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-secondary-black border border-dark-gray rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-slideUp">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-light-gray hover:text-off-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {!isSuccess ? (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-off-white mb-2">🚀 Early Access</h2>
                            <p className="text-light-gray">
                                Get <span className="text-emerald-400 font-semibold">6 months of Premium FREE</span> by signing up for our app launch.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-light-gray/70 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-primary-black border border-dark-gray/60 rounded-lg px-4 py-3 text-off-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-light-gray/70 mb-1">Email (Required)</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-primary-black border border-dark-gray/60 rounded-lg px-4 py-3 text-off-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-light-gray/70 mb-1">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-primary-black border border-dark-gray/60 rounded-lg px-4 py-3 text-off-white focus:outline-none focus:border-emerald-500 transition-colors"
                                    placeholder="Phone number"
                                />
                            </div>

                            {msg && <div className="text-red-400 text-sm text-center">{msg}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-primary-black font-bold py-3 rounded-xl transition-all hover-scale"
                            >
                                {loading ? 'Joining...' : 'Claim Free Premium'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-off-white mb-2">You're In!</h3>
                        <p className="text-light-gray">
                            Thanks for joining. We'll be in touch soon with your premium access details.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BetaSignupModal;
