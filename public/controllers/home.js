'use strict';

angular.module('informacia.home', ['ngRoute'])

/*.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    controller: 'HomeCtrl'
  });
}])*/
.controller('HomeCtrl',function($scope,$http,$location,$routeParams) {

var aspireProjectName =  'aspire_003';       
$scope.showError = false;
$scope.loginShow = true;
console.log($scope.loginShow);


$scope.authenticate = function(){

if(1==1){
	console.log("auth called");
var data = {
	userName: $scope.userName,
	userPassword : $scope.userPassword,
};
$http.post('/myapi/authenticate',data)
.success(function(response){
	if(response.success)
		{
			var userNameTemp = $scope.userName.split('@');
			localStorage.setItem('token',response.token);
			localStorage.setItem('userName',userNameTemp[0]);
			$location.url('/listOption');
		}
		else
		{
			$scope.showError = true;
		}	

})
.error(function(response){
	console.log("The error is "+response);
})

}
else
{
$scope.showError = true;
}

};

});