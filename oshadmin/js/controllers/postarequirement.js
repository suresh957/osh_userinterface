angular.module('newapp')
  .controller('postaRequirementCtrl', function ($scope, $http, $location, resturl, $window, $timeout) {
	$window.scrollTo(0, 0);
	$scope.options = [
		{ name: 'Open Requirements', status: 'N' },
		{ name: 'Closed Requirements', status: 'Y' },
		{ name: 'All Requirements', status: 'ALL' }
	];
	
	$scope.custRequireSearch = [
		{ type: 'Customer Name', value: 'USER_NAME' },	
		{ type: 'Customer Id', value: 'USER_ID' }	
	]
	$("#startDate, #endDate").datepicker({
		autoclose: true,
		format: "yyyy-mm-dd",
		endDate: "today"
	});
	$scope.getRequirements = function(status, requirementDates){
		$window.scrollTo(0, 0);
		if(requirementDates.startDate > requirementDates.endDate){
			$scope.failure = "'From date' should be less than 'To date'";
			$('#ErrdealModal').modal('show');
		}
		else{
			var request = {
				startDate : requirementDates.startDate,
				endDate : requirementDates.endDate,
				status : status
			};
			console.log(request);
			$http.post(resturl+"/getPostRequirementsByDate", request).then(function(resp){
				console.log(resp);
				$scope.postRequirementGrid.data = resp.data.responseData;
				$scope.postRequireCount = resp.data.paginationData.totalCount;
			});
		}
	};
	
	$scope.postRequirePaging = function(page, pageSize, total, status, requirementDates){	
		$window.scrollTo(0, 0);
		var request = {
			startDate : requirementDates.startDate,
			endDate : requirementDates.endDate,
			status : status
		}
		$http.post(resturl+"/getPostRequirementsByDate/?pageNumber="+page+"&pageSize=10", request).then(function(resp){
			console.log(resp);
			$scope.postRequirementGrid.data = resp.data.responseData;
			$scope.postRequireCount = resp.data.paginationData.totalCount;
		});	
	}
	
	// Requirement Raised Customer Search Method Starts //
	$scope.getCustomerBySearch = function(customerType){
		if(customerType.type == 'Customer Name'){
			var string = customerType.name;
		}
		else{
			var string = customerType.id;
		}
		var request = {
			searchBy : customerType.value,
			searchString : string
		};
		console.log(request);
		$http.post(resturl+"/searchPostRequirements?pageNumber=1&pageSize=10", request).then(function(resp){
			console.log(resp);
			if(resp.data.responseData.length > 0){
				$scope.noResults = false;
				$scope.postRequirementGrid.data = resp.data.responseData;
				$scope.postRequireCount = resp.data.paginationData.totalCount;
			}
			else{
				$scope.noResults = true;
				$scope.message = string;
				$scope.postRequirementGrid.data = [];
				$scope.postRequireCount = 0;
				$timeout(function() {
					$scope.noResults = false;
					$scope.customerType.name = '';
					$scope.customerType.id = '';
				}, 3000);
			}
		});
	}
	// Requirement Raised Customer Search Method Ends //
	
	$scope.postRequirementGrid = {};
	$scope.postRequirementGrid.columnDefs = [
		{ name: 'customerName'},
		{ name: 'customerId'},
		{ name: 'postRequirementId'},
		{ name: 'dateAndTime', displayName: 'Date & Time', type: 'date', cellFilter: 'date:"dd-MM-yyyy - HH:mm:ss"'},
		{name: 'Actions',width: 110,enableSorting:false,enableFiltering:false,
			cellTemplate: '<div class="text-center ui-grid-cell-contents"><button class="btn btn-primary"  ng-click="grid.appScope.detailRequirement(row)">Details</button></div>'
		}
	];
	
	$scope.detailRequirement = function(row) {
		$scope.requirementDetails ={
			customerName:row.entity.customerName,
			customerId:row.entity.customerId,
			postRequirementId:row.entity.postRequirementId,
			query:row.entity.query
		};
		$('#postRequirementModal').modal('show');
	};
	
	$scope.postReqRespond = function(requirementDetails, status, requirementDates){
		$window.scrollTo(0, 0);
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
		var request = {
			startDate : requirementDates.startDate,
			endDate : requirementDates.endDate,
			status : status
		};
		
		$http.post(resturl+"/getPostRequirementsByDate/?pageNumber=1&pageSize=10", request).then(function(resp){
			console.log(resp);
			$scope.postRequirementGrid.data = resp.data.responseData;
			$scope.postRequireCount = resp.data.paginationData.totalCount;
		});
		
	};
});