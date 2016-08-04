'use strict';

angular.module('informacia.projectCode', ['ngRoute'])
.controller('ProjectCodeCtrl',function($scope,$http,$routeParams,$location) {

/*Default Declaration*/
$scope.fileStructure = [];
$scope.loaderImg = true;
$scope.folderName = "";
$scope.curDir = $routeParams.gitRepo+"/";


		$http.get('/myapi/projectCode/'+$routeParams.gitRepo)
		.success(function(response){
			 $('#mydiv').hide();
			if(response.success){
				console.log(response.fileStructure);
			$scope.fileStructure = response.fileStructure;
			}
			else
			{
			 alert("Some Error Occured");
			}
		})

$scope.getFiles = function(address,name){
	$scope.curDir += name+"/";

	var data = {address:address};
		$http.post('/myapi/download/',data)
		.success(function(response){
			 $('#mydiv').hide();
			if(response.success){
				console.log(response.fileStructure);
			$scope.fileStructure = response.fileStructure;
			}
			else
			{
			 alert("Some Error Occured");
			}
			
		})
}
$scope.goBack = function(){

	var address = $scope.curDir;
	if(address != ($routeParams.gitRepo+"/")){
	var length = address.length;
	address = address.slice(0,length-1);
	var index = address.lastIndexOf("/");
	address = address.slice(0,index);
		$scope.curDir = address+"/";
	}
	else
	{
		address = $scope.curDir;
	}
	console.log($scope.curDir+"  <-curDir address->  "+address);
		var data = {address:"repo_clones/"+address};
		$http.post('/myapi/download/',data)
		.success(function(response){
			 $('#mydiv').hide();
			if(response.success){
				console.log(response.fileStructure);
			$scope.fileStructure = response.fileStructure;
			}
			else
			{
			 alert("Some Error Occured");
			}
			
		})
}
$scope.addFolder = function(){
$scope.loaderImg = true;
var add = $scope.curDir+$scope.folderName;
console.log(add);
		var data = {address:add,gitRepo:$routeParams.gitRepo};
		$http.post('/myapi/createFolder/',data)
		.success(function(response){
			 $('#mydiv').hide();
			if(response.success){
				console.log(response.fileStructure);
			$scope.fileStructure = response.fileStructure;
			}
			else
			{
			 alert("Some Error Occured");
			}
		})



};
$scope.redirectToupload = function(){
	var path  = $scope.curDir;
	$location.url('fileUpload/ameeya');


}




$scope.downloadFile = function(name,address){
	$scope.curDir +=name+"/";
	console.log("download called");
	var data = {
		'name':name,
		'address':address
	}
	$http.post('/myapi/download/',data)
	.success(function(response){
	console.log("we got"+response);
})
	.error(function(response)
	{
		console.log("Some error Occured"+response);
	})

};
//..End  of the ProjectCode Controller..//
});