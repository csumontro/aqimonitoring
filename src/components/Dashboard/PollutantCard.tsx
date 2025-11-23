
interface PollutantCardProps {
    name: string;
    value: number;
    unit: string;
    description: string;
}

export default function PollutantCard({ name, value, unit, description }: PollutantCardProps) {
    return (
        <div className="bg-card/50 p-4 rounded-2xl border border-border/50 hover:bg-card hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm text-muted-foreground group-hover:text-primary transition-colors">{name}</h4>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight">{value}</span>
                <span className="text-xs text-muted-foreground font-medium">{unit}</span>
            </div>
            <p className="text-xs text-muted-foreground/70 mt-1 truncate">{description}</p>
        </div>
    );
}
