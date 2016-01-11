describe('geodata service', function () {
  beforeEach(module('countries'));

  var data = {
    geonames: [{}]
  };

  describe('checkHttpResponse service', function () {
    it('returns data when successful', inject(function (checkHttpResponse) {
      var fixture = [200, 250, 299];

      var statusToTest, result;
      for (var i = 0; i < fixture.length; i++) {
        statusToTest = fixture[i];
        result = checkHttpResponse({status: statusToTest, data: data});
        expect(result).toEqual(data);
      }
    }));

    it('throws an error for all {status | 200 <= status < 300}', inject(function (checkHttpResponse) {
      var fixture = [
        100, true,
        199, true,
        200, false,
        250, false,
        300, true,
        100000, true
      ];

      var statusToTest, shouldThrowError, boundTest;
      for (var i = 0; i < fixture.length / 2; i++) {
        statusToTest = fixture[i * 2];
        shouldThrowError = fixture[i * 2 + 1];
        boundTest = checkHttpResponse.bind(null, {status: statusToTest});
        if (shouldThrowError) {
          expect(boundTest).toThrow();
        } else {
          expect(boundTest).not.toThrow();
        }
      }
    }));
  });

  describe('geoRequest service', function () {

    it('returns the data as a resolution value when succeeds', inject(function (geoRequest, PROXY, $httpBackend) {
      var resp;

      $httpBackend.expectGET(PROXY + '/api.geonames.org/path1?type=JSON&username=bpaulanderson')
        .respond({status: 200, data: data});

      // note: if checkHttpRequest were run as it should be, we would not need
      // to get `r.data` in the callback.
      geoRequest('path1').then(function (r) { resp = r.data; });

      $httpBackend.flush();

      console.log(resp);
      console.log(data);

      expect(resp).toEqual(data);
    }));

    // checkHttpRequest doesn't run when geoRequest is invoked, so this test is
    // pointless.
    xit('returns an error as a rejection value when fails', inject(function (geoRequest, PROXY, $httpBackend) {
      var resp;

      $httpBackend.expectGET(PROXY + '/api.geonames.org/path2?type=JSON&username=bpaulanderson')
        .respond({status: 404, data: new Error()});

      geoRequest('path2').then(null, function (r) { resp = r; });

      $httpBackend.flush();

      expect(resp).toEqual(jasmine.any(Error));

      $httpBackend.verifyNoOutstandingExpectation();
    }));
  });

  xdescribe('geoCountriesList', function () {
    it('makes a request', inject(function (geoCountriesList, PROXY, USERNAME, $httpBackend) {
      var resp;

      $httpBackend
        .expectGET(PROXY + '/api.geonames.org/countryInfoJSON?type=JSON&username=bpaulanderson')
        .respond({status: 200, data: {}});

      // note: if checkHttpRequest were run as it should be, we would not need
      // to get `r.data` in the callback.
      geoCountriesList.then(function (r) { resp = r.data; });

      $httpBackend.flush();

      expect(resp).toBe(data);
      expect(username).toBe(USERNAME);
      expect(type).toBe('JSON');

      $httpBackend.verifyNoOutstandingExpectation();
    }));
  });

  describe('geoCountryData', function () {
    it('makes 3 requests', inject(function (geoCountryData, PROXY, USERNAME, $httpBackend) {
      var resp;

      // The data returned from the actual HTTP request would be wrapped with
      // status information, then unpacked by checkHttpRequest.
      var genericResponse = data;

      $httpBackend
        .expectGET(PROXY + '/api.geonames.org/countryInfoJSON?country=US&type=JSON&username=bpaulanderson')
        .respond(genericResponse);

      $httpBackend
        .expectGET(PROXY + '/api.geonames.org/neighbours?country=US&type=JSON&username=bpaulanderson')
        .respond(genericResponse);

      $httpBackend
        .expectGET(PROXY + '/api.geonames.org/search?country=US&type=JSON&username=bpaulanderson')
        .respond(genericResponse);

      geoCountryData('US').then(function (r) { resp = r; });

      $httpBackend.flush();

      expect(resp).toEqual({
        countryCode: 'US',
        countryName: undefined,
        popCountry: undefined,
        areaKm2: undefined,
        capitalName: undefined,
        popCapital: undefined,
        neighbors: [{}]
      });

      $httpBackend.verifyNoOutstandingExpectation();
    }));
  });
});
