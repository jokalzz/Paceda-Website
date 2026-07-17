import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Map as MapIcon, Navigation, Filter, List, X, ExternalLink } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CategoryBadge } from '../../components/common/Badge';
import { supabase } from '../../lib/supabase';
import { KATEGORI_PETA, KELURAHAN_INFO } from '../../lib/constants';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createColoredIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);position:relative;"><div style="transform:rotate(45deg);width:10px;height:10px;background:white;border-radius:50%;position:absolute;top:6px;left:6px;"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

function FlyToLocation({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 17, { duration: 1.5 });
  }, [center, zoom]);
  return null;
}

export default function PetaDigitalPage() {
  const [lokasi, setLokasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedLokasi, setSelectedLokasi] = useState(null);
  const [showList, setShowList] = useState(false);
  const [flyTo, setFlyTo] = useState(null);

  const center = [KELURAHAN_INFO.latitude, KELURAHAN_INFO.longitude];

  useEffect(() => {
    fetchLokasi();
  }, []);

  async function fetchLokasi() {
    const { data } = await supabase
      .from('lokasi_peta')
      .select('*')
      .order('nama');
    if (data) setLokasi(data);
    setLoading(false);
  }

  const filtered = selectedKategori
    ? lokasi.filter((l) => l.kategori === selectedKategori)
    : lokasi;

  const sampleLokasi = lokasi.length > 0 ? lokasi : [
    { id: '1', nama: 'Kantor Kelurahan Paceda', kategori: 'kantor', latitude: 1.4477, longitude: 125.1932, deskripsi: 'Kantor pelayanan administrasi', alamat: 'Jl. Paceda' },
    { id: '2', nama: 'Posyandu Melati', kategori: 'posyandu', latitude: 1.4480, longitude: 125.1928, deskripsi: 'Posyandu untuk ibu dan anak', alamat: 'Lingkungan I' },
    { id: '3', nama: 'SD Negeri 1 Paceda', kategori: 'sekolah', latitude: 1.4475, longitude: 125.1940, deskripsi: 'Sekolah Dasar Negeri', alamat: 'Jl. Paceda' },
    { id: '4', nama: 'Gereja GMIM Paceda', kategori: 'ibadah', latitude: 1.4473, longitude: 125.1935, deskripsi: 'Gereja GMIM', alamat: 'Lingkungan II' },
    { id: '5', nama: 'Balai Pertemuan Paceda', kategori: 'balai', latitude: 1.4479, longitude: 125.1930, deskripsi: 'Balai pertemuan warga', alamat: 'Jl. Paceda' },
    { id: '6', nama: 'Warung Makan Bu Ina', kategori: 'umkm', latitude: 1.4482, longitude: 125.1925, deskripsi: 'Warung makan khas Manado', alamat: 'Lingkungan III' },
    { id: '7', nama: 'Lapangan Olahraga', kategori: 'fasilitas', latitude: 1.4476, longitude: 125.1938, deskripsi: 'Lapangan olahraga serbaguna', alamat: 'Lingkungan I' },
  ];

  const displayLokasi = selectedKategori
    ? sampleLokasi.filter((l) => l.kategori === selectedKategori)
    : sampleLokasi;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row relative">
      {/* Sidebar / Filter Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`
          ${showList ? 'flex' : 'hidden lg:flex'}
          flex-col w-full lg:w-96 bg-white border-r border-slate-200 z-20
          absolute lg:relative inset-0 lg:inset-auto
        `}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-blue-600" /> Peta Digital
              </h1>
              <p className="text-xs text-slate-400">Kelurahan Paceda</p>
            </div>
            <button
              onClick={() => setShowList(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedKategori('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                !selectedKategori ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Semua
            </button>
            {Object.entries(KATEGORI_PETA).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedKategori(selectedKategori === key ? '' : key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedKategori === key ? 'text-white' : 'text-slate-500 hover:bg-slate-200'
                }`}
                style={selectedKategori === key ? { backgroundColor: val.color } : { backgroundColor: '#f1f5f9' }}
              >
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {displayLokasi.map((loc) => {
            const kat = KATEGORI_PETA[loc.kategori] || {};
            return (
              <div
                key={loc.id}
                onClick={() => {
                  setSelectedLokasi(loc);
                  setFlyTo([loc.latitude, loc.longitude]);
                  setShowList(false);
                }}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  selectedLokasi?.id === loc.id
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${kat.color}15` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: kat.color }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{loc.nama}</p>
                    <p className="text-xs text-slate-400 truncate">{loc.alamat}</p>
                    <CategoryBadge category={loc.kategori} label={kat.label} color={kat.color} className="mt-1.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Map */}
      <div className="flex-1 relative">
        {/* Mobile toggle */}
        <button
          onClick={() => setShowList(true)}
          className="lg:hidden absolute top-4 left-4 z-20 bg-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 text-sm font-semibold text-slate-700"
        >
          <List className="w-4 h-4" /> Daftar Lokasi
        </button>

        <MapContainer
          center={center}
          zoom={16}
          className="w-full h-full z-10"
          style={{ minHeight: '400px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {flyTo && <FlyToLocation center={flyTo} zoom={18} />}

          {displayLokasi.map((loc) => {
            const kat = KATEGORI_PETA[loc.kategori] || {};
            return (
              <Marker
                key={loc.id}
                position={[loc.latitude, loc.longitude]}
                icon={createColoredIcon(kat.color || '#1E40AF')}
                eventHandlers={{
                  click: () => setSelectedLokasi(loc),
                }}
              >
                <Popup maxWidth={280}>
                  <div className="p-1">
                    {loc.foto_url && (
                      <img src={loc.foto_url} alt={loc.nama} className="w-full h-32 object-cover rounded-lg mb-2" />
                    )}
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{loc.nama}</h3>
                    <CategoryBadge category={loc.kategori} label={kat.label} color={kat.color} className="mb-2" />
                    {loc.deskripsi && <p className="text-xs text-slate-500 mb-1">{loc.deskripsi}</p>}
                    {loc.alamat && <p className="text-xs text-slate-400">📍 {loc.alamat}</p>}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold mt-2 hover:underline"
                    >
                      <Navigation className="w-3 h-3" /> Petunjuk Arah
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
