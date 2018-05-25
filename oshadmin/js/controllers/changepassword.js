angular.module('newapp')
 .controller('changePassCtrl', function ($scope, $http, $location, $routeParams, resturl) {
	$http.get(resturl+"/admin/list").then(function(resp){
		console.log(resp);
		$scope.admin = resp.data.adminList;
		console.log($scope.admin);
		$scope.adminName = resp.data.adminList['0'].adminName;
		$scope.emailAddress = resp.data.adminList['0'].email;
		console.log($scope.adminName);
	});
	$scope.logout = function () {
		localStorage.clear();
		$location.path('/adminlogin');
	}
	$scope.alerthide=function(){
		$scope.errmsg=false;
	}
	
	$scope.isDisabled = false;
	$scope.changePswd = function(setNewPswd) {
		$scope.isDisabled = true;
		delete setNewPswd.conformPassword;
		setNewPswd.emailAddress = $scope.emailAddress;
		console.log(setNewPswd);
		$http.post(resturl+"/admin/updatepassword", setNewPswd).then(function(resp){
			console.log(resp);
			$scope.isDisabled = false;
			if(resp.data.status == "true"){
				$scope.setNewPswd = {};
				$scope.changePassForm.$setUntouched();
				$scope.success = resp.data.successMessage;
				$('.successPopup').modal('show');
			}
			else {
				$scope.failure = resp.data.errorMessage;
				$('.failurePopup').modal('show');
			}
		});
	}
});