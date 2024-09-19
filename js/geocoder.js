import { NativeModules, Platform } from 'react-native';
import GoogleApi from './googleApi.js';

const { RNGeocoder } = NativeModules;

export default {
  apiKey: null,
  language: null,

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

  geocodePosition(position) {
    if (!position || !position.lat || !position.lng) {
      return Promise.reject(new Error("invalid position: {lat, lng} required"));
    }

    if (this.language && (Platform.OS === 'ios')) {
      return this.geocodePositionFallback(position);
    }

    return RNGeocoder.geocodePosition(position).catch(err => {
      if (err.code !== 'NOT_AVAILABLE') { throw err; }
      return this.geocodePositionFallback(position);
    });
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
