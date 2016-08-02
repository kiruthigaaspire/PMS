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

//94c82d4cdaa9b36ecc7952d1df4a8208ea587008 github toekn
//...function for adding the project to the Database....//
$scope.addProjectToDatabase = function(){
		var data = {
		aspireProjectName : $scope.aspireProjectName,
		projectName : $scope.projectName,
		projectManagers : $scope.projectManagerList
		};

	var githubData = 	{
  name:$scope.aspireProjectName,
  description: "This is your first repository",
  private: false,
  has_issues: true,
  has_wiki: true,
  has_downloads: true
}
		
		$http.post('/myapi/projects',data)
		.success(function(response){
			if(response.success)
			{
				var config = {

			        headers:  {
			      'Authorization':'token 94c82d4cdaa9b36ecc7952d1df4a8208ea587008',
			      'Accept': 'application/json;odata=verbose',
			    }  };

    		$http.post('https://api.github.com/user/repos',githubData,config)
    		.success(function(response){
    			console.log("Success: "+response.Location);
    			if(response.Status == "204")
    			{
    				$http.post
    			}
    		})
    		.error(function(response){
    			console.log("Error: "+response);
    		})
    		//end of if statement
			}
			else
			{
				console.log("Some problem in backend");
			}
		})
		.error(function(response){

		})

		//alert(aspireProjectName+"    "+projectName +"  "+JSON.stringify(projectManagers));

};



}




//...end of controller...//
});