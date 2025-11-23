import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-card w-full max-w-md p-6 rounded-xl shadow-xl border border-border pointer-events-auto m-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Settings</h2>
                                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Data Source</h3>
                                    <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                                        Using <span className="font-medium text-foreground">Open-Meteo API</span> (Free, Public)
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">Units</h3>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
                                            Metric (µg/m³)
                                        </button>
                                        <button className="flex-1 py-2 px-4 bg-muted text-muted-foreground rounded-lg font-medium text-sm hover:bg-muted/80">
                                            Imperial
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">About</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Global Pollution Tracker v1.0.0
                                        <br />
                                        Built with React, Vite, and Tailwind CSS.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
