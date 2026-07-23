import React, { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Star,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Crosshair,
  Info,
} from 'lucide-react';
import { BusinessListing } from '../types';

// Detect Google Maps API key from build define or environment
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Default center for Socorro, Texas
const SOCORRO_CENTER = { lat: 31.6582, lng: -106.2917 };

interface DirectoryMapProps {
  listings: BusinessListing[];
  onSelectListing: (listing: BusinessListing) => void;
  selectedListing?: BusinessListing | null;
}

// Calculate distance in miles
function getDistanceInMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Inner Marker Component to handle AdvancedMarker anchor & InfoWindow
function BusinessMapMarker({
  listing,
  isSelected,
  onSelect,
  userLocation,
}: {
  key?: React.Key;
  listing: BusinessListing;
  isSelected: boolean;
  onSelect: (listing: BusinessListing) => void;
  userLocation: { lat: number; lng: number } | null;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isOpen, setIsOpen] = useState(isSelected);

  useEffect(() => {
    setIsOpen(isSelected);
  }, [isSelected]);

  const distance = userLocation
    ? getDistanceInMiles(userLocation.lat, userLocation.lng, listing.lat, listing.lng)
    : listing.distanceMiles;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: listing.lat, lng: listing.lng }}
        title={listing.name}
        onClick={() => {
          setIsOpen(true);
          onSelect(listing);
        }}
      >
        <Pin
          background={isSelected ? '#F4B400' : '#0B3D91'}
          glyphColor={isSelected ? '#0B3D91' : '#FFFFFF'}
          borderColor="#FFFFFF"
          scale={isSelected ? 1.2 : 1.0}
        />
      </AdvancedMarker>

      {isOpen && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setIsOpen(false)}
          className="p-0 overflow-hidden rounded-2xl max-w-xs shadow-xl"
        >
          <div className="p-3 space-y-2.5 font-sans min-w-[240px]">
            <div className="relative h-28 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={listing.coverImage}
                alt={listing.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#0B3D91] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                {listing.category}
              </span>
              {distance !== undefined && (
                <span className="absolute bottom-2 right-2 bg-black/75 text-[#F4B400] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                  {distance} mi away
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-bold text-gray-900 text-sm font-heading leading-tight">
                  {listing.name}
                </h4>
                {listing.verified && (
                  <CheckCircle2 className="w-4 h-4 text-[#0B3D91] shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#F4B400] shrink-0" />
                {listing.address}, Socorro
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#F4B400] fill-[#F4B400]" />
                <span className="font-bold text-gray-900">{listing.rating}</span>
                <span className="text-gray-400 text-[10px]">({listing.reviewCount})</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${listing.isOpenNow ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                {listing.isOpenNow ? 'Open Now' : 'Closed'}
              </span>
            </div>

            <button
              onClick={() => onSelect(listing)}
              className="w-full bg-[#0B3D91] hover:bg-[#072252] text-white font-bold py-1.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
            >
              View Profile <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

// Controller component inside Map to handle pan to target
function MapController({
  centerTarget,
}: {
  centerTarget: { lat: number; lng: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (map && centerTarget) {
      map.panTo(centerTarget);
      map.setZoom(14);
    }
  }, [map, centerTarget]);

  return null;
}

export const DirectoryMap: React.FC<DirectoryMapProps> = ({
  listings,
  onSelectListing,
  selectedListing,
}) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [centerTarget, setCenterTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [activeListing, setActiveListing] = useState<BusinessListing | null>(selectedListing || null);

  useEffect(() => {
    if (selectedListing) {
      setActiveListing(selectedListing);
      setCenterTarget({ lat: selectedListing.lat, lng: selectedListing.lng });
    }
  }, [selectedListing]);

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setCenterTarget(coords);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        // Fallback default center to Socorro TX if location permission is denied
        setUserLocation(SOCORRO_CENTER);
        setCenterTarget(SOCORRO_CENTER);
        setLocationError('Unable to retrieve exact location. Showing default Socorro position.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  if (!hasValidKey) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg text-center font-sans space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#0B3D91]/10 text-[#0B3D91] flex items-center justify-center mx-auto">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="text-[#0B3D91] text-xl font-bold font-heading">
          Google Maps API Key Required
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm max-w-lg mx-auto">
          To display the interactive business map with user geolocation in Socorro, please configure your Google Maps API key in AI Studio Secrets.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-xs text-blue-900">
          <p className="font-bold flex items-center gap-1 text-[#0B3D91]">
            <Info className="w-4 h-4" /> How to set up Google Maps:
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-gray-700">
            <li>
              Get an API key from{' '}
              <a
                href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                target="_blank"
                rel="noreferrer"
                className="text-[#0B3D91] underline font-bold"
              >
                Google Cloud Console
              </a>
            </li>
            <li>Click ⚙️ Settings in top right corner → Secrets</li>
            <li>Add secret named <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
            <li>Paste key and press Enter (App rebuilds automatically)</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl space-y-0 font-sans">
      {/* Map Control Header */}
      <div className="bg-[#0B3D91] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg font-heading flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F4B400]" /> Socorro Business Interactive Map
          </h3>
          <p className="text-xs text-white/80">
            {listings.length} business locations mapped relative to Socorro, TX center.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCenterTarget(SOCORRO_CENTER);
            }}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Crosshair className="w-3.5 h-3.5 text-[#F4B400]" /> Center Socorro
          </button>

          <button
            onClick={handleLocateUser}
            disabled={locating}
            className="bg-[#F4B400] hover:bg-amber-400 text-[#0B3D91] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            {locating ? 'Locating...' : 'My Location'}
          </button>
        </div>
      </div>

      {locationError && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-4 py-2 flex items-center justify-between">
          <span>{locationError}</span>
          <button onClick={() => setLocationError(null)} className="font-bold text-amber-900">
            ✕
          </button>
        </div>
      )}

      {/* Google Map Viewport */}
      <div className="relative w-full h-[520px]">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={SOCORRO_CENTER}
            defaultZoom={13}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            <MapController centerTarget={centerTarget} />

            {/* User Location Marker */}
            {userLocation && (
              <AdvancedMarker position={userLocation} title="Your Location">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-75" />
                  <div className="relative w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                    <Navigation className="w-3 h-3 fill-white" />
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* Mapped Businesses */}
            {listings.map((listing) => (
              <BusinessMapMarker
                key={listing.id}
                listing={listing}
                isSelected={activeListing?.id === listing.id}
                onSelect={(b) => {
                  setActiveListing(b);
                  onSelectListing(b);
                }}
                userLocation={userLocation}
              />
            ))}
          </Map>
        </APIProvider>
      </div>

      {/* Map Footer Quick List */}
      <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-bold text-gray-700 shrink-0">Mapped Businesses:</span>
        <div className="flex gap-2">
          {listings.slice(0, 10).map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setActiveListing(b);
                setCenterTarget({ lat: b.lat, lng: b.lng });
              }}
              className={`text-xs px-3 py-1 rounded-full border transition-all whitespace-nowrap font-medium ${
                activeListing?.id === b.id
                  ? 'bg-[#0B3D91] text-white border-[#0B3D91] font-bold shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#0B3D91]'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
