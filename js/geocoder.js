import { NativeModules, Platform } from 'react-native';
import GoogleApi from './googleApi.js';

const { RNGeocoder } = NativeModules;

export default {
  apiKey: null,
  language: 'en',
  useGoogle: false,

  fallbackToGoogle(key) {
    this.apiKey = key;
  },

  setLanguage(language) {
    RNGeocoder.setLanguage(language, (result) => {
      this.language = result;
    });
  },

  geocodePositionFallback(position) {
    if (!this.apiKey) { throw new Error("Google API key required"); }

    return GoogleApi.geocodePosition(this.apiKey, position, this.language);
  },

  geocodeAddressFallback(address) {
    if (!this.apiKey) { throw new Error("Google API key required"); }

    return GoogleApi.geocodeAddress(this.apiKey, address, this.language);
  },

  enableGoogleGeocoder() {
    this.useGoogle = true;
  },

  //I will add new function to keep backward compatibility, but with more appropriate name
  setApiKey(key) {
    this.apiKey = key;
  },

  geocodePosition(position) {
    if (!position || (!position.lat && position.lat!==0) || (!position.lng && position.lng!==0)) {
      return Promise.reject(new Error("invalid position: {lat, lng} required"));
    }

    if (this.useGoogle) {
      return this.geocodePositionFallback(position);
    } else {
      return RNGeocoder.geocodePosition(position).catch(err => {
        if (err.code !== 'NOT_AVAILABLE') { throw err; }
        return this.geocodePositionFallback(position);
      });
    }
  },

  geocodeAddress(address) {
    if (!address) {
      return Promise.reject(new Error("address is null"));
    }

    if (this.language && (Platform.OS === 'ios')) {
      return this.geocodeAddressFallback(address);
    }

    return RNGeocoder.geocodeAddress(address).catch(err => {
      if (err.code !== 'NOT_AVAILABLE') { throw err; }
      return this.geocodeAddressFallback(address);
    });
  },
}
