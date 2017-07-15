function dashboard($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $stateProvider
        .state('index.db', {
            url: "/db",
            templateUrl: "dashboard/view.html",
            data: { pageTitle: 'Dashboard' }
        })
}
angular
    .module('mymobile3')
    .config(dashboard)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
        $rootScope.appName = "mymobile3";
    });