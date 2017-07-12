/**
 * mymobile3 
 * Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    //$urlRouterProvider.otherwise("/index/login");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: true
    });

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "main.html",
            data: { pageTitle: 'Journey Plan' }
        })
        .state('index.minor', {
            url: "/minor",
            templateUrl: "minor.html",
            data: { pageTitle: 'Example view' }
        })
}
angular
    .module('mymobile3')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
        $rootScope.appName = "mymobile3";
    });