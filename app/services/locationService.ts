import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

let cachedLocation: LocationData | null = null;
const LOCATION_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
let lastLocationFetch: number = 0;

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('[LocationService] Location permission denied');
      return false;
    }
    return true;
  } catch (error) {
    console.error('[LocationService] Error requesting location permission:', error);
    return false;
  }
};

export const getCurrentLocation = async (forceRefresh: boolean = false): Promise<LocationData | null> => {
  try {
    // Check cache first
    const now = Date.now();
    if (!forceRefresh && cachedLocation && (now - lastLocationFetch) < LOCATION_CACHE_DURATION) {
      return cachedLocation;
    }

    // Request permission if not already granted
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return null;
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    // Get reverse geocoding data
    const [geocodeResult] = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    // Create location data object
    cachedLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      city: geocodeResult?.city,
      country: geocodeResult?.country,
    };

    lastLocationFetch = now;
    return cachedLocation;
  } catch (error) {
    console.error('[LocationService] Error getting current location:', error);
    return null;
  }
};

export const getLocationString = (location: LocationData): string => {
  if (location.city && location.country) {
    return `${location.city}, ${location.country}`;
  } else if (location.city) {
    return location.city;
  } else if (location.country) {
    return location.country;
  }
  return `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;
}; 