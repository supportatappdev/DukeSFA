/**
 * OrderCtrl - controller
 */
function EODCtrl($scope,Cache,$location,AlertService,$http,BSServiceUtil,$modal) {
        $("body").removeClass("mini-navbar");
     $scope.orders = {
             orderList:[],
             orderListLoading: false,
             offset: 0,
             limit: 20
        };
     var loadOrders = function() {
         $scope.orders.orderListLoading = true;
         var orderResult = function(result) {
        $scope.orders.orderListLoading = false;
            for(var k = 0; k < result.length; k++) {
                    $scope.orders.orderList.push(result[k]);
            }
            if(result.length <  $scope.orders.limit) {
                    $scope.orders.loaded = true;
            }
        }
        var wc = "spid = ? and DATE_FORMAT(creation_date, '%D') = DATE_FORMAT(now(), '%D')";
        var params = [ $scope.salesrep.id];
      BSServiceUtil.queryResultWithCallback("SFOrdersViewRef", "_NOCACHE_", wc, params, " creation_date desc ", orderResult,$scope.orders.limit,$scope.orders.offset);
     }
     loadOrders();
     $scope.getNextPage = function() {
            if($scope.orders.loaded) {
                return;
            }
            $scope.orders.offset = ($scope.orders.offset + $scope.orders.limit);
            loadOrders();
        }
}

angular
    .module('mymobile3')
    .controller('EODCtrl', ['$scope','Cache','$location','AlertService','$http','BSServiceUtil','$modal',EODCtrl]);