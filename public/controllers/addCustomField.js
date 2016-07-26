'use strict';

angular.module('informacia.addCustomField', ['ngRoute'])

.controller('AddCustomFieldCtrl',function($scope,$http,$routeParams,$location) {

$scope.val =false;
$scope.fieldType = "text";
$scope.radioIsSelected = false;
$scope.radioNotSelected = true;
$scope.radioValues = [];
$scope.otherValues = [];
$scope.userName = localStorage.getItem('userName');


if(!localStorage.getItem('token')){

document.write("INVALID ACCESS");
window.stop();
}
	else{
$scope.logout = function()
{
	
localStorage.removeItem('token');
console.log("Log out Success");
$location.url('/home');

}

$scope.getTypeValue = function(){
		
		if($scope.fieldType == "radio"){
				$scope.radioIsSelected = true;
			$scope.radioNotSelected = false;
		}

		else if($scope.fieldType == "checkbox")
				{
				$scope.radioNotSelected = true;
				$scope.radioIsSelected = false;
			}
};

$scope.addRadioValue = function(){

		var fieldValue = $scope.radioFieldValue;
		$scope.radioValues.push({'value':fieldValue});
		$scope.radioFieldValue = "";

};

//..function for removing the memeber from the list..//
$scope.removeRadioValue = function(fieldValue){
		var index = -1;		
		var valueArray = $scope.radioValues;
		for( var i = 0; i < valueArray.length; i++ ) {
			if( valueArray[i].value === fieldValue ) {
				index = i;
				break;
			}
		}
		if( index === -1 ) {
			alert( "Something gone wrong" );
		}
		$scope.radioValues.splice( index, 1 );	

};

$scope.addCustomFieldToDatabase = function(){

	if($scope.radioIsSelected)
	{
		var fieldValue = $scope.radioValues;
	}
	else
	{	
		$scope.otherValues.push({'value':$scope.fieldValue});
		var fieldValue = $scope.otherValues;
	}
	if($scope.fieldType != "text"){
				var data = [{

		aspireProjectName : $routeParams.aspireProjectName,
		fieldType : $scope.fieldType,
		fieldName : $scope.fieldName,
		fieldTitle : $scope.fieldTitle,
		fieldValue  :fieldValue,
		isOption : true

	}];
	}
	else
	{
				var data = [{

		aspireProjectName : $routeParams.aspireProjectName,
		fieldType : $scope.fieldType,
		fieldName : $scope.fieldName,
		fieldTitle : $scope.fieldTitle,
		fieldValue  :fieldValue
	}];



	}
	$http.post('/myapi/addCustomField',data)
	.success(function(response){
				if(response.success){
					alert("Field Added Successfully")
				}
				else
				{
					
				}
		})
	.error(function(response){
		})
};

}




//...End of the Controller....//
});