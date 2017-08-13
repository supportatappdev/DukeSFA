/**
 * DBCtrl - controller
 */

angular
    .module('mymobile3')
    .controller('DBCtrl', function DBCtrl(DoneStoreCache,$scope,Cache,$location,AlertService,$http,BSServiceUtil,$modal) {
        $("body").removeClass("mini-navbar");
        var _targetStore = DoneStoreCache.create("_keytargetStore","SFSalesTargetViewRef");
         var _msgStore = DoneStoreCache.create("_keymsgStore","SFMsgDayRef");
    $scope.x = {};
    var loadTargets = function(po) {
            _targetStore.setWhereClause("  executive_code = ? ");
            _targetStore.setLimit(300);
            _targetStore.setOffset(0);
            _targetStore.setGroupBy("prdtype_name");
            _targetStore.setWhereClauseParams([$scope.salesrepdetials.executive_code]);
            _targetStore.query().then(function(result) {
              $scope.targets= result.data;
               $scope.targetamount = 0;
               $scope.balamount = 0;
              for(var k = 0 ; k < $scope.targets.length; k++) {
                  $scope.targetamount += $scope.targets[k].aug_target_amount;
                 // $scope.balamount += $scope.targamount;
              }
            });
       }
     loadTargets(); 
     var loadMessage = function() {
         _msgStore.setWhereClause("  id = ? ");
            _msgStore.setLimit(10);
            _msgStore.setOffset(0);
            _msgStore.setWhereClauseParams([3]);
            _msgStore.query().then(function(result) {
                if(result.data && result.data[0]) {
                  $scope.x.message = result.data[0].msg_desc;
                }
            });
     }
     loadMessage();
});