'use strict';

angular.module('informacia.addProject', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  		$routeProvider.when('/addProject', {
    	templateUrl: './views/addProject.html',
    	controller: 'AddProjectCtrl'
  		});
}])
.controller('AddProjectCtrl',function($scope,$http) {
if(!localStorage.getItem('token') ){
	document.write("Invalid Access");
	window.stop();
}
else{

//...Default Declarations...//
$scope.projectManagerList = [];
$scope.userName = localStorage.getItem('userName');
$scope.logout = function()
{
	
localStorage.removeItem('token');
localStorage.removeItem('userName');
console.log("Log out Success");
$location.url('/home');

}
//..function for adding manager to a project...//
$scope.addProjectManager = function(){

		var projectName = $scope.projectManager ;
		$scope.projectManagerList.push({'pmName':projectName,'pmId':projectName});	
		$scope.projectManager = "";

};

//..function for removing the manager from th list..//
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


//...function for adding the project to the Database....//
$scope.addProjectToDatabase = function(){
		var data = {
		aspireProjectName : $scope.aspireProjectName,
		projectName : $scope.projectName,
		projectManagers : $scope.projectManagerList
		};
		
		$http.post('/myapi/projects',data)
		.success(function(response){
			if(response.success)
			{
				alert("Project Added SuccessFully");
			}
		})
		.error(function(response){

		})

		//alert(aspireProjectName+"    "+projectName +"  "+JSON.stringify(projectManagers));

};



}




//...end of controller...//
});