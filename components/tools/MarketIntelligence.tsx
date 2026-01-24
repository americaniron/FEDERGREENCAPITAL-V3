import React, { useState, useEffect, useCallback } from 'react';
import { 
    Search, MapPin, CloudSun, Users, AlertTriangle, TrendingUp, 
    Loader2, Globe, Database, Compass, Wind, Sunrise, Sunset, 
    Wifi, Car, Landmark, Sprout, Info, Settings, Save, Sparkles,
    Mountain, Droplets
} from 'lucide-react';
import { Input } from '../ui/FormElements';

interface MarketData {
    geocoding?: any;
    elevation?: number;
    weather?: any;
    sunriseSunset?: any;
    aqi?: number;
    earthquake?: any;
    country?: any;
    lastFetched: number;
}

const MarketIntelligence: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<MarketData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Cache management
    const getCachedData = (loc: string) => {
        const cached = localStorage.getItem(`market_data_${loc}`);
        if (cached) {
            const parsed = JSON.parse(cached);
            const isExpired = Date.now() - parsed.lastFetched > 1000 * 60 * 60 * 24; // 24hr cache
            if (!isExpired) return parsed;
        }
        return null;
    };

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        setError(null);

        const cached = getCachedData(query.toLowerCase());
        if (cached) {
            setData(cached);
            setLoading(false);
            return;
        }

        try {
            // 1. Geocoding (Nominatim)
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const geoData = await geoRes.json();
            if (!geoData.length) throw new Error("Location not found");
            const loc = geoData[0];
            const lat = loc.lat;
            const lon = loc.lon;

            // 2. Parallel Fetches for public APIs
            const [elevRes, weatherRes, sunRes, countryRes, quakeRes] = await Promise.all([
                fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`).catch(() => null),
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m&hourly=pm2_5,pm10`).catch(() => null),
                fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`).catch(() => null),
                fetch(`https://restcountries.com/v3.1/name/${loc.display_name.split(',').pop().trim()}`).catch(() => null),
                fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=100&limit=5`).catch(() => null)
            ]);

            const marketResult: MarketData = {
                geocoding: loc,
                elevation: elevRes ? (await elevRes.json()).results[0]?.elevation : null,
                weather: weatherRes ? await weatherRes.json() : null,
                sunriseSunset: sunRes ? (await sunRes.json()).results : null,
                country: countryRes ? (await countryRes.json())[0] : null,
                earthquake: quakeRes ? await quakeRes.json() : null,
                lastFetched: Date.now()
            };

            setData(marketResult);
            localStorage.setItem(`market_data_${query.toLowerCase()}`, JSON.stringify(marketResult));
        } catch (err: any) {
            setError(err.message || "Failed to fetch market data");
        } finally {
            setLoading(false);
        }
    };

    const DataCard = ({ title, icon: Icon, source, children, status = 'active' }: any) => (
        <div className="bg-brand-900/50 border border-brand-800 rounded-2xl p-6 transition-all hover:border-brand-700 group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-950 rounded-lg text-brand-gold border border-brand-800">
                        <Icon size={18} />
                    </div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">{title}</h4>
                </div>
                <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                    {status}
                </div>
            </div>
            <div className="space-y-4">
                {children}
            </div>
            <div className="mt-6 pt-4 border-t border-brand-800 flex justify-between items-center text-[9px] text-slate-500">
                <span className="flex items-center gap-1"><Database size={10}/> {source}</span>
                {data && <span>{new Date(data.lastFetched).toLocaleTimeString()}</span>}
            </div>
        </div>
    );

    const Metric = ({ label, value, sub }: any) => (
        <div className="flex justify-between items-end border-b border-brand-800/30 pb-2">
            <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                <p className="text-white font-bold text-sm mt-1">{value}</p>
            </div>
            {sub && <span className="text-[9px] text-brand-gold font-mono">{sub}</span>}
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
            {/* SEARCH HEADER */}
            <div className="bg-brand-900 border border-brand-800 p-10 rounded-3xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 max-w-2xl">
                    <h3 className="text-3xl font-heading font-bold text-white mb-2">Market Intelligence Hub</h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Query high-resolution global datasets for geospacial, environmental, and socio-economic due diligence.
                    </p>
                    
                    <div className="relative group">
                        <input 
                            className="w-full bg-brand-950 border border-brand-700 rounded-full py-5 pl-14 pr-32 text-white focus:ring-2 focus:ring-brand-gold outline-none transition-all placeholder:text-slate-600 shadow-inner group-hover:border-brand-600"
                            placeholder="Enter Address, City, or Coordinates..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold group-focus-within:animate-pulse">
                            <Compass size={24} />
                        </div>
                        <button 
                            onClick={handleSearch}
                            disabled={loading}
                            className="absolute right-3 top-3 px-8 h-10 bg-brand-gold text-brand-900 font-bold rounded-full hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <><Search size={16} /> Analyze</>}
                        </button>
                    </div>
                    {error && <p className="text-red-400 text-xs mt-4 flex items-center gap-2 animate-pulse"><AlertTriangle size={14}/> {error}</p>}
                </div>
            </div>

            {/* DATA GRID */}
            {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* GEOGRAPHY & ELEVATION */}
                    <DataCard title="Geospacial Profile" icon={MapPin} source="OSM / Nominatim">
                        <Metric label="Location" value={data.geocoding?.display_name?.split(',')[0]} />
                        <Metric label="Elevation" value={`${data.elevation?.toFixed(1)}m`} sub="Open Elevation" />
                        <Metric label="Lat/Lon" value={`${parseFloat(data.geocoding?.lat).toFixed(4)}, ${parseFloat(data.geocoding?.lon).toFixed(4)}`} />
                    </DataCard>

                    {/* CLIMATE & AIR QUALITY */}
                    <DataCard title="Environmental Data" icon={CloudSun} source="Open-Meteo">
                        <div className="grid grid-cols-2 gap-4">
                            <Metric label="Temp" value={`${data.weather?.current?.temperature_2m}°C`} />
                            <Metric label="Humidity" value={`${data.weather?.current?.relative_humidity_2m}%`} />
                            <Metric label="Wind" value={`${data.weather?.current?.wind_speed_10m} km/h`} />
                            <Metric label="Pressure" value={`${data.weather?.current?.surface_pressure} hPa`} />
                        </div>
                        <Metric label="Air Quality (PM2.5)" value={`${data.weather?.hourly?.pm2_5?.[0] || 'N/A'} µg/m³`} sub="Hourly Index" />
                    </DataCard>

                    {/* SOLAR & TIME */}
                    <DataCard title="Solar Exposure" icon={Sunrise} source="Sunrise-Sunset.org">
                        <Metric label="Sunrise" value={new Date(data.sunriseSunset?.sunrise).toLocaleTimeString()} />
                        <Metric label="Sunset" value={new Date(data.sunriseSunset?.sunset).toLocaleTimeString()} />
                        <Metric label="Day Length" value={`${Math.floor(data.sunriseSunset?.day_length / 3600)}h ${Math.floor((data.sunriseSunset?.day_length % 3600) / 60)}m`} />
                    </DataCard>

                    {/* HAZARD RISK */}
                    <DataCard title="Natural Hazards" icon={AlertTriangle} source="USGS / USGS.gov">
                        <Metric label="Recent Activity" value={data.earthquake?.features?.length > 0 ? `${data.earthquake.features.length} Events` : "No Recent Quakes"} sub="100km Radius" />
                        <Metric label="Seismic Risk" value={data.earthquake?.features?.length > 5 ? "Elevated" : "Low Baseline"} />
                        <div className="p-3 bg-brand-950 rounded border border-brand-800 text-[10px] text-slate-400 italic">
                            Wildfire risk and Flood mapping require localized FEMA/USDA API keys. Simulation active.
                        </div>
                    </DataCard>

                    {/* SOCIO-ECONOMIC (REST COUNTRIES) */}
                    <DataCard title="Socio-Economic" icon={Landmark} source="REST Countries">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={data.country?.flags?.svg} className="w-10 h-6 object-cover rounded shadow" alt="Flag" />
                            <p className="font-bold text-white text-lg">{(data.country as any)?.name?.common}</p>
                        </div>
                        {/* Cast Object.values result to any to access .name property which is missing on unknown type */}
                        <Metric label="Currency" value={`${Object.keys(data.country?.currencies || {})[0]} - ${(Object.values(data.country?.currencies || {})[0] as any)?.name}`} />
                        <Metric label="Region" value={data.country?.region} sub={data.country?.subregion} />
                        <Metric label="Gini Coefficient" value={Object.values(data.country?.gini || {})[0] || "N/A"} />
                    </DataCard>

                    {/* INFRASTRUCTURE STUBS */}
                    <DataCard title="Infrastructure" icon={Wifi} source="FCC / DOT (Simulated)" status="key-required">
                        <Metric label="Broadband Speed" value="~250 Mbps" sub="FCC Form 477" />
                        <Metric label="Traffic Density" value="Moderate (7.2)" sub="DOT AADT" />
                        <div className="flex items-center gap-2 p-3 bg-brand-950 rounded border border-brand-800 text-[10px] text-brand-gold">
                            <Settings size={14} /> Connect FCC API Key to fetch live coverage maps.
                        </div>
                    </DataCard>
                </div>
            )}

            {/* DOCUMENTATION & SOURCES */}
            {!data && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
                    <div className="bg-brand-950/50 border border-brand-800 p-8 rounded-3xl">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-3"><Sprout className="text-brand-gold"/> Agricultural Insights</h4>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            Federgreen Capital integrates with the USDA NASS Quick Stats API to provide soil quality, crop yield history, and land valuation data for domestic acquisitions.
                        </p>
                        <button className="text-brand-gold text-xs font-bold uppercase tracking-widest hover:underline">View Integration Guide →</button>
                    </div>
                    <div className="bg-brand-950/50 border border-brand-800 p-8 rounded-3xl">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-3"><Info className="text-brand-gold"/> EPA Superfund Awareness</h4>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            Our compliance engine cross-references property boundaries with the EPA Envirofacts database to identify localized environmental liabilities and clean-up sites.
                        </p>
                        <button className="text-brand-gold text-xs font-bold uppercase tracking-widest hover:underline">Compliance Standards →</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketIntelligence;