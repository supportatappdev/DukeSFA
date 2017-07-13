/**
 * CustCtrl - controller
 */

angular
    .module('mymobile3')
    .controller('CustCtrl', function CustCtrl(DoneStoreCache,$scope,Cache,$location,AlertService,$http,BSServiceUtil) {
        $("body").removeClass("mini-navbar");
        $scope.retailers = {
             spRetailList:[],
             retailListLoading: false,
             offset: 0,
             limit: 10
        };
        $scope.goToRetailer = function(custid) {
            $location.path("/index/addcust/"+custid);
        }
        var loadReatils  = function() {
              $scope.retailers.retailListLoading = true;
            var spRetailResult = function(result) {
                $scope.retailers.retailListLoading = false;
                for(var k = 0; k < result.length; k++) {
                    $scope.retailers.spRetailList.push(result[k]);
                }
                if(result.length <  $scope.retailers.limit) {
                    $scope.retailers.loaded = true;
                }
            }
            var wc = "spid = ?";//sp.salesperson
            var wcParams = [ $scope.salesrep.id];
            BSServiceUtil.queryResultWithCallback("SFSPRetailViewRef", "_NOCACHE_", wc, wcParams, " last_update_date desc ", spRetailResult, $scope.retailers.limit,$scope.retailers.offset);
        }
        loadReatils();
        
        //Store 
        //  var _store = DoneStoreCache.create("_keySFSPRetailViewRef","SFSPRetailViewRef");
        //  _store.setWhereClause("spid = ?");
        //  _store.setLimit($scope.retailers.limit);
        //  _store.setOrderBy("last_update_date desc");
        //  _store.setOffset($scope.retailers.offset);
        //  _store.setWhereClauseParams([ $scope.salesrep.id]);
        //  var _callback = function(){
        //      $scope.retailers.retailListLoading = true;
        //  }
        //  _store.beforeQueryListener(_callback);
        //  var _resultCallback = function(item){
        //         $scope.retailers.retailListLoading = false;
        //         var result = item.data;
        //         for(var k = 0; k < result.length; k++) {
        //             $scope.retailers.spRetailList.push(result[k]);
        //         }
        //         if(result.length <  _store.getLimit()) {
        //             $scope.retailers.loaded = true;
        //         }
            
        //  }
        //  _store.query().then(_resultCallback);
        //-->END
        
        $scope.getNextPage = function() {
            if($scope.retailers.loaded) {
                return;
            }
             $scope.retailers.offset = ($scope.retailers.offset + $scope.retailers.limit);
            // _store.setOffset($scope.retailers.offset);
            //_store.query().then(_resultCallback);
            loadReatils();
        }
});
angular
    .module('mymobile3')
    .controller('JPRetailsCtrl', function CustCtrl($scope,Cache,$location,AlertService,$http,BSServiceUtil) {
       $scope._currDate = new Date();
        $("body").removeClass("mini-navbar");
        $scope.retailers = {
             spRetailList:[],
             retailListLoading: false,
             offset: 0,
             limit: 20
        };
        var loadReatils  = function() {
              $scope.retailers.retailListLoading = true;
            var spRetailResult = function(result) {
                $scope.retailers.retailListLoading = false;
                for(var k = 0; k < result.length; k++) {
                    $scope.retailers.spRetailList.push(result[k]);
                }
                if(result.length <  $scope.retailers.limit) {
                    $scope.retailers.loaded = true;
                }
            }
            var wc = "spid = ?";//sp.salesperson
            var wcParams = [ $scope.salesrep.id];
            BSServiceUtil.queryResultWithCallback("SFSPRetailJPViewRef", "_NOCACHE_", wc, wcParams, undefined, spRetailResult, $scope.retailers.limit,$scope.retailers.offset);
        }
        loadReatils();
        $scope.getNextPage = function() {
            if($scope.retailers.loaded) {
                return;
            }
            $scope.retailers.offset = ($scope.retailers.offset + $scope.retailers.limit);
            loadReatils();
        }
        $scope.startCall = function(id) {
            var callback = function() {
                $location.path("/index/newcall/"+id);
            }
            if(!$scope.params.isStrartDay) {
                AlertService.showConfirm("Info","Your day haven't started yet. Do you wish to start yoru day?",callback);
            } else {
                callback();
            }
        }
});
angular
    .module('mymobile3')
    .controller('NewCallCtrl', function CustCtrl(DoneStoreCache,BSService,Util,$state,$stateParams,$filter,$scope,Cache,$location,AlertService,$http,BSServiceUtil,$location) {
       $scope._currDate = new Date();
       $scope.params.isStrartDay = true;
       var _productsStore = DoneStoreCache.create("_keySFProductViewRef2","SFProductViewRef");
       $scope.x = {};
       $scope.loadProducts = function() {
            _productsStore.setWhereClause("prdtype_id = ?");
            _productsStore.setLimit(300);
            _productsStore.setOffset(0);
            _productsStore.setWhereClauseParams([$scope.x.selproducttype]);
            _productsStore.query().then(function(result) {
                    $scope.products = result.data;
            });
           // BSServiceUtil.queryResultWithCallback("SFProductViewRef", "_NOCACHE_", " prdtype_id ", "", undefined, products);
       }
       //loadProducts();
       var startCall = function() {
            var inputJSON = {};
                inputJSON.customer_id = $stateParams.id;
                inputJSON.executive_id = $scope.salesrep.id;
                inputJSON.call_start_time = Util.convertDBDate(new Date());
                 inputJSON.isGenIds = "Y";
                 var params = {
                'ds': 'FISfCustomerVisitRef',
                'operation': 'INSERT',
                'data': inputJSON
            };
            BSService.save({
                'method': 'update'
            }, params, function(result) {
                if (result.status === "E") {
                    AlertService.showError("Validation Error",result.errorMsg);
                }  else {
                    $scope.callid = result.ids[0];
                }
            });
        }
       startCall();
       $scope.submitOrder = function() {
           var inputJSON = {};
                inputJSON.customer_id = $stateParams.id;
                inputJSON.order_no = "SO-05062017-"+$scope.callid;
                inputJSON.order_amount = $scope.totalAmountNumber;
                inputJSON.item_count = $scope.products.length;
                inputJSON.order_tax_amount = 0;
                 inputJSON.isGenIds = "Y";
                 var params = {
                'ds': 'FISFOrderRef',
                'operation': 'INSERT',
                'data': inputJSON
            };
            BSService.save({
                'method': 'update'
            }, params, function(result) {
                if (result.status === "E") {
                    AlertService.showError("Validation Error",result.errorMsg);
                }  else {
                    var orderId = result.ids[0];
                    submitOrderDetails(orderId,inputJSON.order_no);
                   // endCall(orderId);
                }
            });
       }
       var submitOrderDetails = function(orderId,orderNo) {
		  var params = [];
		   for(var k = 0; k < $scope.order.length; k++) {
		       var inputJSON = {};
		       inputJSON.customer_id = $stateParams.id;
                inputJSON.order_no = orderNo;
                 inputJSON.order_id = orderId;
                inputJSON.product_id = $scope.order[k].id;
                inputJSON.item_qty = $scope.order[k].quantity;
                 inputJSON.item_amount = $scope.order[k].price;
                 inputJSON.item_scheme_amount = 0;
                 var _item = {
                'ds': 'SFOrderDetRef',
                'operation': 'INSERT',
                'data': inputJSON
                };
                params.push(_item);
		   }
                
            BSService.save({
                'method': 'update'
            }, {"list":params} , function(result) {
                if (result.status === "E") {
                    AlertService.showError("Validation Error",result.errorMsg);
                }  else {
                    endCall();
                }
            });            
       }
       
       var endCall  = function(orderId) {
           var inputJSON = {};
                inputJSON.id = $scope.callid;
                inputJSON.call_end_time = Util.convertDBDate(new Date());
                inputJSON.order_id = orderId;
                inputJSON.custUpdate = "Y";
                 var params = {
                'ds': 'FISfCustomerVisitRef',
                'operation': 'UPDATE',
                'data': inputJSON
            };
            BSService.save({
                'method': 'update'
            }, params, function(result) {
                if (result.status === "E") {
                    AlertService.showError("Validation Error",result.errorMsg);
                }  else {
                    gotoJPCustomers();
                }
            });
       }
       var gotoJPCustomers = function() {
           $location.path("/index/listcustjp")
       }
        $("body").removeClass("mini-navbar");
        $scope.retailers = {
             spRetailList:[],
             retailListLoading: false,
             offset: 0,
             limit: 20
        };
        var loadReatils  = function() {
              $scope.retailers.retailListLoading = true;
            var spRetailResult = function(result) {
                $scope.retailers.retailListLoading = false;
                for(var k = 0; k < result.length; k++) {
                    $scope.retailers.spRetailList.push(result[k]);
                }
                if(result.length <  $scope.retailers.limit) {
                    $scope.retailers.loaded = true;
                }
            }
            var wc = "spid = ?";//sp.salesperson
            var wcParams = [ $scope.salesrep.id];
            BSServiceUtil.queryResultWithCallback("SFSPRetailJPViewRef", "_NOCACHE_", wc, wcParams, undefined, spRetailResult, $scope.retailers.limit,$scope.retailers.offset);
        }
        loadReatils();
         $scope.setProdDetails = function(selproduct,po) {
                po.price = selproduct.ctnr_price;
                po.prodname = selproduct.prd_name;
                po.id = selproduct.id;
                po.sgst = selproduct.sgst;
                po.cgst = selproduct.cgst;
            }
            
        $scope.setTotal = function(po) {
                po.total = $filter('number')((po.price*po.quantity)+(po.sgst + po.cgst),2);
                var _totAmount = 0;
                angular.forEach($scope.order, function(po){
                    _totAmount += po.price*po.quantity ;
                    _totAmount += (po.sgst + po.cgst);
                }); 
                $scope.totalAmount = $filter('number')(_totAmount,2);
                $scope.totalAmountNumber = _totAmount;
            }    
     
        $scope.getNextPage = function() {
            if($scope.retailers.loaded) {
                return;
            }
            $scope.retailers.offset = ($scope.retailers.offset + $scope.retailers.limit);
            loadReatils();
        }
        $scope.order = [];
        $scope.totalAmount = 0;
        $scope.totalAmountNumber = 0;
        $scope.addNew = function($event){
            $event.preventDefault();
            $scope.order.push( {selected:false,prodname:'',quantity:'',price:'',grams:'',no_of_packs:'',loadability:''});
        };
        $scope.remove = function(){
                var newDataList=[];
                $scope.selectedAll = false;
                angular.forEach($scope.order, function(selected){
                    if(!selected.selected){
                        newDataList.push(selected);
                    }
                }); 
                $scope.order = newDataList;
            };
        $scope.selectedAll  = false;
        $scope.checkAll = function () {
            if (!$scope.selectedAll) {
                $scope.selectedAll = true;
            } else {
                $scope.selectedAll = false;
            }
            angular.forEach($scope.order, function(mps) {
                mps.selected = $scope.selectedAll;
            });
        };   
        
});

angular
    .module('mymobile3')
    .controller('AddCustCtrl', function AddCustCtrl(DoneStoreCache,GeoLocation,Util,BSServiceUtil,$state,$stateParams,$scope,Cache,$location,AlertService,$http,BSService) {
        $("body").removeClass("mini-navbar");
        var _operation = 'INSERT';
        var _custId = $stateParams.id;
        $scope.cust = {};
        //load types
        
        //-->END
        var init  = function() {
            var callback = function() {
                    $scope.getLatitudeLongitude();
            }
            AlertService.showConfirm("Warning","Do you want to capture customer location?",callback);
        }
        $scope.getLatitudeLongitude = function() {
           $scope.getlatlong = true;
           GeoLocation.getLocation().then(function(position){
                    $scope.cust.latitude = position.lat;
                    $scope.cust.longitude = position.lng;
                    $scope.getlatlong = false;
           }).catch(function(err){
                AlertService.showError("App Error", error.msg);
           });
        }
        init();
        // var getLatLong = function(callback) {
        //     // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
        //     if(!$scope.cust.addr_line1) {
        //         AlertService.showError("Validation Error","Please enter address");
        //         return;
        //     }
        //     var _address = $scope.cust.addr_line1;
        //     _address = angular.lowercase(_address);
        //     if(_address.indexOf("hno") > -1 
        //     || _address.indexOf("hno:") > -1) {
        //         _address = _address.replace(/hno:/g, '');
        //         _address = _address.replace(/hno/g, '');
        //     }
        //     // Initialize the Geocoder
        //     geocoder = new google.maps.Geocoder();
        //     if (geocoder) {
        //         geocoder.geocode({
        //             'address': _address
        //         }, function (result, status) {
        //             if (status == google.maps.GeocoderStatus.OK) {
        //                 callback(result[0].geometry.location.lat(),result[0].geometry.location.lng());
        //             } else {
        //                   AlertService.showError("Validation Error","Not able to find locations, Please enter valid address");
        //             }
        //         });
        //     }
        // }
         var _custStore = DoneStoreCache.create("_keyFISFCustomerRef","FISFCustomerRef");
         _custStore.setWhereClause("id = ?");
         _custStore.setOrderBy("last_update_date desc");
         _custStore.setWhereClauseParams([ _custId]);
        var getCustomer = function() {
            var callback = function(result) {
                 $scope.cust = result.data[0];
                 $scope.customerchannel = $scope.cust.channel_id;
                 $scope.customertype = $scope.cust.customer_type_code;
                 $scope.customergroup = $scope.cust.customer_group_code;
                 $scope.tradetype = $scope.cust.trade_type_code;
                 $scope.jpDay = $scope.cust.jp_id;
                 $scope.fortnight = $scope.cust.visit_type;
                 $scope.salesrepdetials.dstid = $scope.cust.dstb_id;
                 $scope.salesrepdetials.tid = $scope.cust.terri_id;
                 $scope.salesrepdetials.rid = $scope.cust.route_id;
            }
           _custStore.query().then(callback);
         }
        
         
        if(_custId !== 'new') {
            _operation = 'UPDATE';
             getCustomer();
             $scope.btnTxt = "Update Customer";
        } else {
            $scope.btnTxt = "Add Customer";
        }
        $scope.addCustomer = function() {
        $scope.addcspinner = true;
        var inputJSON = $scope.cust;
         inputJSON.channel_id = $scope.customerchannel;
         inputJSON.customer_type_code = $scope.customertype;
         inputJSON.customer_group_code = $scope.customergroup;
         inputJSON.trade_type_code = $scope.tradetype;
         inputJSON.jp_id = $scope.jpDay;
         inputJSON.visit_type = $scope.fortnight;
         inputJSON.dstb_id = $scope.salesrepdetials.dstid;
         inputJSON.terri_id = $scope.salesrepdetials.tid;
         inputJSON.route_id = $scope.salesrepdetials.rid;
        // inputJSON.terri_id = 
                if(_operation == 'UPDATE')  {
                    inputJSON.last_update_date = Util.convertDBDate(new Date());
                    inputJSON.creation_date = Util.convertDBDate($scope.cust.creation_date);
                } else {
                 inputJSON.cust_code = 'W00'+$scope.cust.cust_name;
                }
                 var params = {
                'ds': 'FISFCustomerRef',
                'operation': _operation,
                'data': inputJSON
            };
            BSService.save({
                'method': 'update'
            }, params, function(result) {
                if (result.status === "E") {
                    AlertService.showError("Validation Error",result.errorMsg);
                }  else {
                    var _op = "Added";
                    if(_operation == 'UPDATE') {
                        _op = "Updated";
                    }
                    AlertService.showInfo("Warning",_op+" retailer ["+$scope.cust.cust_name+"]  successfully");
                    $scope.gotoCustomers();
                }
                $scope.addcspinner  =false;
            });
        }
        
        $scope.gotoCustomers = function() {
            $location.path("/index/listcust");
        }
    });
