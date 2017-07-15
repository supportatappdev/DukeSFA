function eod($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $stateProvider
        .state('index.eod', {
            url: "/eod",
            templateUrl: "eod/view.html",
            data: { pageTitle: 'EOD' }
        })
}
angular
    .module('mymobile3')
    .config(eod)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
        $rootScope.appName = "mymobile3";
    });