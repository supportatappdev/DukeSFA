/*
 * Copyright (c) 2016 - present Dennisone.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * Dennisone. ("Confidential Information").  You shall not disclose
 * such Confidential Information and shall use it only in accordance
 * with the terms of the license agreement you entered into with Dennisone.
   This file should go into dennis js wrapper files.
 */
angular.module("doneComponentsSet", [])
 .directive('doneTable',function doneTable(AlertService,BSServiceUtil,$sce,DoneStoreCache) {
    return {
        restrict: 'E',
         scope: {
              md: '=colMd',
              tablecontext: '=tableContext'
          },
        templateUrl: 'config/doneTable.html',
        controller: function ($scope, $element,$attrs) {
        var _tableMetaData = $scope.md;
        var _tableContext = $scope.tablecontext;
        if(!_tableMetaData || !_tableContext  ) {
            AlertService.showError("Setup Error","Missing one of the value [md, tableContext] !");
            return;
        }
        if(!_tableMetaData.columns) {
             AlertService.showError("Setup Error","Please configure columns in table metadata");
            return;
        }
        $scope._columns =  _tableMetaData.columns;
        var _limit = _tableMetaData.limit;
        $scope._searchcolumns = [];
        for(var k = 0; k < $scope._columns.length; k++) {
            if($scope._columns[k].template) {
                $scope._columns[k].template = $sce.trustAsHtml($scope._columns[k].template);
            }
            if($scope._columns[k].enableSearch === 'Y') {
                $scope._searchcolumns.push($scope._columns[k]);
            }
        }
        //render search panel
        $scope.searchParams = {};
        var _searchPanelHtml = "";
        for(var k = 0; k < $scope._searchcolumns.length; k++) {
            var _colConfig = $scope._searchcolumns[k];
            if(k !==0 && k%2 == 0) {
                _searchPanelHtml += "</div>";
            }
            if(k%2 == 0) {
                _searchPanelHtml += '<div class="form-group">';
            }
            _searchPanelHtml += '<label class="col-lg-2 control-label"> '+_colConfig.label+'</label>';
            _searchPanelHtml += '<div class="col-lg-4">';
            if(_colConfig.type && angular.lowercase(_colConfig.type) === 'date') {
               _searchPanelHtml += '<div class="input-group date">';
               _searchPanelHtml += ' <input ng-model="searchParams.'+_colConfig.attributeName+'" type="datetime" class="form-control" '
               _searchPanelHtml += ' date-time=""  min-view="date" auto-close="true" format="dd/MM/yyyy"> '
               _searchPanelHtml += ' <span class="input-group-addon"><i class="fa fa-calendar"></i></span> '
               _searchPanelHtml += ' </div>';
            } else {
              _searchPanelHtml += ' <input placeholder="'+ _colConfig.label+'" class="form-control"';
              _searchPanelHtml += ' ng-model="searchParams.'+_colConfig.attributeName+'" type="text">';
            }
            _searchPanelHtml += '</div>';
            if(k === ($scope._searchcolumns.length - 1)){
                _searchPanelHtml += '</div>';
            }
        }
        
        $scope.searchHtml = _searchPanelHtml;
        //END-->
        //pagination setup
        $scope.pagenate = {};
        
        $scope.pagenate.limit = 10;
        if(_limit) {
            $scope.pagenate.limit = _limit;
        }
        $scope.pagenate.offset = 0;
        $scope.pagenate.currentPage = 1;
        //store
        //var _store = DoneStoreCache.create(_tableMetaData.id,_tableMetaData.customObject);
        //END
        
        var getData = function(offset,limit,isCount,wC,wCParams) {
            $scope.isLoading = true;
           var resultCallback = function(result) {
                $scope.isLoading = false;
                if(isCount) {
                    $scope.pagenate.totalPages = result.cnt;
                    $scope._dtableData = result.data;
                } else {
                    $scope._dtableData = result;
                }
                $scope.pagenate.offset += $scope.pagenate.limit;
            }
            var _orderBy = _tableMetaData.orderBy;
           BSServiceUtil.queryResultWithCallback(_tableMetaData.customObject, "_NOCACHE_", wC, wCParams, _orderBy, resultCallback,limit,offset,isCount);
        }
        getData($scope.pagenate.offset,$scope.pagenate.limit,"Y");
        $scope.gotoPage = function(currPage) {
           $scope.pagenate.currentPage  = currPage;
           if(currPage == 1) {
               $scope.pagenate.offset = 0;
           } else {
               $scope.pagenate.offset = (currPage*$scope.pagenate.limit) - $scope.pagenate.limit;
           }
           
           var isCount = undefined;
           getData($scope.pagenate.offset,$scope.pagenate.limit,
                        isCount,$scope.wc,$scope.wcParams);
        }
        
        //search
        
        $scope.search = function() {
            $scope.wc = "";
            $scope.wcParams = [];
            for(var k = 0; k < _tableMetaData.columns.length; k++) {
                if(_tableMetaData.columns[k].enableSearch === 'Y') {
                         var _searchKey = _tableMetaData.columns[k].attributeName;
                         var _searchVal = $scope.searchParams[_searchKey];
                         if(_searchVal) {
                            if( $scope.wcParams.length >= 1) {
                                $scope.wc += " AND ";
                            }
                            $scope.wc += " lower("+_tableMetaData.columns[k].attributeName+") like lower(?)";
                            $scope.wcParams.push("%"+ $scope.searchParams[_tableMetaData.columns[k].attributeName] + "%");
                         }
                }
            }
            $scope.pagenate.offset = 0;
            $scope.pagenate.limit = 10;
            if(_limit) {
              $scope.pagenate.limit = _limit;
            }
            getData($scope.pagenate.offset,$scope.pagenate.limit,"Y",$scope.wc,$scope.wcParams);
         }
        $scope.clear = function(){
            $scope.searchParams = [];
            delete $scope.wc;
            delete $scope.wcParams;
            $scope.pagenate.currentPage = 1;
            $scope.pagenate.offset = 0;
            $scope.pagenate.limit = 10;
            if(_limit) {
             $scope.pagenate.limit = _limit;
            }
            getData($scope.pagenate.offset,$scope.pagenate.limit,"Y");
            
        } 
     }
    }
    })
 .directive('doneSelect',function doneTable(AlertService,BSServiceUtil,$sce,DoneStoreCache) {
    return {
        restrict: 'E',
         scope: {
              id: '@selectId',
              customobject:'@customObject',
              ngmodel: '=ngModel',
              key:'@keyAttribute',
              label:'@labelAttribute',
              ngchange:'@ngChange',
              whereclause:'@whereClause',
              simplecombo:'@simpleCombo',
              values:'@values',
              params:'@params'
          },
        templateUrl: 'config/doneSelect.html',
        controller: function ($scope, $element,$attrs) {
        if((!$scope.simplecombo || $scope.simplecombo ==='N') && (!$scope.customobject 
                            || !$scope.key || !$scope.label )  ) {
            AlertService.showError("Setup Error","Missing one of the value [customobject, labelattribute,keyattribute] !");
            return;
        }
            if(($scope.simplecombo && $scope.simplecombo ==='Y') && (!$scope.values )  ) {
            AlertService.showError("Setup Error","Missing one of the value [values] !");
            return;
        }
            if(!$scope.simplecombo) {
                var getData = function(offset,limit,selectClause,wC,wCParams) {
                $scope.isLoading = true;
               var resultCallback = function(result) {
                    $scope.isLoading = false;
                    $scope.resultData = result;
                }
               BSServiceUtil.queryResultWithCallback($scope.customobject, "_NOCACHE_", wC, wCParams, undefined, resultCallback,limit,offset,undefined,undefined,selectClause);
            }
                var _selectClause = $scope.key+","+$scope.label
                getData(0,200,_selectClause);
            } else {
                var _values = $scope.values.split(",");
                $scope.resultData  = [];
                $scope.key = "key";
                $scope.label = "label";
                for(var k = 0 ; k < _values.length; k++) {
                    var _item = _values[k];
                    var _object = _item.split(":");
                    if(!_object || _object.length < 2) {
                        AlertService.showError("Setup Error","Values are not configured properly for simple combo box");
                    }
                    $scope.resultData.push({key:_object[0],label:_object[1]});
                    
                }
                //RR:Project Preimum,GT:General Trade
                
            }
        }
    }
    })
 
 .directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    element.html(value && value.toString());
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    }])
 .directive('doneBarChart',function barChart(AlertService,BSServiceUtil) {
    return {
        restrict: 'EA',
         scope: {
              customobject: '=',
              keyattribute: '=',
              labelattribute: '=',
          },
        templateUrl: 'common/chart.html',
        controller: function ($scope, $element,$attrs) {
        var _co = $attrs.customobject;
        var _key = $attrs.keyattribute;
        var _label = $attrs.labelattribute;
        
        if(!_co || !_key || !_label ) {
            AlertService.showError("Error","Missing one of the value [customobject, keyattribute, labelattribute]!");
            return;
        }
        var _wc = $attrs.wc;
        /**
     * Bar Chart Options
     */
    $scope.chartOptions = {
        series: {
            bars: {
                show: true,
                barWidth: 0.6,
                fill: true,
                fillColor: {
                    colors: [
                        {
                            opacity: 0.8
                        },
                        {
                            opacity: 0.8
                        }
                    ]
                }
            }
        },
       
        colors: ["#1ab394"],
        grid: {
            color: "#999999",
            hoverable: true,
            clickable: true,
            tickColor: "#D4D4D4",
            borderWidth: 0
        },
        xaxis: {
           mode: "categories",
				tickLength: 0
        }
        // ,
        // tooltip: true,
        // tooltipOpts: {
        //     content: "x: %x, y: %y"
        // }
    };

    /**
     * Bar Chart data
     */
    $scope.chartData = [
        {
            label: "Order Amount",
            data: []
        }
    ];
        var callback = function(result) {
            if (result) {
                for (var k = 0 ; k < result.length; k++) {
                    var _item = [];
                    _item.push(result[k][_key]);
                    _item.push(result[k][_label]);
                    $scope.chartData[0].data.push(_item);
                }
            } 
        }
        BSServiceUtil.queryResultWithCallback(_co, "_NOCACHE_", _wc, undefined, undefined, callback,undefined, undefined, undefined, undefined, _key+","+_label);
     }
    }
    })
 .directive('doneLineChart',function barChart(AlertService,BSServiceUtil) {
    return {
        restrict: 'EA',
         scope: {
              customobject: '=',
              keyattribute: '=',
              labelattribute: '=',
          },
        templateUrl: 'common/chart.html',
        controller: function ($scope, $element,$attrs) {
        var _co = $attrs.customobject;
        var _key = $attrs.keyattribute+"";
        var _label = $attrs.labelattribute+"";
        
        if(!_co || !_key || !_label ) {
            AlertService.showError("Error","Missing one of the value [customobject, keyattribute, labelattribute]!");
            return;
        }
        var _wc = $attrs.wc;
       
        /**
     * Line Chart Options
     */
     $scope.chartOptions = {
        series: {
            lines: {
                show: true,
                lineWidth: 2,
                fill: true,
                fillColor: {
                    colors: [
                        {
                            opacity: 0.0
                        },
                        {
                            opacity: 0.0
                        }
                    ]
                }
            }
        },
       xaxis: {
           mode: "categories",
				tickLength: 0
        },
        colors: ["#1ab394"],
        grid: {
            color: "#999999",
            hoverable: true,
            clickable: true,
            tickColor: "#D4D4D4",
            borderWidth: 0
        },
        legend: {
            show: false
        },
        tooltip: true,
        tooltipOpts: {
            content: "x: %x, y: %y"
        }
    };

    /**
     * Line Chart Data
     */
   $scope.chartData = [
        {
            label: "line",
            data: []
        }
    ];
        var callback = function(result) {
            if (result) {
                for (var k = 0 ; k < result.length; k++) {
                    var _item = [];
                    _item.push(result[k][_key]);
                    _item.push(result[k][_label]);
                    $scope.chartData[0].data.push(_item);
                }
            } 
        }
        BSServiceUtil.queryResultWithCallback(_co, "_NOCACHE_", _wc, undefined, undefined, callback,undefined, undefined, undefined, undefined, _key+","+_label);
     }
    }
    })
 .directive('donePieChart',function barChart(AlertService,BSServiceUtil) {
    return {
        restrict: 'EA',
         scope: {
              customobject: '=',
              keyattribute: '=',
              labelattribute: '=',
          },
        templateUrl: 'common/chart.html',
        controller: function ($scope, $element,$attrs) {
        var _co = $attrs.customobject;
        var _key = $attrs.keyattribute+"";
        var _label = $attrs.labelattribute+"";
        
        if(!_co || !_key || !_label ) {
            AlertService.showError("Error","Missing one of the value [customobject, keyattribute, labelattribute]!");
            return;
        }
        var _wc = $attrs.wc;
       
        /**
     * Pie Chart Data
     */
     var colors = ["#d3d3d3","#2E86C1","#CD6155","#2E4053","#4D5656","#58D68D","#d3d3d3","#2E86C1","#CD6155","#2E4053","#4D5656","#58D68D"];
    /**
     * Pie Chart Options
     */
    $scope.chartOptions = {
        series: {
            pie: {
                show: true
            }
        },
        grid: {
            hoverable: true
        },
        tooltip: true,
        tooltipOpts: {
            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: true
        }
    };
        var callback = function(result) {
            if (result) {
                for (var k = 0 ; k < result.length; k++) {
                    var _item = {};
                    _item.label = result[k][_key];
                    _item.data = result[k][_label];
                    _item.color = colors[k];
                     $scope.chartData.push(_item);
                }
            } 
        }
        BSServiceUtil.queryResultWithCallback(_co, "_NOCACHE_", _wc, undefined, undefined, callback,undefined, undefined, undefined, undefined, _key+","+_label);
     }
    }
    })
  .factory('DoneStore', function(BSServiceUtil,$q) {
      
    function DoneStore(id,customObject) { 
        var deferred = $q.defer();
            var data = {};
            var id = id;
            var customObject = customObject;
            var wc;
            var wcParams = [];
            var isCountQuery = 'N';
            var offset = 0;
            var limit = 20;
            var orderBy;
            var beforeQueryCallback;
            this.setOffset = function(_offset) {
                 offset = _offset;
            }
            this.setOrderBy = function(_orderBy) {
                 orderBy = _orderBy;
            }
            this.setLimit = function(_limit) {
                limit = _limit;
            }
            this.getLimit = function() {
                return limit ;
            }
            this.setWhereClause = function(whereClause){
               wc = whereClause;
            }
            this.setWhereClauseParams = function(params) {
                wcParams = params;
            }
            this.beforeQueryListener = function(callback) {
                beforeQueryCallback = callback;
            }
            this.query = function(){
                if(beforeQueryCallback) {
                    beforeQueryCallback();
                }
                var resultCallback = function(result) {
                    var _item = {};
                    if( isCountQuery && isCountQuery === 'Y') {
                        cnt = result.cnt;
                        data  = result.data;
                        _item.cnt = this.cnt;
                        _item.data = this.data;
                    } else {
                         data = result;
                         _item = result;
                    }
                    offset += limit;
                     deferred.resolve(_item);
                }
               BSServiceUtil.queryResultWithCallback(customObject, "_NOCACHE_", wc, wcParams, orderBy, resultCallback,limit,offset,isCountQuery);
               return deferred.promise;
            }
            
        }
    return {
        get: function(id,customObject) {
            return new DoneStore(id,customObject);
        }
    };
}) 
 .service('DoneStoreCache',function(AlertService,DoneStore){
     this.map = {};
     this.create = function(key,customObject){
         if(this.map[key]) {
            return this.map[key];
            //AlertService.showInfo("Info","Duplicate store id for ["+key+":"+customObject+"]");
         } else {
           var _store =  DoneStore.get(key,customObject);
           this.map[key] = _store; 
         }
         return _store;
     }
     this.get = function(key) {
         return map[key];
     }
 });
