import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Share2 } from 'lucide-react';
import type { PollutionData } from '../../types';
import { getAQIDescription, getAQIHexColor, getScaleAQI } from '../../utils/aqi';

function PollutantItem({ name, value, unit }: { name: string, value?: number, unit: string }) {
    return (
        <div className="bg-background/50 rounded-xl p-2 text-center border border-border/30">
            <div className="text-[10px] text-muted-foreground font-medium mb-0.5">{name}</div>
            <div className="text-sm font-bold">{value || '-'} {unit && <span className="text-[10px]">{unit}</span>}</div>
        </div>
    );
}

interface FloatingDetailsProps {
    data: PollutionData | null;
    loading?: boolean;
    locationName?: string;
}

export default function FloatingDetails({ data, loading, locationName }: FloatingDetailsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!data && !loading) return null;

    const currentAQI = data?.current?.european_aqi || 0;

    const aqiColor = getAQIHexColor(getScaleAQI(currentAQI));

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();

        const text = `🌬️ Air Quality Update for ${locationName || 'Current Location'}

🌍 AQI: ${currentAQI} (${getAQIDescription(getScaleAQI(currentAQI))})

📊 Pollutants:
• PM2.5: ${data?.current?.pm2_5 || '-'} µg/m³
• PM10: ${data?.current?.pm10 || '-'} µg/m³
• NO₂: ${data?.current?.nitrogen_dioxide || '-'} µg/m³

Check more at: ${window.location.href}`;

        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-[1000]">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden"
            >
                {loading ? (
                    <div className="p-6 flex justify-center items-center h-24">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="p-4 md:p-5">
                        <div
                            className="flex items-center justify-between cursor-pointer md:cursor-default"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg shrink-0"
                                    style={{ backgroundColor: aqiColor, boxShadow: `0 0 20px ${aqiColor}60` }}
                                >
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
                                        {locationName || "Air Quality"}
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl md:text-4xl font-black tracking-tighter">{currentAQI}</span>
                                        <span
                                            className="text-xs md:text-sm font-bold px-2 py-0.5 rounded-full"
                                            style={{ backgroundColor: `${aqiColor}30`, color: aqiColor }}
                                        >
                                            {getAQIDescription(getScaleAQI(currentAQI))}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleShare}
                                    className="p-2 text-muted-foreground hover:text-[#25D366] transition-colors rounded-full hover:bg-[#25D366]/10"
                                    title="Share on WhatsApp"
                                >
                                    <Share2 size={20} />
                                </button>
                                <button className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors">
                                    {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {(isExpanded || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-3 gap-2">
                                        <PollutantItem name="PM2.5" value={data?.current?.pm2_5} unit="µg/m³" />
                                        <PollutantItem name="PM10" value={data?.current?.pm10} unit="µg/m³" />
                                        <PollutantItem name="NO₂" value={data?.current?.nitrogen_dioxide} unit="µg/m³" />
                                        <PollutantItem name="O₃" value={data?.current?.ozone} unit="µg/m³" />
                                        <PollutantItem name="SO₂" value={data?.current?.sulphur_dioxide} unit="µg/m³" />
                                        <PollutantItem name="CO" value={data?.current?.carbon_monoxide} unit="µg/m³" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
