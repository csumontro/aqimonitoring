import type { PollutionData } from '../../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PollutantCard from './PollutantCard';
import { getAQIDescription, getAQIColor } from '../../utils/aqi';

interface AnalyticsProps {
    data: PollutionData | null;
    loading: boolean;
}

export default function Analytics({ data, loading }: AnalyticsProps) {
    if (loading) {
        return <div className="animate-pulse h-full w-full bg-muted rounded-xl"></div>;
    }

    if (!data || !data.current) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a location to view analytics
            </div>
        );
    }

    const current = data.current;
    const aqi = current.european_aqi;

    // Helper to map AQI to 1-5 scale for color/description
    const getScaleAQI = (aqi: number) => {
        if (aqi <= 20) return 1;
        if (aqi <= 40) return 2;
        if (aqi <= 60) return 3;
        if (aqi <= 80) return 4;
        return 5;
    };

    const scaleAQI = getScaleAQI(aqi);

    const chartData = [
        { name: 'CO', value: current.carbon_monoxide, fill: '#8884d8' },
        { name: 'NO2', value: current.nitrogen_dioxide, fill: '#82ca9d' },
        { name: 'O3', value: current.ozone, fill: '#ffc658' },
        { name: 'SO2', value: current.sulphur_dioxide, fill: '#ff8042' },
        { name: 'PM2.5', value: current.pm2_5, fill: '#8dd1e1' },
        { name: 'PM10', value: current.pm10, fill: '#a4de6c' },
    ];

    return (
        <div className="space-y-8 p-6 h-full overflow-y-auto custom-scrollbar">
            {/* Header Section */}
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">London</h2>
                    <p className="text-muted-foreground font-medium">Current Air Quality</p>
                </div>

                <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-full ${getAQIColor(scaleAQI)} text-white shadow-2xl ring-4 ring-white/10`}>
                    <span className="text-4xl font-bold">{aqi}</span>
                    <span className="text-xs font-medium uppercase tracking-wider opacity-90">AQI</span>
                </div>

                <div className="px-4 py-1.5 rounded-full bg-muted/50 text-sm font-medium text-muted-foreground">
                    {getAQIDescription(scaleAQI)}
                </div>
            </div>

            {/* Key Pollutants Grid */}
            <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">Pollutants</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <PollutantCard
                        name="PM2.5"
                        value={current.pm2_5}
                        unit="μg/m³"
                        description="Fine particles"
                    />
                    <PollutantCard
                        name="PM10"
                        value={current.pm10}
                        unit="μg/m³"
                        description="Coarse particles"
                    />
                    <PollutantCard
                        name="Ozone"
                        value={current.ozone}
                        unit="μg/m³"
                        description="Ozone"
                    />
                    <PollutantCard
                        name="NO2"
                        value={current.nitrogen_dioxide}
                        unit="μg/m³"
                        description="Nitrogen Dioxide"
                    />
                    <PollutantCard
                        name="SO2"
                        value={current.sulphur_dioxide}
                        unit="μg/m³"
                        description="Sulfur Dioxide"
                    />
                    <PollutantCard
                        name="CO"
                        value={current.carbon_monoxide}
                        unit="μg/m³"
                        description="Carbon Monoxide"
                    />
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-card/50 rounded-2xl p-6 shadow-sm border border-border/50 h-64">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Composition</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                borderColor: 'transparent',
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)'
                            }}
                            itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                            cursor={{ fill: 'hsl(var(--muted)/0.3)', radius: 4 }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={40}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Health Recommendations */}
            <div className="bg-card/50 rounded-2xl p-6 shadow-sm border border-border/50">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Health Guide</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {scaleAQI <= 2 ? "Air quality is satisfactory. Enjoy your outdoor activities!" :
                        scaleAQI <= 3 ? "Sensitive individuals should limit prolonged outdoor exertion." :
                            "Everyone may begin to experience health effects. Avoid outdoor activities if possible."}
                </p>
            </div>
        </div>
    );
}
