/**
 * OrderCtrl - controller
 */
function DBCtrl($scope,Cache,$location,AlertService,$http,BSServiceUtil,$modal) {
        $("body").removeClass("mini-navbar");
}

angular
    .module('mymobile3')
    .controller('DBCtrl', ['$scope','Cache','$location','AlertService','$http','BSServiceUtil','$modal',EODCtrl]);