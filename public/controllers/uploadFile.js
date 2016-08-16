'use strict';
/*
angular.module('informacia.fileUpload', ['ngRoute'])
.controller('FileUploadCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
            $scope.uploadFile = function(){
               var file = $scope.myFile;
               
               console.log('file is ' );
               console.dir(file);
               
               var uploadUrl = "/myapi/upload";
               fileUpload.uploadFileToUrl(file, uploadUrl);
            };
         }])
.service('fileUpload', ['$http', function ($http) {
            this.uploadFileToUrl = function(file, uploadUrl){
               var fd = new FormData();
               fd.append('file', file);
            
               $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            
               .success(function(response){
               	console.log(response)
               })
            
               .error(function(response){
               	console.log(response)
               });
            }
         }])
.directive('fileModel', ['$parse', function ($parse) {
            return {
               restrict: 'A',
               link: function(scope, element, attrs) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                     });
                  });
               }
            };
         }]);
            */


    angular.module('informacia.fileUpload', ['ngFileUpload','ngRoute'])
    .controller('FileUploadCtrl',['Upload','$window','$http','$scope','$routeParams',function(Upload,$window,$http,$scope,$routeParams){
        console.log($routeParams.path)
        var vm = this;
        vm.submit = function(){
         //function to call on form submit
        console.log("submit cllaedd")
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            }
        }
        vm.upload = function (file) {
            Upload.upload({
                url: '/myapi/upload', //webAPI exposed to upload the file
                path:
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    $window.alert('an error occured'+JSON.stringify(resp.data));
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.myStyle={'width':progressPercentage+"%"};
                $scope.a = 1;
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
           data:{file:file};
            $http.post('/myapi/upload',data)
            .success(function(response){
            	console.log("File Uploaded"+response)
            })
            .error(function(response){
            	console.log("Error"+response)
            })
        };
    }]);