import { getCenterOfBounds, getDistance } from 'geolib';

export default {
  googleUrl: 'https://maps.googleapis.com/maps/api/geocode/json',

  format(raw) {
    const address = {
      position: {},
      region: null,
      formattedAddress: raw.formatted_address || '',
      feature: null,
      streetNumber: null,
      streetName: null,
      postalCode: null,
      locality: null,
      country: null,
      countryCode: null,
      adminArea: null,
      subAdminArea: null,
      subLocality: null,
    };

    if (raw.geometry && raw.geometry.location) {
      address.position = {
        lat: raw.geometry.location.lat,
        lng: raw.geometry.location.lng,
      }

      if (raw.geometry.viewport) {
        const northEast = {
          latitude: raw.geometry.viewport.northeast.lat,
          longitude: raw.geometry.viewport.northeast.lng,
        };
        const southWest = {
          latitude: raw.geometry.viewport.southwest.lat,
          longitude: raw.geometry.viewport.southwest.lng,
        };
        const center = getCenterOfBounds([northEast, southWest]);
        const radius = Math.max(getDistance(center, northEast), getDistance(center, southWest));

        address.region = {
          center: {
            lat: center.latitude,
            lng: center.longitude,
          },
          radius,
        }
      }
    }

    raw.address_components.forEach(component => {
      if (component.types.indexOf('route') !== -1) {
        address.streetName = component.long_name;
      }
      else if (component.types.indexOf('street_number') !== -1) {
        address.streetNumber = component.long_name;
      }
      else if (component.types.indexOf('country') !== -1) {
        address.country = component.long_name;
        address.countryCode = component.short_name;
      }
      else if (component.types.indexOf('locality') !== -1) {
        address.locality = component.long_name;
      }
      else if (component.types.indexOf('postal_code') !== -1) {
        address.postalCode = component.long_name;
      }
      else if (component.types.indexOf('administrative_area_level_1') !== -1) {
        address.adminArea = component.long_name;
      }
      else if (component.types.indexOf('administrative_area_level_2') !== -1) {
        address.subAdminArea = component.long_name;
      }
      else if (component.types.indexOf('sublocality') !== -1 || component.types.indexOf('sublocality_level_1') !== -1) {
        address.subLocality = component.long_name;
      }
      else if (component.types.indexOf('point_of_interest') !== -1 || component.types.indexOf('colloquial_area') !== -1) {
        address.feature = component.long_name;
      }
    });

    return address;
  },

  geocodePosition(apiKey, position, language = null) {
    if (!apiKey || !position || !position.lat || !position.lng) {
      return Promise.reject(new Error("invalid apiKey / position"));
    }

    let url = `${this.googleUrl}?key=${apiKey}&latlng=${position.lat},${position.lng}`;
    if (language) {
      url = `${url}&language=${language}`;
    }

    return this.geocodeRequest(url);
  },

  geocodeAddress(apiKey, address, language = null) {
    if (!apiKey || !address) {
      return Promise.reject(new Error("invalid apiKey / address"));
    }

    let url = `${this.googleUrl}?key=${apiKey}&address=${encodeURI(address)}`;
    if (language) {
      url = `${url}&language=${language}`;
    }

    return this.geocodeRequest(url);
  },

  async geocodeRequest(url) {
    const res = await fetch(url);
    const json = await res.json();

    if (!json.results || json.status !== 'OK') {
      return Promise.reject(new Error(`geocoding error ${json.status}, ${json.error_message}`));
    }

    return json.results.map(this.format);
  }
}
