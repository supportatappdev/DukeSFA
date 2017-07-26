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
        
        var loadReatils  = function(isCount) {
              $scope.retailers.retailListLoading = true;
            var spRetailResult = function(result) {
                $scope.retailers.retailListLoading = false;
                var _data;
                if(isCount === 'N') {
                    _data = result.data;
                } else {
                    _data = result.data;
                    $scope.totalcnt = result.cnt;
                }
                for(var k = 0; k < _data.length; k++) {
                    $scope.retailers.spRetailList.push(_data[k]);
                }
                if(_data.length <  $scope.retailers.limit) {
                    $scope.retailers.loaded = true;
                }
            }
            var wc = "spid = ?";//sp.salesperson
            var wcParams = [ $scope.salesrep.id];
            BSServiceUtil.queryResultWithCallback("SFSPRetailViewRef", "_NOCACHE_", wc, wcParams, " last_update_date desc ", spRetailResult, $scope.retailers.limit,$scope.retailers.offset,isCount);
        }
        loadReatils("Y");
        
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
            loadReatils("N");
        }
});

angular
    .module('mymobile3')
    .controller('JPRetailsCtrl', function CustCtrl(DoneMsgbox,$scope,Cache,$location,AlertService,$http,BSServiceUtil) {
       $scope._currDate = new Date();
        $("body").removeClass("mini-navbar");
        $scope.retailers = {
             spRetailList:[],
             retailListLoading: false,
             offset: 0,
             limit: 20
        };
        var loadReatils  = function(isCount) {
              $scope.retailers.retailListLoading = true;
            var spRetailResult = function(result) {
                $scope.retailers.retailListLoading = false;
                var _data = result.data;
                if(isCount === 'Y') {
                    $scope.totalcnt = result.cnt;
                }
                for(var k = 0; k < _data.length; k++) {
                    $scope.retailers.spRetailList.push(_data[k]);
                }
                if(_data.length <  $scope.retailers.limit) {
                    $scope.retailers.loaded = true;
                }
            }
            var wc = "spid = ?";//sp.salesperson
            var wcParams = [ $scope.salesrep.id];
            BSServiceUtil.queryResultWithCallback("SFSPRetailJPViewRef", "_NOCACHE_", wc, wcParams, " end_call desc", spRetailResult, $scope.retailers.limit,$scope.retailers.offset,isCount);
        }
        loadReatils("Y");
        $scope.getNextPage = function() {
            if($scope.retailers.loaded) {
                return;
            }
            $scope.retailers.offset = ($scope.retailers.offset + $scope.retailers.limit);
            loadReatils("N");
        }
        $scope.startCall = function(item) {
            if(item.visited > 0) {
                return;
            }
            var callback = function() {
                $location.path("/index/newcall/"+item.cid);
            }
            if(!$scope.params.isStrartDay) {
                DoneMsgbox.show("Warning","Warning!","Your day haven't started yet. Do you wish to start yoru day?",'Y')
                    .then(function(){
                       callback();
                    }, function(){
                    });
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
       var _productTypesStore = DoneStoreCache.create("_keySFProductTypeRef2","SFProductTypeRef");
       
       $scope.x = {};
       $scope.loadProducts = function(po) {
            _productsStore.setWhereClause("prdtype_id = ?");
            _productsStore.setLimit(300);
            _productsStore.setOffset(0);
            _productsStore.setWhereClauseParams([po.selproducttype]);
            _productsStore.query().then(function(result) {
                po.products = result.data;
            });
            //BSServiceUtil.queryResultWithCallback("SFProductViewRef", "_NOCACHE_", " prdtype_id = ?", [po.selproducttype], undefined, callback,300,0);
       }
      loadProductTypes = function() {
            _productTypesStore.setLimit(300);
            _productTypesStore.setOffset(0);
            _productTypesStore.query().then(function(result) {
                $scope.producttypes = result.data;
            });
       }
       loadProductTypes();
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
                inputJSON.item_count = $scope.order.length;
                var _taxAmount = 0;
                 for(var k = 0; k < $scope.order.length; k++) {
                     _taxAmount =  Number(_taxAmount) + Number(parseInt($scope.order[k].sgst)+parseInt($scope.order[k].cgst));
                 }
                inputJSON.order_tax_amount = _taxAmount;
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
                 inputJSON.item_scheme_amount = $scope.order[k].ndiscamount;
                 inputJSON.item_tax_amount = parseInt($scope.order[k].sgst)+parseInt($scope.order[k].cgst);
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
                    endCall(orderId);
                }
            });            
       }
       
       var endCall  = function(orderId) {
           var inputJSON = {};
                inputJSON.id = $scope.callid;
                inputJSON.call_end_time = Util.convertDBDate(new Date());
                inputJSON.order_id = orderId;
                inputJSON.is_teleorder = 0;
                inputJSON.is_productive = 1;
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
        
       $scope.x = {};
       $scope.loadProducts = function(po) {
            _productsStore.setWhereClause("prdtype_id = ?");
            _productsStore.setLimit(300);
            _productsStore.setOffset(0);
            _productsStore.setWhereClauseParams([po.selproducttype]);
            _productsStore.query().then(function(result) {
                po.products = result.data;
            });
       }
         var _productScheme = DoneStoreCache.create("_keySFSchemeViewRef","SFSchemeViewRef");
         var loadSchemeDetails = function(po) {
            _productScheme.setWhereClause("prd_code = ?");
            _productScheme.setLimit(1);
            _productScheme.setOffset(0);
            _productScheme.setWhereClauseParams([po.selproduct.prd_code]);
            _productScheme.query().then(function(result) {
                po.scheme = result.data[0].scheme_pcent;
            });
         } 
         $scope.setProdDetails = function(selproduct,po) {
                po.price = selproduct.pcs_price;
                po.prodname = selproduct.prd_name;
                po.id = selproduct.id;
                po.uom = selproduct.uom;
                po._sgst = selproduct.sgst;
                po._cgst = selproduct.cgst;
                loadSchemeDetails(po);
            }
            
        $scope.setTotal = function(po) {
                po.sgst = $filter('number')((po.price * po._sgst)/100,2);
                po.cgst = $filter('number')((po.price * po._cgst)/100,2);
                po.sgst = $filter('number')(po.quantity * po.sgst,2);
                po.cgst = $filter('number')(po.quantity * po.cgst,2);
                if(po.scheme) {
                    po.ndiscamount = parseFloat(po.price*po.quantity)*parseFloat(po.scheme)/100;
                    po.discamount = $filter('number')(parseFloat(po.price*po.quantity)*parseFloat(po.scheme)/100,2);
                }
                po.total = $filter('number')((parseFloat(po.price*po.quantity) - po.ndiscamount),2);
                po.ntotal = parseFloat(po.price*po.quantity) - po.ndiscamount;
                var _totAmount = 0;
                angular.forEach($scope.order, function(po){
                    _totAmount = Number(_totAmount) + Number(parseFloat(po.ntotal));
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
            $scope.order.push( {selected:false,selproducttype:'',prodname:'',quantity:'',price:'',grams:'',no_of_packs:'',loadability:''});
        };
        $scope.remove = function($index){
                var newDataList=[];
                $scope.selectedAll = false;
                $scope.totalAmount = $scope.totalAmount - $scope.order[$index].total;
                $scope.order.splice($index, 1);
                // angular.forEach($scope.order, function(selected){
                //     if(!selected.selected){
                //         newDataList.push(selected);
                //     }
                // }); 
                // $scope.order = newDataList;
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
    .controller('RouteCtrl', function AddCustCtrl(DoneMsgbox,$timeout,DoneStoreCache,GeoLocation,Util,BSServiceUtil,$state,$stateParams,$scope,Cache,$location,AlertService,$http,BSService) {
        $("body").removeClass("mini-navbar");
        var _operation = 'INSERT';
        var _custId = $stateParams.id;
        $scope.cust = {};
 
         var _customersStore = DoneStoreCache.create("_keyRSFSPRetailJPViewRef","SFSPRetailJPViewRef");
        $scope.x = {};
        var getCustomer = function() {
             _customersStore.setWhereClause("spid = ?");
             _customersStore.setLimit(300);
             _customersStore.setOffset(0);
             _customersStore.setOrderBy("end_call desc");
             _customersStore.setWhereClauseParams([ $scope.salesrep.id]);
             _customersStore.query().then(function(result) {
                 $scope.customers = result.data;
                  $scope.fcustomers = [];
                  $scope.wayPoints = [];
                  var _prevCust;
                 for(var k = 0 ; k < $scope.customers.length; k++) {
                     if($scope.customers[k] 
                        && $scope.customers[k].lat && $scope.customers[k].lng) {
                            var _cust = $scope.customers[k];
                            $scope.fcustomers.push(_cust);
                            if(_cust.end_call) {
                                _prevCust = _cust;
                                $scope.wayPoints.push({location: {lat:parseFloat(_cust.lat),lng:parseFloat(_cust.lng)},stopover:true});
                            }
                            if(_cust.end_call 
                                    && !$scope.destination) {
                                $scope.destination = _cust.addr_line1;
                            }
                            if(!_cust.end_call) {
                                $scope.origin = _prevCust.addr_line1;
                            }
                        }
                 }
            })
            $scope.wayPoints = [{location: {lat:17.518993,lng:78.397236},stopover:true},
                                {location: {lat:17.517397,lng:78.390155},stopover:true},
                                {location: {lat:17.521592,lng:78.392472},stopover:true},
                                {location: {lat:17.518993,lng:78.397236},stopover:true},
                                {location: {lat:17.518993,lng:78.397236},stopover:true}];
           // $scope.origin = "Pragathi Nagar";
        //    $scope.destination = "Nizampet";
         }
         getCustomer();
        $scope.gotoCustomers = function() {
            $location.path("/index/listcust");
        }
    });

angular
    .module('mymobile3')
    .controller('AddCustCtrl', function AddCustCtrl(DoneMsgbox,$timeout,DoneStoreCache,GeoLocation,Util,BSServiceUtil,$state,$stateParams,$scope,Cache,$location,AlertService,$http,BSService) {
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
            DoneMsgbox.show("Info","Alert!","Do you want to capture customer location?",'Y')
                    .then(function(){
                       callback();
                    }, function(){
                    });
            //AlertService.showConfirm("Warning","Do you want to capture customer location?",callback);
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
        $scope.x = {};
        var getCustomer = function() {
          $timeout( 
           _custStore.query().then(function(result) {
                 $scope.cust = result.data[0];
                     $scope.customerchannel = $scope.cust.channel_id;
                     $scope.customertype = parseInt($scope.cust.customer_type_code);
                     $scope.customergroup = parseInt($scope.cust.customer_group_code);
                     $scope.tradetype = $scope.cust.trade_type_code;
                     $scope.jpDay = $scope.cust.jp_id+"";
                     $scope.fortnight = $scope.cust.visit_type+"";
                 $scope.salesrepdetials.dstid = $scope.cust.dstb_id;
                 $scope.salesrepdetials.tid = $scope.cust.terri_id;
                 $scope.salesrepdetials.rid = $scope.cust.route_id;
            }),1000);
         }
         
        if(_custId !== 'new') {
            _operation = 'UPDATE';
            _custStore.setWhereClause(" id = ? ");
            _custStore.setWhereClauseParams([ _custId]);
            _custStore.setOffset(0);
             getCustomer();
             $scope.btnTxt = "Update Customer";
        } else {
            $scope.btnTxt = "Add Customer";
        }
        $scope.addCustomer = function() {
        $scope.addcspinner = true;
        var inputJSON = $scope.cust;
         inputJSON.channel_id = $scope.customerchannel;
         inputJSON.customer_type_code = $scope.customertype+"";
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
                    AlertService.showInfo("Info",_op+" retailer ["+$scope.cust.cust_name+"]  successfully");
                    $scope.gotoCustomers();
                }
                $scope.addcspinner  =false;
            });
        }
        
        $scope.gotoCustomers = function() {
            $location.path("/index/listcust");
        }
    });

// var date = new Date(), y = date.getFullYear(), m = date.getMonth();
// var firstDay = new Date(y, m, 1);
// var lastDay = new Date(y, m + 1, 0);

// Date.prototype.addDays = function(days) {
//       var dat = new Date(this.valueOf())
//       dat.setDate(dat.getDate() + days);
//       return dat;
//   }

//   function getDates(startDate, stopDate) {
//       var dateArray = new Array();
//       var currentDate = startDate;
//       while (currentDate <= stopDate) {
//         dateArray.push(currentDate)
//         currentDate = currentDate.addDays(1);
//       }
//       return dateArray;
//     }

// var dateArray = getDates(new Date(), (new Date()).addDays(10));
// for (i = 0; i < dateArray.length; i ++ ) {
//     alert (dateArray[i]);
// }
