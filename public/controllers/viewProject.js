'use strict';

angular.module('informacia.viewProject', ['ngRoute'])

.controller('ViewProjectCtrl',function($scope,$http,$routeParams,$location) {
if(!localStorage.getItem('token') ){

	//document.write("Invalid Access");
	document.body.innerHTML = "<h2 id='accessErrorDiv' style='color:red'><i>Invaid Access</i></h2>";
	window.stop();
}
else {
$scope.projectDetail="";
$scope.projectManagerList = [];
$scope.teamMemberList = [];
$scope.customField = [];
$scope.userName = localStorage.getItem('userName');
var gitRepo;

$http.get('/myapi/projects/'+$routeParams.aspireProjectName)
.success(function(response){
	if(response.success)
	{
		$scope.projectDetail = response.user;
		var startDate = new Date(response.user.startDate);
		var endDate  =new Date(response.user.endDate);
		$scope.customStartDate =  $scope.changeDate(startDate);
		$scope.customEndDate = $scope.changeDate(endDate);
		$scope.customField = response.user.customField;
		gitRepo = response.user.gitRepo;
		
	}
	else
	{
		alert("Error"+err);
	}
})
.error(function(response){
	alert("Cannot complete request");
})

$scope.changeDate = function(inputDate){
	var date = inputDate.getDate();
	var month = inputDate.getMonth() + 1;
	var year = inputDate.getFullYear();

	var outputDate = date+"/"+month+"/"+year;
	return outputDate
}	
$scope.logout = function()
{
	
localStorage.removeItem('token');
localStorage.removeItem('userName');
console.log("Log out Success");
$location.url('/home');

}

$scope.redirectToEditProject = function(){

$location.url('editProject/'+$routeParams.aspireProjectName);

};
$scope.redirectToProjectCode = function(){
console.log(gitRepo);
$location.url('projectCode/'+$routeParams.aspireProjectName);

};

}
//...End of the Controller...//
});