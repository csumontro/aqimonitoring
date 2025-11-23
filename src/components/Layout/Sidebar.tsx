import { useState, useEffect } from 'react';
import { Search, Map as MapIcon, BarChart2, Settings, Menu, X } from 'lucide-react';
import { searchCity } from '../../services/api';
import type { CitySearchResult } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    onLocationSelect: (lat: number, lon: number) => void;
    onAnalyticsClick: () => void;
    onSettingsClick: () => void;
}

export default function Sidebar({ onLocationSelect, onAnalyticsClick, onSettingsClick }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CitySearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setLoading(true);
                try {
                    const data = await searchCity(query);
                    setResults(data);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search is handled by useEffect now, but keep preventDefault to stop reload
    };

    const handleSelect = (city: CitySearchResult) => {
        onLocationSelect(city.lat, city.lon);
        setResults([]);
        setQuery('');
        // On mobile, close sidebar after selection
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    const handleNavClick = (callback: () => void) => {
        callback();
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-full shadow-lg border border-border"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <AnimatePresence>
                {(isOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className={`fixed md:static top-0 left-0 h-full w-80 bg-card border-r border-border z-40 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                    >
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-primary flex items-center gap-2 tracking-tight">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                                    <span className="text-primary-foreground text-xl font-bold">P</span>
                                </div>
                                Pollution<span className="text-primary">Tracker</span>
                            </h1>
                        </div>

                        <div className="px-6 pb-4">
                            <form onSubmit={handleSearch} className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search city..."
                                    className="w-full p-3 pl-10 rounded-xl bg-muted/50 hover:bg-muted text-foreground border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/70"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <Search className="absolute left-3 top-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" size={18} />
                                {loading && (
                                    <div className="absolute right-3 top-3.5 animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                                )}
                            </form>

                            {results.length > 0 && (
                                <div className="mt-2 bg-popover/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-border/50 absolute w-[calc(100%-3rem)] z-50">
                                    {results.map((city, index) => (
                                        <button
                                            key={`${city.lat}-${city.lon}-${index}`}
                                            className="w-full text-left p-3 hover:bg-primary/5 transition-colors border-b border-border/50 last:border-0"
                                            onClick={() => handleSelect(city)}
                                        >
                                            <div className="font-medium text-sm">{city.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {city.state ? `${city.state}, ` : ''}{city.country}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <nav className="flex-1 px-4 space-y-1">
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary font-medium transition-all hover:shadow-sm">
                                <MapIcon size={20} />
                                Map View
                            </button>
                            <button
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
                                onClick={() => handleNavClick(onAnalyticsClick)}
                            >
                                <BarChart2 size={20} />
                                Analytics
                            </button>
                            <button
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all"
                                onClick={() => handleNavClick(onSettingsClick)}
                            >
                                <Settings size={20} />
                                Settings
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
