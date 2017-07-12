/**
 * MainCtrl - controller
 */
angular
    .module('mymobile3')
    .controller('MainCtrl', function MainCtrl($scope,Cache,$location,AlertService,$http,BSServiceUtil) {
    $scope._appUrl = _appUrl;
    $scope.pageTitle = "Journey Plan";
    $scope.params = {};
     var initSalesRep = function() {
        var callback = function(result) {
                $scope.salesrep = result[0];
            }
            var wc = "user_id = ?";//sp.salesperson
            var wcParams = [Cache.loggedInUser().uId];
            BSServiceUtil.queryResultWithCallback("SFSalesPersonRef", "_NOCACHE_", wc, wcParams, undefined, callback);
    }
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
    if(!Cache.loggedInUser()) {  
       $scope.showLogin = true;
       return;
    } else {
      $scope.user = Cache.loggedInUser()
        $scope.showLogin = false;
        $location.path("/index/main");
    }
   
    initSalesRep();
       
})