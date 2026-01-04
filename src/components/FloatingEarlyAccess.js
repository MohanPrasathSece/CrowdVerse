import React, { useState } from 'react';
import BetaSignupModal from './BetaSignupModal';

const FloatingEarlyAccess = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className="fixed bottom-8 right-8 z-[90] animate-bounce-slow"
                style={{ filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.3))' }}
            >
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="relative group flex items-center gap-3 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 p-2 sm:p-3 rounded-2xl hover:bg-emerald-500/20 transition-all duration-500 group"
                >
                    {/* Pulsing Aura */}
                    <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 animate-ping pointer-events-none opacity-20"></div>

                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-primary-black shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    {/* Text Label (visible on hover or lg screens) */}
                    <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
                        <div className="pr-4">
                            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400 opacity-60">Limited Space</div>
                            <div className="text-sm font-bold text-off-white">Early Access</div>
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute -top-2 -right-2 bg-red-500 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full border-2 border-primary-black animate-pulse">
                        HOT
                    </div>
                </button>
            </div>

            {/* We can render the modal here or if it's already in App.js we need a way to trigger it. 
                For simplicity and to fulfill "floating icon for early access", 
                having it open its own instance is fine, 
                but App.js already has <BetaSignupModal />. 
                I will modify BetaSignupModal to be triggerable or just use a local one.
            */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-secondary-black border border-dark-gray rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-slideUp">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-light-gray hover:text-off-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

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

                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-primary-black border border-dark-gray/60 rounded-xl px-5 py-4 text-off-white focus:outline-none focus:border-emerald-500/50 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    alert('Successfully added to waitlist!');
                                    setIsModalOpen(false);
                                }}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-primary-black font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-1 active:scale-95"
                            >
                                Get Priority Access
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-light-gray/40 uppercase tracking-widest font-bold">No Credit Card Required · Join 2.4k+ others</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingEarlyAccess;
