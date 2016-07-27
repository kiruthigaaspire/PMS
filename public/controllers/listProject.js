'use strict';

angular.module('informacia.listProject', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  		$routeProvider.when('/listProject', {
    	templateUrl: './views/listProject.html',
    	controller: 'ListProjectCtrl'
  		});
}])
.controller('ListProjectCtrl',function($scope,$http,$location) {
if(!localStorage.getItem('token') ){
document.write("INVALID ACCESS")
window.stop();
}
else
{
//...Default Declaration...//
$scope.projectList = [];
$scope.userName = localStorage.getItem('userName');
$scope.loginButtonShow =false;

$scope.logout = function()
{
	
localStorage.removeItem('token');
localStorage.removeItem('userName');
console.log("Log out Success");
$location.url('/home');

}


$http.get('/myapi/projects')
.success(function(response){
	if(response.success)
	{
		$scope.projectList = response.user;
		
	}
	else
	{
		alert("Error"+err);
	}
})
.error(function(response){
	alert("Cannot complete request");
})
//...function for redirecting it to the view page...//
$scope.redirectToViewDetails = function(aspireProjectName){

$location.url('viewProject/'+aspireProjectName);

};
}
//...end of controller...//
});