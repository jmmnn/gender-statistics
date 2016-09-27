/*jshint unused: vars */

/* You need to change scriptsUrl to the correct one before debug the code. */
// var scriptsUrl = 'http://webapps.qlik.com/un/gender-statistics/'; // QLIK/
var scriptsUrl = '/'; // UN - OICT
//var scriptsUrl = 'http://localhost/gender-statistics/'; // local
// var scriptsUrl = 'https://km-unite.dev.un.org/sites/km-unite.un.org/apps/gender-statistics/';  
// var scriptsUrl = 'https://unite.un.org/sites/unite.un.org/files/app-desa-genderstats/';  

require.config({
  //baseUrl: "https://sense-demo.qlik.com:443/resources",
  //baseUrl: "https://demoswebapps.qlik.com:443/resources",
  baseUrl: "https://viz.unite.un.org:443/visualization/resources",
  // baseUrl: "https://usrad-jvs002.qliktech.com/resources",
    paths: {
    'domReady': scriptsUrl + 'js/vendor/domReady/domReady',
    'bootstrap': scriptsUrl + 'js/vendor/bootstrap/dist/js/bootstrap.min',
    'ui.bootstrap': scriptsUrl + 'js/vendor/angular-bootstrap/ui-bootstrap-tpls.min',
    'ui.router': scriptsUrl + 'js/vendor/angular-ui-router/release/angular-ui-router.min',
    'owl.carousel': scriptsUrl + 'js/vendor/owl-carousel/owl.carousel.min',
    'angular-clipboard': scriptsUrl + 'js/vendor/angular-clipboard/angular-clipboard',
    'app': scriptsUrl + 'js/lib/app',
    'controller.home': scriptsUrl + 'js/controllers/home',
    'controller.indicators': scriptsUrl + 'js/controllers/indicators',
    'controller.countries': scriptsUrl + 'js/controllers/countries',
    'controller.data-availability': scriptsUrl + 'js/controllers/data-availability',
    'controller.downloads': scriptsUrl + 'js/controllers/downloads',
    'directive.getObject': scriptsUrl + 'js/directives/getObject',
    'directive.exportToCsv': scriptsUrl + 'js/directives/exportToCsv',
    'directive.preloader': scriptsUrl + 'js/directives/preloader',
    'service.api': scriptsUrl + 'js/services/api',
    'service.utility': scriptsUrl + 'js/services/utilities',
  }
});

define([
  'require',
  'angular',
  'app'
], function(require, angular) {
  'use strict';

  define( "client.services/grid-service", {} );
  app.obj.angularApp = angular.module('myApp', [
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'angular-clipboard'
  ]);

  app.obj.angularApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
      .state('home', {
        url: "/home",
        views: {
          'main': {
            templateUrl: "views/home.html",
            controller: 'controller.home'
          },
        }
      })
      .state('indicators', {
        url: "/indicators",
        views: {
          'main': {
            templateUrl: "views/indicators.html",
            controller: 'controller.indicators'
          },
        }
      })
      .state('countries', {
        url: "/countries",
        views: {
          'main': {
            templateUrl: "views/countries.html",
            controller: 'controller.countries'
          },
        }
      })
      .state('data-availability', {
        url: "/data-availability",
        views: {
          'main': {
            templateUrl: "views/data-availability.html",
            controller: 'controller.data-availability'
          },
        }
      })
      .state('downloads', {
        url: "/downloads",
        views: {
          'main': {
            templateUrl: "views/downloads.html",
            controller: 'controller.downloads'
          },
        }
      })
  });

  require([
    'domReady!',
    'js/qlik',
    'underscore',
    'angular',
    'controller.home',
    'controller.indicators',
    'controller.countries',
    'controller.data-availability',
    'controller.downloads',
    'service.api',
    'service.utility',
    'directive.getObject',
    'directive.exportToCsv',
    'directive.preloader',
    'bootstrap',
    'ui.bootstrap',
    'ui.router',
    'owl.carousel',
    'angular-clipboard',
  ], function(document, qlik, _) {
    app.obj.qlik = qlik;
    qlik.setOnError(function(error) {
      if (!angular.isUndefined(error) && error.code == 16) {
        location.reload();
      } else {
        console.log(error);
      }
    });
    angular.bootstrap(document, ["myApp", "qlik-angular"]);

    app.boot();
  });
});

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}
