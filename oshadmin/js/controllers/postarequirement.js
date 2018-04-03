angular.module('newapp')
  .controller('postaRequirementCtrl', function ($scope, $http, $location, resturl) {
	$http.get(resturl+"/getPostRequirements/?pageNumber=1&pageSize=10").then(function(resp){
		console.log(resp);
		$scope.postRequirementGrid.data = resp.data.responseData;
		$scope.postRequireCount = resp.data.paginationData.totalCount;
	});
	$scope.postRequirePaging=function(page, pageSize, total){	
	$http.get(resturl+"/getPostRequirements/?pageNumber="+page+"&pageSize=10").then(function(resp){
		console.log(resp);
		$scope.postRequirementGrid.data = resp.data.responseData;
		$scope.postRequireCount = resp.data.paginationData.totalCount;
	});	
	}
	$scope.postRequirementGrid = {};
  $scope.postRequirementGrid.columnDefs = [
    { name: 'customerName'},
    { name: 'customerId'},
	{ name: 'postRequirementId'},
	{ name: 'dateAndTime', displayName: 'Date & Time', type: 'date', cellFilter: 'date:"dd-MM-yyyy - HH:mm:ss"'},
	{name: 'Actions',width: 110,enableSorting:false,enableFiltering:false,
	 cellTemplate: '<div class="text-center ui-grid-cell-contents"><button class="btn btn-primary"  ng-click="grid.appScope.detailRequirement(row)">Details</button></div>'
	}];
	 $scope.detailRequirement = function(row) {
		 $scope.requirementDetails ={
			 customerName:row.entity.customerName,
			 customerId:row.entity.customerId,
			 postRequirementId:row.entity.postRequirementId,
			query:row.entity.query
		};
		 $('#postRequirementModal').modal('show');
	 };
	$scope.postReqRespond = function(requirementDetails){
		$('#postRequirementModal').modal('hide');
		var reqObj ={
			postRequirementId : requirementDetails.postRequirementId,
			responseMessage : requirementDetails.responseMessage
		};
		console.log(reqObj);
		$http.post(resturl+"/postrequirement", reqObj).then(function(resp){
			console.log(resp);
			if(resp.status != null){
				$scope.success = resp.data.successMessage;
				$('#SuccessModal').modal('show');
			}
			else{	
				$scope.failure = resp.data.errorMessage;
				$('#ErrdealModal').modal('show');
			}
		});
	};
});