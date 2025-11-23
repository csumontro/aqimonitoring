export const getAQIColor = (aqi: number) => {
    switch (aqi) {
        case 1: return 'bg-green-500'; // Good
        case 2: return 'bg-yellow-400'; // Fair
        case 3: return 'bg-orange-500'; // Moderate
        case 4: return 'bg-red-500'; // Poor
        case 5: return 'bg-purple-600'; // Very Poor
        default: return 'bg-gray-400';
    }
};

export const getAQIHexColor = (aqi: number) => {
    switch (aqi) {
        case 1: return '#22c55e'; // Good
        case 2: return '#facc15'; // Fair
        case 3: return '#f97316'; // Moderate
        case 4: return '#ef4444'; // Poor
        case 5: return '#9333ea'; // Very Poor
        default: return '#9ca3af';
    }
};

export const getAQIDescription = (aqi: number) => {
    switch (aqi) {
        case 1: return 'Good';
        case 2: return 'Fair';
        case 3: return 'Moderate';
        case 4: return 'Poor';
        case 5: return 'Very Poor';
        default: return 'Unknown';
    }
};

export const getScaleAQI = (aqi: number) => {
    if (aqi <= 20) return 1;
    if (aqi <= 40) return 2;
    if (aqi <= 60) return 3;
    if (aqi <= 80) return 4;
    return 5;
};
