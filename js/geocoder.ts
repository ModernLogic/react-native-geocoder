import { NativeModules, Platform } from 'react-native';
import GoogleApi from './googleApi.js';
const { RNGeocoder } = NativeModules;

export type GeoPosition = {
  lat: number;
  lng: number;
};

type ErrorType = {
  code: string
}

export default {
  apiKey: null as null | string,
  language: 'en',
  useGoogle: false,

  fallbackToGoogle(key: string) {
    this.apiKey = key;
  },

  setLanguage(language: string) {
    RNGeocoder.setLanguage(language, (result: string) => {
      this.language = result;
    });
  },

  geocodePositionFallback(position: GeoPosition) {
    if (!this.apiKey) { throw new Error("Google API key required"); }

    return GoogleApi.geocodePosition(this.apiKey, position, this.language);
  },

  geocodeAddressFallback(address: string) {
    if (!this.apiKey) { throw new Error("Google API key required"); }

    return GoogleApi.geocodeAddress(this.apiKey, address, this.language);
  },

  enableGoogleGeocoder() {
    this.useGoogle = true;
  },

  setApiKey(key: string) {
    this.apiKey = key;
  },

  geocodePosition(position: GeoPosition) {
    if (!position || (!position.lat && position.lat!==0) || (!position.lng && position.lng!==0)) {
      return Promise.reject(new Error("invalid position: {lat, lng} required"));
    }

    if (this.useGoogle) {
      return this.geocodePositionFallback(position);
    } else {
      return RNGeocoder.geocodePosition(position).catch((err: ErrorType) => {
        if (err.code !== 'NOT_AVAILABLE') { throw err; }
        return this.geocodePositionFallback(position);
      });
    }
  },

  geocodeAddress(address: string) {
    if (!address) {
      return Promise.reject(new Error("address is null"));
    }

    if (this.language && (Platform.OS === 'ios')) {
      return this.geocodeAddressFallback(address);
    }

    return RNGeocoder.geocodeAddress(address).catch((err: ErrorType) => {
      if (err.code !== 'NOT_AVAILABLE') { throw err; }
      return this.geocodeAddressFallback(address);
    });
  },
}
