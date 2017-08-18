/**
 * MainCtrl - controller
 */
angular
    .module('mymobile3')
    .controller('MainCtrl', function MainCtrl(DoneStoreCache,$scope,Cache,$location,AlertService,$http,BSServiceUtil) {
    $scope._appUrl = _appUrl;
  //  AlertService.showError("Setup Error","Step 1");
            
    $scope.pageTitle = "Journey Plan";
    $scope.params = {};
    $scope.params.isStrartDay = false;
    $scope.logout = function() {
         	$http.get(_appUrl+'/api/logout').
	  success(function(data, status, headers, config) {
		  localStorage.clear();
			var rdata = angular.fromJson(data);
			if(rdata.status !=="S") {
				console.log("**** Error in logout *****"+result);
			}
				$scope.showLogin = true;
	  }).
	  error(function(data, status, headers, config) {
		  localStorage.clear();
		  $location.path(getAppName(window.location.pathname));
	  });
     }
     AlertService.showError("Setup Error","Step 2");
    $scope.login  = function() {
            $scope.signin  = true;
            var data = $.param({
                un: $scope.username,
                pw: $scope.pwd
            });
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            $http.post(_appUrl+'/api/login', data, config)
            .success(function (data, status, headers, config) {
                $scope.signin = false;
                if(data.status =="S") {
                        window._u = data.$_u;
                        localStorage.setItem("$_u",JSON.stringify(_u));
							window.location.href = "index.html";
  					} else {
  						$scope.responseDetails = data.error;
  					}
            })
            .error(function (data, status, header, config) {
                $scope.signin = false;
                $scope.responseDetails = "<li>Data: " + data +
                    "</li><li>status: " + status +
                    "</li><li>headers: " + header +
                    "</li><li>config: " + config +"</li>";
            });
        }
        AlertService.showError("Setup Error",Cache.loggedInUser());
    if(!Cache.loggedInUser()) {  
        AlertService.showError("Setup Error","Step 4");
       $scope.showLogin = true;
       return;
    } else {
        
      $scope.user = Cache.loggedInUser()
        $scope.showLogin = false;
         var _storeSP = DoneStoreCache.create("_keySPREFDet","SFGetSPDeailsRef");
         var _visitStore = DoneStoreCache.create("_keyVisitDet","FISfCustomerVisitRef");
         var loadDetails = function() {
         _storeSP.setWhereClause("user_id = ?");
         _storeSP.setWhereClauseParams([Cache.loggedInUser().uId]);
         _storeSP.query().then(function(item){
             $scope.salesrepdetials = item.data[0];
             _visitStore.setWhereClause("executive_id = ? and date_format(creation_Date,'%d %m %y') = date_format(now(),'%d %m %y')");
             _visitStore.setWhereClauseParams([$scope.salesrepdetials.id]);
             _visitStore.query().then(function(result){
                 if(result.data.length > 0) {
                    $scope.params.isStrartDay = true;
                 }
             });
              $location.path("/index/db");
         });
         }
        var _store = DoneStoreCache.create("_keySPREF","SFSalesPersonRef");
         _store.setWhereClause("user_id = ?");
         _store.setWhereClauseParams([Cache.loggedInUser().uId]);
         _store.query().then(function(item){
             $scope.salesrep = item.data[0];
             if( Cache.loggedInRole() === 'SalesOfficer') {
                    $scope.salesrep.isSO = "Y";
                    $location.path("index/listorder");
             } else {
                loadDetails(); 
             }
         });
        
         
    }
   
});
