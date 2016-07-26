/*var myModule = angular.module('myModule', []);
myModule.factory('serviceId', function() {
  var shinyNewServiceInstance;
  // factory function body that constructs shinyNewServiceInstance
  return shinyNewServiceInstance;
});

*/

angular.module('informacia.logoutService', ['ngRoute']).
factory('logout',function($location){

function logout(){

localStorage.removeItem('token');
console.log("Log out Success");
$location.url('/home');

}


});