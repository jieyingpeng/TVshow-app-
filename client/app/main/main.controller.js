'use strict';


angular.module('tvshowAppApp')
  .controller('MainController', ['$scope', '$http', function($scope, $http) {
    // * scope will have the query string as a variable
    $scope.query = '';
    $scope.queryId = [];

    $scope.goCats = false;
    $scope.showInfo = '';
     $scope.showShowInfo = false;

    // * show meta data as an object (reponse from AJAX call?)
    $scope.results = [];
    // * d3 object / data set (when data is changed page is update)
    $scope.totalResults = [];
    $scope.pie;
    // * search function
    $scope.submit = function() {
         $scope.showShowInfo = true;
      $scope.results = {};
      var season = 1;
      var seasonExists = true;
      var queryString = $scope.query;
      $scope.query = '';


      $http.get('http://www.omdbapi.com/?t=' + queryString)
        .success(function(data) {
          $scope.showInfo = data;
        })
        .catch(function(err) {
          console.log('Error: ' + err);
        })


      var generateRandomColor = function() {
        var r = (Math.round(Math.random() * 127) + 127).toString(16);
        var g = (Math.round(Math.random() * 127) + 127).toString(16);
        var b = (Math.round(Math.random() * 127) + 127).toString(16);
        return '#' + r + g + b;
      }

      function convertHex(hex, opacity) {
        hex = hex.replace('#', '');
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);
        var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
      }
      var getAllSeasons = function(seasonNumber) {
        $http({
          //need to handle url spaces
          method: 'GET',
          params: {
            t: queryString,
            type: 'series',
            season: seasonNumber
          },
          url: 'http://www.omdbapi.com/?',
        }).then(function(res) {
          console.log(res.data, 'this is the response');
          if (res.data.Response === 'True') {
            var color = generateRandomColor();
            $scope.results = [res.data, convertHex(color, 75)];
            $scope.totalResults.push([res.data, color]);
            getAllSeasons(seasonNumber + 1);
          } else {
            $scope.pie = $scope.totalResults;
            $scope.totalResults = [];
          }
          //run d3 function with data
        }, function(err) {
          console.log(err);
        });
      };
      getAllSeasons(season);
    };

  }]);
