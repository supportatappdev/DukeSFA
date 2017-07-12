/**
 * mymobile3 
 * Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function lconfig($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider.state('login', {
            url: "/login",
            templateUrl: "login/login.html",
        });
        
}
angular
    .module('mymobile3')
    .config(lconfig)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
        $rootScope.appName = "mymobile3";
    });