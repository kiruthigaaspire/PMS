'use strict';

angular.module('informacia.listOption', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  		$routeProvider.when('/listOption', {
    	templateUrl: './views/listOptions.html',
    	controller: 'ListOptionCtrl'
  		});
}])
.controller('ListOptionCtrl',function($scope,$http,$location) {
if(!localStorage.getItem('token') ){
document.write("INVALID ACCESS");
window.stop();
}
else
{
	$scope.userName = localStorage.getItem('userName');

$scope.logout = function()
{
	
localStorage.removeItem('token');
localStorage.removeItem('userName');
console.log("Log out Success");
$location.url('/home');

}
}


});