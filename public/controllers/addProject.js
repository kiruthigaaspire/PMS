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


		var githubData = 	{
  		name:$scope.aspireProjectName,
  		description: "This is your first repository",
  		private: false,
 		has_issues: true,
  		has_wiki: true,
  		has_downloads: true
		};
		var config = {
			headers:  {
			      'Authorization':'token aa46cce03432c2a80d64cf83be59f2e6d114a48e',
			      'Accept': 'application/json;odata=verbose',
			    }  
		};
		//request for adding a repo to the account....
		$http.post('https://api.github.com/user/repos',githubData,config)
		.success(function(response){
			if(response.id != null)
			{
					console.log(response.ssh_url);
					var data = {
							aspireProjectName : $scope.aspireProjectName,
							projectName : $scope.projectName,
							projectManagers : $scope.projectManagerList,
							gitRepo : response.ssh_url
							};
		    		$http.post('myapi/projects',data)
		    		.success(function(response){
		    			console.log("Success: "+response.Location);
		    			if(response.success)
		    			{
		    				alert(response.message);
		    			}
		    			else
		    			{
		    				alert(response.message);
		    			}
		    		})
		    		.error(function(response){
		    			console.log("Error: "+response);
		    		})

    		//end of if statement
			}
			else
			{
				console.log("my error"+JSON.stringify(response) );
			}
		})
		.error(function(response){
			console.log(response);
		})

		//alert(aspireProjectName+"    "+projectName +"  "+JSON.stringify(projectManagers));

};



}




//...end of controller...//
});