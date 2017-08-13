function custconfig($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $stateProvider
        .state('index.addcust', {
            url: "/addcust/:id",
            templateUrl: "customer/add.html",
            data: { pageTitle: 'Add Retailer' }
            // ,
            // resolve: {
            //     loadPlugin: function ($ocLazyLoad) {
            //         return $ocLazyLoad.load([
            //             {
            //                 serie: true,
            //                 name: 'mapfinder',
            //                 files: [ 'https://maps.googleapis.com/maps/api/js?sensor=false' ]
            //             }
            //              ]);
            //     }
            // }
        })
        .state('index.listcust', {
            url: "/listcust",
            templateUrl: "customer/retailers.html",
            data: { pageTitle: 'My Retailers' }
        })
        .state('index.listcustjp', {
            url: "/listcustjp",
            templateUrl: "customer/jpretailers.html",
            data: { pageTitle: 'Today Journey' }
        })
        .state('index.route', {
            url: "/route",
            templateUrl: "customer/route.html",
            data: { pageTitle: 'Route Map' }
        })
        .state('index.newcall', {
            url: "/newcall1/:id",
            templateUrl: "customer/newcall1.html",
            data: { pageTitle: 'New Order' }
        })
}
angular
    .module('mymobile3')
    .config(custconfig)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
        $rootScope.appName = "mymobile3";
    });