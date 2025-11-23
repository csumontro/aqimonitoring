export interface OpenMeteoPollutionData {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    hourly_units: {
        time: string;
        pm10: string;
        pm2_5: string;
        carbon_monoxide: string;
        nitrogen_dioxide: string;
        sulphur_dioxide: string;
        ozone: string;
        european_aqi: string;
    };
    hourly: {
        time: string[];
        pm10: number[];
        pm2_5: number[];
        carbon_monoxide: number[];
        nitrogen_dioxide: number[];
        sulphur_dioxide: number[];
        ozone: number[];
        european_aqi: number[];
    };
    current_units: {
        time: string;
        interval: string;
        pm10: string;
        pm2_5: string;
        carbon_monoxide: string;
        nitrogen_dioxide: string;
        sulphur_dioxide: string;
        ozone: string;
        european_aqi: string;
    };
    current: {
        time: string;
        interval: number;
        pm10: number;
        pm2_5: number;
        carbon_monoxide: number;
        nitrogen_dioxide: number;
        sulphur_dioxide: number;
        ozone: number;
        european_aqi: number;
    };
}

// Alias for easier refactoring
export type PollutionData = OpenMeteoPollutionData;

export interface CitySearchResult {
    name: string;
    local_names?: { [key: string]: string };
    lat: number;
    lon: number;
    country: string;
    state?: string;
}
