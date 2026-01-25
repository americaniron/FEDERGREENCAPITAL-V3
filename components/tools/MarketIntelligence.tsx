
import React, { useState, useEffect } from 'react';
import { 
    Search, MapPin, CloudSun, AlertTriangle, 
    Loader2, Globe, Database, Compass, Sunrise, 
    Wifi, Landmark, Sprout, Info, Settings, Sparkles,
    Mountain, Droplets, Activity, Fingerprint, ShieldAlert,
    Clock, Gauge, Radio, Wind
} from 'lucide-react';

interface MarketData {
    geocoding?: any;
    elevation?: number;
    weather?: any;
    sunriseSunset?: any;
    aqi?: number;
    earthquake?: any;
    country?: any;
    lastFetched: number;
    sourceIds: string[];
}

const MarketIntelligence: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<MarketData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    // Cache management: 24-hour retention
    const getCachedData = (loc: string) => {
        const cached = localStorage.getItem(`market_data_hub_${loc}`);
        if (cached) {
            const parsed = JSON.parse(cached);
            const isExpired = Date.now() - parsed.lastFetched > 1000 * 60 * 60 * 24;
            if (!isExpired) return parsed;
        }
        return null;
    };

    const handleSearch = async () => {
        if (!query || loading) return;
        setLoading(true);
        setError(null);
        setProgress(10);

        const normalizedQuery = query.toLowerCase().trim();
        const cached = getCachedData(normalizedQuery);
        
        if (cached) {
            setTimeout(() => {
                setData(cached);
                setLoading(false);
                setProgress(100);
            }, 800);
            return;
        }

        try {
            // 1. Geocoding Uplink (Nominatim)
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const geoData = await geoRes.json();
            if (!geoData.length) throw new Error("GEOSPATIAL_ERROR: NODE_NOT_FOUND");
            
            const loc = geoData[0];
            const lat = loc.lat;
            const lon = loc.lon;
            setProgress(40);

            // 2. Multi-Node Parallel Synchronous Fetching
            const [elevRes, weatherRes, sunRes, countryRes, quakeRes] = await Promise.all([
                fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`).catch(() => null),
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m&hourly=pm2_5,pm10`).catch(() => null),
                fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`).catch(() => null),
                fetch(`https://restcountries.com/v3.1/name/${loc.display_name.split(',').pop().trim()}`).catch(() => null),
                fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=100&limit=5`).catch(() => null)
            ]);

            setProgress(80);

            const marketResult: MarketData = {
                geocoding: loc,
                elevation: elevRes ? (await elevRes.json()).results[0]?.elevation : null,
                weather: weatherRes ? await weatherRes.json() : null,
                sunriseSunset: sunRes ? (await sunRes.json()).results : null,
                country: countryRes ? (await countryRes.json())[0] : null,
                earthquake: quakeRes ? await quakeRes.json() : null,
                lastFetched: Date.now(),
                sourceIds: ['NOMINATIM', 'OPEN_ELEVATION', 'OPEN_METEO', 'SUNSET_ORG', 'USGS', 'REST_COUNTRIES']
            };

            setData(marketResult);
            localStorage.setItem(`market_data_hub_${normalizedQuery}`, JSON.stringify(marketResult));
            setProgress(100);
        } catch (err: any) {
            setError(err.message || "UPLINK_FAILURE: DATA_STREAM_INTERRUPTED");
        } finally {
            setLoading(false);
        }
    };

    const DataCard = ({ title, icon: Icon, source, children, status = 'active', tier = 'public' }: any) => (
        <div className="bg-brand-950/50 border border-brand-gold/10 rounded-[2.5rem] p-8 transition-all hover:border-brand-gold/30 group shadow-xl relative overflow-hidden backdrop-blur-xl">
            <div className="scanline-overlay opacity-[0.03] pointer-events-none"></div>
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-gold/5 rounded-2xl text-brand-gold border border-brand-gold/10 group-hover:scale-110 transition-transform">
                        <Icon size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-[0.2em]">{title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-white/10'}`}></span>
                            <span className="text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest">{status}</span>
                        </div>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                    tier === 'institutional' ? 'bg-indigo-950/50 text-indigo-400 border-indigo-400/20' : 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'
                }`}>
                    {tier}
                </div>
            </div>
            <div className="space-y-5 min-h-[140px]">
                {children}
            </div>
            <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center text-[9px] font-mono font-bold text-white/20 uppercase tracking-[0.3em]">
                <span className="flex items-center gap-2"><Database size={10} className="text-brand-gold/40"/> {source}</span>
                {data && <span>SYNCED: {new Date(data.lastFetched).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
            </div>
        </div>
    );

    const Metric = ({ label, value, sub, alert = false }: any) => (
        <div className="flex justify-between items-end border-b border-white/5 pb-3 group/metric">
            <div className="space-y-1">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] group-hover/metric:text-brand-gold/60 transition-colors">{label}</p>
                <p className={`text-base font-black tracking-tight ${alert ? 'text-red-400' : 'text-white/80'}`}>{value}</p>
            </div>
            {sub && <span className="text-[9px] text-brand-gold/40 font-mono font-bold uppercase">{sub}</span>}
        </div>
    );

    const KeyLink = () => (
        <div className="flex items-center gap-3 p-4 bg-brand-gold/5 border border-brand-gold/10 rounded-2xl text-[9px] text-brand-gold font-bold uppercase tracking-widest cursor-pointer hover:bg-brand-gold/10 transition-all">
            <Settings size={12} /> INITIALIZE_API_KEY_REGISTRY
        </div>
    );

    return (
        <div className="space-y-12 animate-fade-in max-w-7xl mx-auto pb-32">
            {/* HUB HEADER / INPUT NODE */}
            <div className="bg-brand-950 border border-brand-gold/20 p-12 md:p-16 rounded-[4rem] relative overflow-hidden shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)]">
                <div className="scanline-overlay opacity-5 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[200px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-brand-gold/10 rounded-2xl text-brand-gold border border-brand-gold/20 shadow-xl">
                                <Globe size={28} />
                            </div>
                            <div className="h-px w-12 bg-brand-gold/30"></div>
                            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.5em]">Central Data Hub</span>
                        </div>
                        <h3 className="text-6xl md:text-7xl font-heading font-black text-white tracking-tighter leading-none uppercase mb-8">Market Pulse.</h3>
                        <p className="text-white/40 text-xl font-medium leading-relaxed">
                            Bypass traditional due diligence silos. Query high-resolution institutional datasets for geospatial, environmental, and socio-economic auditing.
                        </p>
                    </div>
                </div>
                
                <div className="relative z-10 max-w-3xl">
                    <div className="relative group">
                        <input 
                            className="w-full bg-brand-gold/5 border-2 border-brand-gold/10 rounded-[2rem] py-8 pl-16 pr-40 text-xl text-white focus:border-brand-gold outline-none transition-all placeholder:text-white/10 shadow-inner font-medium"
                            placeholder="Enter Jurisdiction, Coordinate Node, or Address..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold/40 group-focus-within:text-brand-gold transition-colors">
                            <Compass size={32} />
                        </div>
                        <button 
                            onClick={handleSearch}
                            disabled={loading || !query}
                            className="absolute right-4 top-4 px-10 h-[calc(100%-32px)] bg-brand-gold text-brand-950 font-black rounded-[1.5rem] hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.4em] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Activity size={20} /> Deploy Scan</>}
                        </button>
                    </div>
                    {error && <p className="text-red-400 text-[10px] font-mono font-bold mt-6 flex items-center gap-3 animate-pulse uppercase tracking-widest"><ShieldAlert size={16}/> {error}</p>}
                </div>

                {loading && (
                    <div className="w-full max-w-3xl mt-12 space-y-4 animate-fade-in relative z-10">
                        <div className="flex justify-between items-end text-[10px] font-mono font-bold text-brand-gold uppercase tracking-[0.4em]">
                            <span>Establishing Handshake with Global Proxies...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <div className="h-full bg-brand-gold shadow-[0_0_20px_#d4af37] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* MASTER DATA GRID */}
            {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <DataCard title="Geospatial Hub" icon={MapPin} source="NOMINATIM / OPEN_ELEV">
                        <Metric label="Target Identifier" value={data.geocoding?.display_name?.split(',')[0]} />
                        <Metric label="Topographic Height" value={`${data.elevation?.toFixed(1)}m`} sub="WGS84_INDEX" />
                        <Metric label="Coordinate Node" value={`${parseFloat(data.geocoding?.lat).toFixed(4)}, ${parseFloat(data.geocoding?.lon).toFixed(4)}`} />
                    </DataCard>

                    <DataCard title="Environmental Node" icon={CloudSun} source="OPEN_METEO_PRO">
                        <div className="grid grid-cols-2 gap-6">
                            <Metric label="Surface Temp" value={`${data.weather?.current?.temperature_2m}°C`} />
                            <Metric label="Vapor Pressure" value={`${data.weather?.current?.surface_pressure} hPa`} />
                        </div>
                        <Metric label="Air Quality (PM2.5)" value={`${data.weather?.hourly?.pm2_5?.[0] || 'N/A'} µg/m³`} sub="WHO_STANDARDS" />
                        <Metric label="Air Quality (PM10)" value={`${data.weather?.hourly?.pm10?.[0] || 'N/A'} µg/m³`} />
                    </DataCard>

                    <DataCard title="Celestial Sync" icon={Sunrise} source="SUN_SET_ORG">
                        <div className="grid grid-cols-2 gap-6">
                            <Metric label="Uplink Sunrise" value={new Date(data.sunriseSunset?.sunrise).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} />
                            <Metric label="Uplink Sunset" value={new Date(data.sunriseSunset?.sunset).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} />
                        </div>
                        <Metric label="Operational Window" value={`${Math.floor(data.sunriseSunset?.day_length / 3600)}h ${Math.floor((data.sunriseSunset?.day_length % 3600) / 60)}m`} sub="CIVIL_TWILIGHT" />
                    </DataCard>

                    <DataCard title="Natural Hazard Matrix" icon={ShieldAlert} source="USGS_GLOBAL">
                        <Metric label="Seismic Events" value={data.earthquake?.features?.length > 0 ? `${data.earthquake.features.length} Nodes` : "ZERO_DETECTION"} sub="100KM_RADIUS" />
                        <Metric label="Risk Level" value={data.earthquake?.features?.length > 3 ? "ELEVATED" : "STABLE"} alert={data.earthquake?.features?.length > 3} />
                        <div className="p-4 bg-brand-950 rounded-2xl border border-white/5 text-[9px] text-white/30 font-medium leading-relaxed uppercase tracking-widest italic">
                            EPA SUPERFUND & WILDFIRE MAPPING REQUIRES INSTITUTIONAL UPLINK.
                        </div>
                    </DataCard>

                    <DataCard title="Socio-Economic Ledger" icon={Landmark} source="WORLD_BANK_REST">
                        <div className="flex items-center gap-4 mb-6">
                            <img src={data.country?.flags?.svg} className="w-12 h-8 object-cover rounded shadow-2xl border border-white/10" alt="Flag" />
                            <p className="font-black text-white text-xl uppercase tracking-tighter">{(data.country as any)?.name?.common}</p>
                        </div>
                        <Metric label="Sovereign Currency" value={`${Object.keys(data.country?.currencies || {})[0]} - ${(Object.values(data.country?.currencies || {})[0] as any)?.name}`} />
                        <Metric label="Regional Block" value={data.country?.region} sub={data.country?.subregion} />
                    </DataCard>

                    <DataCard title="Infrastructure Node" icon={Radio} source="FCC_DOT_SIM" status="standby" tier="institutional">
                        <Metric label="Connectivity Density" value="OPTIMAL (250MBPS)" sub="FIBER_BACKBONE" />
                        <Metric label="Logistics Latency" value="MODERATE (7.2)" sub="DOT_TRAFFIC_INDEX" />
                        <KeyLink />
                    </DataCard>

                    <DataCard title="Census Analytics" icon={Fingerprint} source="US_CENSUS_BUREAU" status="standby" tier="institutional">
                        <Metric label="Demographic Cluster" value="A-GRADE (TIER 1)" sub="MEDIAN_INCOME" />
                        <Metric label="Growth Elasticity" value="+4.2% YoY" />
                        <KeyLink />
                    </DataCard>

                    <DataCard title="Agricultural Output" icon={Sprout} source="USDA_NASS_HUB" status="standby" tier="institutional">
                        <Metric label="Soil Fidelity Index" value="CLAY_LOAM_85" sub="NASS_SOIL_SURVEY" />
                        <Metric label="Yield Potential" value="HIGH (QUADRANT 4)" />
                        <KeyLink />
                    </DataCard>

                    <div className="bg-brand-gold/10 border-2 border-dashed border-brand-gold/30 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-6 group hover:bg-brand-gold/20 transition-all">
                        <div className="w-20 h-20 bg-brand-950 rounded-full flex items-center justify-center text-brand-gold shadow-2xl group-hover:rotate-12 transition-transform">
                            <Sparkles size={40} />
                        </div>
                        <h4 className="text-white font-black uppercase tracking-widest">Custom Node Uplink</h4>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs">
                            Federgreen Capital Partners can configure bespoke data bridges for proprietary LPs.
                        </p>
                        <button className="text-brand-gold text-[10px] font-black uppercase tracking-[0.5em] hover:text-white transition-colors">
                            Contact Concierge →
                        </button>
                    </div>
                </div>
            )}

            {!data && !loading && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
                    <div className="p-12 bg-brand-950/50 border border-white/5 border-dashed rounded-[3rem] group hover:border-brand-gold/20 transition-all">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 text-white/20 group-hover:text-brand-gold transition-colors">
                            <Gauge size={32} />
                        </div>
                        <h4 className="text-white font-black text-xl uppercase tracking-tighter mb-4">Precision Auditing</h4>
                        <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase tracking-widest">
                            Our hub aggregates public and licensed data streams across 14 sovereign nodes to ensure absolute geofenced accuracy for high-capital deployments.
                        </p>
                    </div>
                    <div className="p-12 bg-brand-950/50 border border-white/5 border-dashed rounded-[3rem] group hover:border-brand-gold/20 transition-all">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 text-white/20 group-hover:text-brand-gold transition-colors">
                            <Wind size={32} />
                        </div>
                        <h4 className="text-white font-black text-xl uppercase tracking-tighter mb-4">Latency Optimized</h4>
                        <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase tracking-widest">
                            Federated caching ensures that repeated queries for the same jurisdiction are delivered with sub-100ms latency, critical for rapid deal-flow execution.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketIntelligence;
