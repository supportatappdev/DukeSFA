/**
 * OrderCtrl - controller
 */
function OrderCtrl($scope,Cache,$location,AlertService,$http,BSServiceUtil,$modal) {
        $("body").removeClass("mini-navbar");
     $scope.orders = {
             orderList:[],
             orderListLoading: false,
             offset: 0,
             limit: 20
        };
     $scope.loadOrders = function(flag) {
         $scope.orders.orderListLoading = true;
         if(flag == 'refresh') {
            $scope.orders.orderList  = [];
            $scope.orders.offset =  0;
            $scope.orders.limit = 20;
        } 
         var orderResult = function(result) {
        $scope.orders.orderListLoading = false;
            for(var k = 0; k < result.length; k++) {
                    $scope.orders.orderList.push(result[k]);
            }
        
            if(result.length <  $scope.orders.limit) {
                    $scope.orders.loaded = true;
            }
        }
        
        var wc = "spid = ?";
        if($scope.salesrep.isSO === "Y") {
              wc = "soid = ?";
        }
        var params = [ $scope.salesrep.id];
        
        BSServiceUtil.queryResultWithCallback("SFOrdersViewRef", "_NOCACHE_", wc, params, " creation_date desc ", orderResult,$scope.orders.limit,$scope.orders.offset);
     }
     $scope.loadOrders();
     $scope.getNextPage = function() {
            if($scope.orders.loaded) {
                return;
            }
            $scope.orders.offset = ($scope.orders.offset + $scope.orders.limit);
             $scope.loadOrders();
        }
     $scope.openLineItems = function(row) {
        $scope.inv = row;
        var modalInstance = $modal.open({
            templateUrl: 'order/orderdet.html',
            size: "sm",
            scope: $scope,
            controller: lineItemCntrl
        });
    }
}
function lineItemCntrl(BSService,AlertService,Util,$scope,BSServiceUtil,$modalInstance) {
    var invoiceItem = function(c,params) {
       $scope.loadDetData  = true;
        var invoiceListItemResult = function(result) {
            $scope.loadDetData  = false;
            $scope.invoiceItems = result;
        }//FIGetPIDetailsRef
        BSServiceUtil.queryResultWithCallback("SFOrderDetViewRef", "_NOCACHE_", c, params, undefined, invoiceListItemResult);
        //$location.path("/index/feedbacklist");
    };
    var wc = "order_no = ?";
    var wcParams = [$scope.inv.order_no];
    invoiceItem(wc,wcParams);
    $scope.inv1 = $scope.inv;
    
    $scope.close = function(){
        $modalInstance.close();
    }
    $scope.x = {};
    $scope.x.deliveryDate = $scope.inv.delivered_date;
    $scope.x.adeliveryDate = $scope.inv.delivered_date;
    $scope.save = function() {
           var inputJSON = {};
                inputJSON.delivered_date = Util.convertDBDate($scope.x.deliveryDate);
                inputJSON.custUpdate = "Y";
                inputJSON.id = $scope.inv.order_id;
                 var params = {
                'ds': 'FISFOrderRef',
                'operation': 'UPDATE',
                'data': inputJSON
            };
            BSService.save({
                'method': 'update'
            }, params, function(result) {
                if (result.status === "E") {
                    AlertService.showError("Validation Error",result.errorMsg);
                }  else {
                    
                    AlertService.showInfo("Success","Order updated successfully");
                    $scope.close();
                     $scope.loadOrders('refresh');
                    
                }
            });   
    }
}

angular
    .module('mymobile3')
    .controller('OrderCtrl', ['$scope','Cache','$location','AlertService','$http','BSServiceUtil','$modal',OrderCtrl])
    .controller('lineItemCntrl',['BSService','AlertService','Util','$scope','BSServiceUtil', lineItemCntrl]);