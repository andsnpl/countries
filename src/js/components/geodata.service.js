import angular from 'angular';

angular.module('countries')
  .factory('checkHttpResponse', [
    function () {
      return function (response) {
        if (response.status < 300 && response.status >= 200) {
          return response.data;
        }
        let err = new Error('Request failed');
        err.originalResponse = response;
        throw err;
      };
    }
  ])
  .factory('geoRequest', [
    '$http', 'checkHttpResponse', 'USERNAME',
    function ($http, checkHttpResponse, USERNAME) {
      return function (path, params) {
        params || (params = {});
        params.username || (params.username = USERNAME);
        params.type || (params.type = 'JSON');
        return $http({ url: `//api.geonames.org/${path}`,
                       type: 'GET',
                       params })
          .then(checkHttpResponse);
      };
    }
  ])
  .factory('geoCountriesList', [
    'geoRequest',
    function (geoRequest) {
      // no country param -> all countries
      return geoRequest('countryInfoJSON');
    }
  ])
  .factory('geoCountryData', [
    '$q', 'geoRequest',
    function ($q, geoRequest) {
      return function (countryCode) {
        let countryInfo = geoRequest(
          'countryInfoJSON',  { country: countryCode });

        let neighbors = geoRequest(
          'neighbours', { country: countryCode });

        return $q.all({ countryInfo, neighbors })
          .then((results) => {
            console.log('country info and neighbors', results);
            // construct the bulk of the results object from the two requests
            return {
              countryCode,
              countryName: results.countryInfo.geonames[0].countryName,
              popCountry: results.countryInfo.geonames[0].population,
              areaKm2: results.countryInfo.geonames[0].areaInSqKm,
              capitalName: results.countryInfo.geonames[0].capital,
              neighbors: results.neighbors.geonames
            };
          })
          .then((results) => {
            let capitalRequest = geoRequest(
              'search',
              { name_equals: results.capitalName,
                country: results.countryCode });

            return capitalRequest.then((capitalResults) => {
              console.log(capitalResults);
              results.popCapital = capitalResults.geonames[0].population;
              // note we are returning the original results object
              // that was constructed above in the first callback.
              return results;
            });
          });
      };
    }
  ]);
