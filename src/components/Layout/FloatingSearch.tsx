import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchCity } from '../../services/api';
import type { CitySearchResult } from '../../types';

interface FloatingSearchProps {
    onLocationSelect: (lat: number, lon: number) => void;
}

export default function FloatingSearch({ onLocationSelect }: FloatingSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CitySearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                try {
                    const data = await searchCity(query);
                    setResults(data);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (city: CitySearchResult) => {
        onLocationSelect(city.lat, city.lon);
        setQuery(city.name);
        setIsOpen(false);
    };

    return (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-[1000]" ref={searchRef}>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {loading ? (
                        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                    ) : (
                        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    )}
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-4 py-3 bg-card/80 backdrop-blur-md border border-border/50 rounded-full text-sm shadow-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                    placeholder="Search for a city..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                />
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute mt-2 w-full bg-card/90 backdrop-blur-md rounded-2xl shadow-xl border border-border/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <ul className="max-h-60 overflow-y-auto custom-scrollbar py-2">
                        {results.map((city, index) => (
                            <li key={`${city.lat}-${city.lon}-${index}`}>
                                <button
                                    onClick={() => handleSelect(city)}
                                    className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors flex items-center gap-3 group"
                                >
                                    <div className="bg-muted p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                                        <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-foreground">{city.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {city.state ? `${city.state}, ` : ''}{city.country}
                                        </div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
