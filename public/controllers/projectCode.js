'use strict';

angular.module('informacia.projectCode', ['ngRoute','ngFileUpload'])
.controller('ProjectCodeCtrl',function($scope,$http,$routeParams,$location,Upload) {
$('#dataTable').hide();
/*Default Declaration*/
$scope.tempFileStructure = [];
$scope.fileStructure = [];
$scope.loaderImg = true;
$scope.dataTable = false;
$scope.folderName = "";
$scope.curDir = $routeParams.gitRepo+"/";
$scope.projectName = $routeParams.gitRepo;


$http.get('/myapi/projectCode/'+$routeParams.gitRepo)
	.success(function(response){
		$('#mydiv').hide();
		$('#dataTable').show();
		if(response.success){
		console.log(response.fileStructure);
		$scope.tempFileStructure = response.fileStructure;
		$scope.modifyDate();
		}
		else
		{
		alert("Some Error Occured");
		}
	})
$scope.modifyDate = function(){
	var fsArray = $scope.tempFileStructure;
		for( var i = 0;i<fsArray.length;i++) {
			var dd = new Date(fsArray[i].time);
			$scope.tempFileStructure[i].time = dd.toDateString();
			}
		$scope.fileStructure = $scope.tempFileStructure;
}
$scope.getFiles = function(address,name){
	$scope.curDir += name+"/";

	var data = {address:address};
		$http.post('/myapi/download/',data)
		.success(function(response){
			 $('#mydiv').hide();
			if(response.success){
				console.log(response.fileStructure);
			$scope.tempFileStructure = response.fileStructure;
			$scope.modifyDate();
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
				$scope.tempFileStructure = response.fileStructure;
				$scope.modifyDate();
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
$scope.uploadFile = function(){
	//function to call on form submit
    console.log("submit cllaedd")
        if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
       	    $scope.upload($scope.file); //call upload function
            }
}
$scope.upload = function (file) {
       		var uploadPath = $scope.curDir;
            Upload.upload({
                url: '/myapi/upload', //webAPI exposed to upload the file
                data:{file:file,uploadPath:uploadPath} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    console.log('Success ' + resp.config.data.file.name + 'uploaded');
                } else {
                   alert('an error occured'+JSON.stringify(resp.data));
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.myStyle={'width':progressPercentage+"%"};
                $scope.a = 1;
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };


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