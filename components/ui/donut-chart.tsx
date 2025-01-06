export function DonutChart(props: {color: string, size?: number, disabled?: boolean, percentage: number}) {
    const radius = 15.91549431;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (props.percentage / 100) * circumference;

    return (
        <svg width={props.size ?? 100} height={props.size ?? 100} viewBox="0 0 42 42" style={{transform: 'rotate(-90deg)'}}>
            <circle
                className="donut-ring"
                cx="21"
                cy="21"
                r={radius}
                fill="transparent"
                stroke={props.disabled ? "#9ca3af" : "#E5E7EB"}
                strokeWidth="4"
            />
            <circle
                className="donut-segment"
                fill="transparent"
                cx="21"
                cy="21"
                r={radius}
                stroke={props.color}
                strokeWidth="4"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
            />
        </svg>
    );
}
