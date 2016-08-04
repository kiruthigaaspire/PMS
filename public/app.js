'use strict';

// Declare app level module which depends on views, and components
angular.module('informacia', [
  'ngRoute',
  'informacia.home',
  'informacia.addProject',
  'informacia.editProject',
  'informacia.listProject',
  'informacia.viewProject',
  'informacia.addCustomField',
  'informacia.listOption',
  'informacia.fileUpload',
  'informacia.projectCode',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {




    $routeProvider.otherwise({redirectTo: '/home'});
	$routeProvider.when('/home', {
    	templateUrl: './views/home.html',
    	controller: 'HomeCtrl'
  		});
    $routeProvider.when('/viewProject/:aspireProjectName', {
    	templateUrl: './views/viewProject.html',
    	controller: 'ViewProjectCtrl'
  		});
    $routeProvider.when('/addProject', {
    	templateUrl: './views/addProject.html',
    	controller: 'AddProjectCtrl'
  		});
    $routeProvider.when('/editProject/:aspireProjectName', {
    	templateUrl: './views/editProject.html',
    	controller: 'EditProjectCtrl'
  		});
    $routeProvider.when('/addCustomField/:aspireProjectName', {
    	templateUrl: './views/addCustomField.html',
    	controller: 'AddCustomFieldCtrl'
  		});
    $routeProvider.when('/listOption/', {
      templateUrl: './views/listOptions.html',
      controller: 'ListOptionCtrl'
      });
    $routeProvider.when('/fileUpload/:path', {
      templateUrl: './views/fileUpload.html',
      controller: 'FileUploadCtrl'
      });
    $routeProvider.when('/projectCode/:gitRepo', {
      templateUrl: './views/projectCode.html',
      controller: 'ProjectCodeCtrl'
      });
}]);