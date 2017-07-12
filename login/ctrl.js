angular
    .module('mymobile3')
    .controller('LoginCtrl', function LoginCtrl($scope,$http, AlertService,$location){
        // use $.param jQuery function to serialize data from JSON 
        if(window._u) {
            $location.path("/index/main");
            return;
        }
        $scope.login  = function() {
            $scope.signin  = true;
            var data = $.param({
                fName: $scope.username,
                lName: $scope.pwd
            });
        
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('/api/login', data, config)
            .success(function (data, status, headers, config) {
                $scope.signin = false;
                if(rdata.status =="S") {
                        window._u = rdata.$_u;
                        localStorage.setItem("$_u",JSON.stringify(_u));
							window.location.href = "index.html";
  					} else {
  						$scope.responseDetails = rdata.error;
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
    });