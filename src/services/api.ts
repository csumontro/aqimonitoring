import axios from 'axios';
import type { PollutionData, CitySearchResult } from '../types';

const OPEN_METEO_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const getPollutionData = async (lat: number, lon: number): Promise<PollutionData> => {
    try {
        const response = await axios.get(OPEN_METEO_URL, {
            params: {
                latitude: lat,
                longitude: lon,
                current: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi',
                hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi',
                timezone: 'auto',
                forecast_days: 1
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching pollution data:", error);
        // Fallback mock data
        return {
            latitude: lat,
            longitude: lon,
            generationtime_ms: 0,
            utc_offset_seconds: 0,
            timezone: "UTC",
            timezone_abbreviation: "UTC",
            hourly_units: {
                time: "iso8601",
                pm10: "µg/m³",
                pm2_5: "µg/m³",
                carbon_monoxide: "µg/m³",
                nitrogen_dioxide: "µg/m³",
                sulphur_dioxide: "µg/m³",
                ozone: "µg/m³",
                european_aqi: "index"
            },
            hourly: {
                time: [],
                pm10: [],
                pm2_5: [],
                carbon_monoxide: [],
                nitrogen_dioxide: [],
                sulphur_dioxide: [],
                ozone: [],
                european_aqi: []
            },
            current_units: {
                time: "iso8601",
                interval: "seconds",
                pm10: "µg/m³",
                pm2_5: "µg/m³",
                carbon_monoxide: "µg/m³",
                nitrogen_dioxide: "µg/m³",
                sulphur_dioxide: "µg/m³",
                ozone: "µg/m³",
                european_aqi: "index"
            },
            current: {
                time: new Date().toISOString(),
                interval: 900,
                european_aqi: 50,
                pm10: 20,
                pm2_5: 10,
                carbon_monoxide: 200,
                nitrogen_dioxide: 15,
                sulphur_dioxide: 5,
                ozone: 50
            }
        };
    }
};

export const searchCity = async (query: string): Promise<CitySearchResult[]> => {
    try {
        const response = await axios.get(GEO_URL, {
            params: {
                name: query,
                count: 5,
                language: 'en',
                format: 'json'
            },
        });

        if (!response.data.results) return [];

        return response.data.results.map((item: any) => ({
            name: item.name,
            lat: item.latitude,
            lon: item.longitude,
            country: item.country_code,
            state: item.admin1
        }));
    } catch (error) {
        console.error("Error searching city:", error);
        return [];
    }
};

export const getBatchPollutionData = async (coordinates: { lat: number, lon: number }[]): Promise<PollutionData[]> => {
    try {
        const lats = coordinates.map(c => c.lat).join(',');
        const lons = coordinates.map(c => c.lon).join(',');

        const response = await axios.get(OPEN_METEO_URL, {
            params: {
                latitude: lats,
                longitude: lons,
                current: 'european_aqi', // Only fetch AQI for the heatmap to keep it light
                timezone: 'auto'
            }
        });

        // Open-Meteo returns an array of results for batch requests
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            // If single result returned (shouldn't happen with multiple coords but safe to handle)
            return [response.data];
        }
    } catch (error) {
        console.error("Error fetching batch pollution data:", error);
        return [];
    }
};
export const getCityName = async (lat: number, lon: number): Promise<string> => {
    try {
        const response = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
            params: {
                latitude: lat,
                longitude: lon,
                localityLanguage: 'en'
            },
        });

        const { city, locality } = response.data;

        if (locality && city && locality !== city) {
            return `${locality}, ${city}`;
        }

        return locality || city || "Unknown Location";
    } catch (error) {
        console.error("Error getting city name:", error);
        return "Unknown Location";
    }
};
