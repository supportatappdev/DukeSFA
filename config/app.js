/**
 * mymobile3
 */
(function () {
    angular.module('mymobile3', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'ngResource',
        'datePicker',
         'cgNotify',
          'oitozero.ngSweetAlert',
          'infinite-scroll',
           'ngMap',
            'doneServices',
           'doneComponentsSet'
    ])
})();  


function getBaseURL() {
	   return location.protocol + "//" + location.hostname + 
	      (location.port && ":" + location.port) ;
}; 
function getAppName(p) {
   return "/";
}
var _appUrl = "http://202.53.13.76:9192";//getBaseURL()+getAppName(window.location.pathname);