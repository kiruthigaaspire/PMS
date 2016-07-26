'use strict';

angular.module('informacia.editProject', ['ngRoute'])

.controller('EditProjectCtrl',function($scope,$http,$routeParams,$location) {

var aspireProjectName = $routeParams.aspireProjectName;

//....Default Declarations...//
$scope.projectManagerList = [];
$scope.teamMemberList = [];
$scope.customField  = [];
$scope.customFieldDisplay = [];
$scope.userName = localStorage.getItem('userName');

if(!localStorage.getItem('token') ){
	document.write("Invalid Access");
	window.stop();
}
else{
	$scope.logout = function()
{
	
localStorage.removeItem('token');
console.log("Log out Success");
$location.url('/home');

}
$http.get('myapi/projects/'+aspireProjectName)
.success(function(response){
		if(response.success)
				{
					$scope.aspireProjectName = response.user.aspireProjectName;
					$scope.projectName = response.user.projectName;
					$scope.clientName = response.user.clientName;
					$scope.projectDescription = response.user.projectDescription;
					$scope.projectManagerList = response.user.projectManagers; 
					$scope.teamMemberList = response.user.teamMembers;
					$scope.customField = response.user.customField;
					$scope.projectOwner = response.user.projectOwner;
					$scope.accountManager = response.user.accountManager;
					$scope.startDate = new Date(response.user.startDate);
					$scope.endDate = new Date(response.user.endDate);
				}

})	
.error(function(response){
	alert(response.message);
})

//....function for adding a PM member from the list
$scope.addProjectManager = function(){

		var projectName = $scope.projectManager ;
		$scope.projectManagerList.push({'pmName':projectName,'pmId':projectName});
		$scope.projectManager = "";

};

//..function for removing the manager from the list..//
$scope.removeProjectManager = function(pmId){
		
		var index = -1;		
		var pmArray = $scope.projectManagerList;
		for( var i = 0; i < pmArray.length; i++ ) {
			if( pmArray[i].pmId === pmId ) {
				index = i;
				break;
			}
		}
		if( index === -1 ) {
			alert( "Something gone wrong" );
		}
		$scope.projectManagerList.splice( index, 1 );	

};

//...function for adding a member to the list..//
$scope.addTeamMember = function(){

		var memberName = $scope.teamMember;
		$scope.teamMemberList.push({'memberName':memberName,'memberId':memberName});
		$scope.teamMember = "";

};

//..function for removing the memeber from the list..//
$scope.removeTeamMember = function(memberId){
		
		var index = -1;		
		var teamArray = $scope.teamMemberList;
		for( var i = 0; i < teamArray.length; i++ ) {
			if( teamArray[i].memberId === memberId ) {
				index = i;
				break;
			}
		}
		if( index === -1 ) {
			alert( "Something gone wrong" );
		}
		$scope.teamMemberList.splice( index, 1 );	

};

//...Update the Project Details...//
$scope.updateProjectDetails = function(){

		var data = {
		aspireProjectName : $scope.aspireProjectName,
		projectName : $scope.projectName,
		clientName : $scope.clientName,
		projectDescription : $scope.projectDescription,
		projectManagers : $scope.projectManagerList,
		teamMembers : $scope.teamMemberList,
		projectOwner : $scope.projectOwner,
		accountManager : $scope.accountManager,
		startDate : $scope.startDate,
		endDate : $scope.endDate

		};

		$http.put('/myapi/projects',data)
		.success(function(response){
				if(response.success){
					alert("Project Details Updated successfully");
				}
				else
				{
					alert("Error Occured"+response.message);
				}


		})
		.error(function(response){

		})

};

$scope.redirectToAddCustomField = function(){


$location.url('/addCustomField/'+$scope.aspireProjectName);


};

}


	//...end of controller...//
});