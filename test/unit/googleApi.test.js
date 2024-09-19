import sinon from 'sinon';

import GoogleApi from '../../js/googleApi.js';

describe('googleApi', function() {

  describe('can geocode', function() {
    let geocodeRequest;

    beforeEach(function() {
      geocodeRequest = sinon.stub(GoogleApi, 'geocodeRequest').returns('yo');
    });

    afterEach(function() {
      GoogleApi.geocodeRequest.restore();
    });

    it ('position', async function() {
      let ret = await GoogleApi.geocodePosition('myKey', {lat: 1.234, lng: 1.14});
      expect(geocodeRequest).to.have.been.calledWith(
        'https://maps.googleapis.com/maps/api/geocode/json?key=myKey&latlng=1.234,1.14');
      expect(ret).to.eql('yo');
    });

    it ('position with a specific language', async function() {
      let ret = await GoogleApi.geocodePosition('myKey', {lat: 1.234, lng: 1.14}, 'ko');
      expect(geocodeRequest).to.have.been.calledWith(
        'https://maps.googleapis.com/maps/api/geocode/json?key=myKey&latlng=1.234,1.14&language=ko');
      expect(ret).to.eql('yo');
    });

    it ('address', async function() {
      let ret = await GoogleApi.geocodeAddress('myKey', 'london');
      expect(geocodeRequest).to.have.been.calledWith(
        'https://maps.googleapis.com/maps/api/geocode/json?key=myKey&address=london');
      expect(ret).to.eql('yo');
    });

    it ('address with a specific language', async function() {
      let ret = await GoogleApi.geocodeAddress('myKey', 'london', 'ko');
      expect(geocodeRequest).to.have.been.calledWith(
        'https://maps.googleapis.com/maps/api/geocode/json?key=myKey&address=london&language=ko');
      expect(ret).to.eql('yo');
    });
  });

  describe('geocodeRequest', function() {

    function mockFetch(ret) {
      global.fetch = sinon.stub().returns(Promise.resolve({
        json: () => ret
      }))
    }

    it ('throws if invalid results', function() {
      mockFetch({ status: 'NOT_OK' });
      return GoogleApi.geocodeRequest().then(
        () => { throw new Error('cannot be there') },
        (err) => { expect(err.message).to.contain('NOT_OK'); }
      );
    });

    describe('returns formatted results', function() {

      it ('for waterloo-bridge', async function() {
        mockFetch(require('./fixtures/waterloo-bridge.js'));
        let [first, ...ret] = await GoogleApi.geocodeRequest();
        expect(first.region.center.lat).to.eql(51.506349);
        expect(first.region.center.lng).to.eql(-0.114699);
        expect(first.region.radius).to.eql(177);
        expect(first.countryCode).to.eql('GB');
        expect(first.feature).to.be.eql(null);
        expect(first.locality).to.eql('London');
        expect(first.streetName).to.eql('Waterloo Bridge');
        expect(first.streetNumber).to.eql('76');
      });

      it ('for yosemite park', async function() {
        mockFetch(require('./fixtures/yosemite-park.js'));
        let [first, ...ret] = await GoogleApi.geocodeRequest();
        expect(first.region.center.lat).to.eql(37.865101);
        expect(first.region.center.lng).to.eql(-119.538329);
        expect(first.region.radius).to.eql(191);
        expect(first.countryCode).to.eql('US');
        expect(first.feature).to.be.eql('Yosemite National Park');
        expect(first.streetName).to.be.eql(null);
        expect(first.streetNumber).to.be.eql(null);
        expect(first.postalCode).to.be.eql(null);
        expect(first.locality).to.be.eql(null);
      });

    });
  });
});
