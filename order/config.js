function orderconfig($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $stateProvider
        .state('index.listorder', {
            url: "/listorder",
            templateUrl: "order/orders.html",
            data: { pageTitle: 'Orders' }
        })
}
angular
    .module('mymobile3')
    .config(orderconfig)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
        $rootScope.appName = "mymobile3";
    });