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

// Debug logger
const logLocation = {
  debug: (message: string, data?: any) => {
    console.log(`[LocationService] ${message}`, data || '');
  },
  error: (message: string, error: any) => {
    console.log(`[LocationService] Error - ${message}:`, {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      details: error
    });
  }
};

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    logLocation.debug('Requesting location permission...');
    
    // First check the current status
    const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
    logLocation.debug(`Current permission status: ${currentStatus}`);
    
    if (currentStatus === Location.PermissionStatus.GRANTED) {
      return true;
    }

    // If not granted, request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === Location.PermissionStatus.GRANTED;
    logLocation.debug(`New permission status: ${status}`);
    return granted;
  } catch (error) {
    logLocation.error('Failed to request location permission', error);
    return false;
  }
};

const checkLocationEnabled = async (): Promise<boolean> => {
  try {
    logLocation.debug('Checking if location services are enabled...');
    const providerStatus = await Location.getProviderStatusAsync();
    logLocation.debug('Location provider status:', providerStatus);
    
    if (!providerStatus.locationServicesEnabled) {
      logLocation.debug('Location services are disabled at system level');
    }
    if (!providerStatus.gpsAvailable) {
      logLocation.debug('GPS is not available');
    }
    if (!providerStatus.networkAvailable) {
      logLocation.debug('Network location provider is not available');
    }
    
    return providerStatus.locationServicesEnabled;
  } catch (error) {
    logLocation.error('Failed to check location services status', error);
    return false;
  }
};

export const getCurrentLocation = async (forceRefresh: boolean = false): Promise<LocationData | null> => {
  try {
    // Check cache first
    const now = Date.now();
    if (!forceRefresh && cachedLocation && (now - lastLocationFetch) < LOCATION_CACHE_DURATION) {
      logLocation.debug('Using cached location data');
      return cachedLocation;
    }

    // Request permission if not already granted
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      logLocation.debug('Location permission not granted');
      return null;
    }

    // Check if location services are enabled
    const isEnabled = await checkLocationEnabled();
    if (!isEnabled) {
      logLocation.debug('Location services are disabled');
      return null;
    }

    logLocation.debug('Getting current position...');
    
    // Try to get location with low accuracy first for faster response
    try {
      const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});

      if (location) {
        logLocation.debug('Location received with low accuracy', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: new Date(location.timestamp).toISOString()
        });

        // Get reverse geocoding data
        let geocodeResult = null;
        try {
          logLocation.debug('Attempting reverse geocoding...');
          [geocodeResult] = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          logLocation.debug('Geocoding result', geocodeResult);
        } catch (error) {
          logLocation.error('Reverse geocoding failed', error);
          // Continue without geocoding data
        }

        // Create location data object
        cachedLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          city: geocodeResult?.city || undefined,
          country: geocodeResult?.country || undefined,
        };

        lastLocationFetch = now;
        logLocation.debug('Location data updated', cachedLocation);
        return cachedLocation;
      }
    } catch (error) {
      logLocation.error('Failed to get location with low accuracy', error);
    }

    // If low accuracy failed, try with balanced accuracy
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      if (location) {
        logLocation.debug('Location received with balanced accuracy', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: new Date(location.timestamp).toISOString()
        });

        // Get reverse geocoding data
        let geocodeResult = null;
        try {
          logLocation.debug('Attempting reverse geocoding...');
          [geocodeResult] = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          logLocation.debug('Geocoding result', geocodeResult);
        } catch (error) {
          logLocation.error('Reverse geocoding failed', error);
          // Continue without geocoding data
        }

        // Create location data object
        cachedLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          city: geocodeResult?.city || undefined,
          country: geocodeResult?.country || undefined,
        };

        lastLocationFetch = now;
        logLocation.debug('Location data updated', cachedLocation);
        return cachedLocation;
      }
    } catch (error) {
      logLocation.error('Failed to get location with balanced accuracy', error);
      
      // If we have cached location, return it as fallback
      if (cachedLocation) {
        logLocation.debug('Returning cached location as fallback');
        return cachedLocation;
      }
    }

    return null;
  } catch (error) {
    logLocation.error('Failed to get current location', error);
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