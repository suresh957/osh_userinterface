angular.module('newapp')
  .controller('DetailservicesCtrl',['$scope', '$http', '$routeParams', '$location', 'resturl', function($scope, $http, $routeParams, $location, resturl) {
	$scope.typeOfSearch = [{
		name: "Category",
		value: "Category"
		},
		{
			name: "Brand",
			value: "Brand"
		},
		{
			name: "Product",
			value: "Product"
		}
	];
	if (localStorage.loggedInUser != undefined) {
		$scope.loggedInUser = localStorage.loggedInUser;
		$scope.loggedInUserName = localStorage.loggedInUserName;
		$scope.loggedInUserType = localStorage.loggedInUserType;
		$scope.loggedInuserId = localStorage.loggedInuserId;
		$scope.userlogged = true;
	}
	else {
		$scope.userlogged = false;
	}
	$scope.mouseOver = function(param) {
		$scope.set_bg = function() {
			$scope.bgimg = param.imageURL;
			return {
				"background-image": "url(/clients/onesevenhome/img/" + $scope.bgimg + ".jpg)"
			};
		};
	};
	$scope.serveshow = false;
	$scope.logout = function() {
		localStorage.clear();
		$location.path('/login');
	};
	$scope.myProfile = function() {
		$location.path('/myaccount');
	};
	
	$scope.id = $routeParams.serviceid;
	console.log($routeParams.serviceid);
	$scope.selectedtype = $routeParams.sid;
	$http.get(resturl + "/getAllCategories").then(function(resp) {
		console.log(resp);
		$scope.menuitem = resp.data.categoryData;
	});

	$http.get(resturl + "/services").then(function(resp) {
		console.log(resp);
		$scope.workers = resp.data.services;
		$("#" + $scope.selectedtype).prop('checked', true);
	});
	$http.get(resturl + "/services/" + $routeParams.sid + "/workers?pageNumber=1&pageSize=5").then(function(resp) {
		console.log(resp);
		$scope.servicedetails = resp.data.responseData;
		$scope.getStars = function(rating) {
			// Get the value
			var val = parseFloat(rating);
			// Turn value into number/100
			var size = val / 5 * 100;
			return size + '%';
		};
		$scope.totalCount = resp.data.paginationData.totalCount;
		// $("#"+$scope.selectedtype).prop('checked', true);
		$(".todaydeal-sorting label:contains(" + $scope.selectedtype + ")").prev().prop('checked', true);
	});
	$scope.page = 1;
	$scope.detailsPagingAct = function(page, pageSize, total) {
		$http.get(resturl + "/services/" + $routeParams.sid + "/workers?pageNumber=" + page + "&pageSize=5").then(function(resp) {
			console.log(resp);
			$scope.servicedetails = resp.data.responseData;
			$scope.totalCount = resp.data.paginationData.totalCount;
			// $("#"+$scope.selectedtype).prop('checked', true);
		});
	};
	$http.get(resturl + "/getRecommendedProduct").then(function(resp) {
		console.log(resp);
		$scope.recommend = resp.data.recommendedProducts;
		$scope.RecomendLoaded = true;
		$scope.slickrecommendedprocutsConfig = {
			dots: false,
			arrows: false,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1
		};
	});
	$http.get(resturl+"/cart/displayCart?userId="+localStorage.loggedInuserId).then(function(resp) {
		console.log(resp);
		$scope.cartlist = resp.data;
		console.log($scope.cartlist);
		if(resp.data.shoppingCartItems == null){
			$scope.lengthofcart = 0;
		}
		else {
			$scope.lengthofcart = resp.data.shoppingCartItems.length;
		}
	});

	//Start --For Single Selection For Service Type In Service Screen
	$scope.updateSelection = function(position, workers, workertype, workerid, checkval) {
		if ($scope.selectedtype == workertype) {
			$("#" + $scope.selectedtype).prop('checked', true);
		}
		else {
			$location.path('/detailservices/' + workertype + '/' + workerid);
		}
	};
	//End --For Single Selection For Service Type In Service Screen
	/* Save Review & Rating For Service Providers */
	$scope.onItemRating = function(rating, detailsevice, id) {
		console.log(rating);
		console.log(detailsevice);
		var reqObj = {
			"customerId": $scope.loggedInuserId,
			"serviceId": detailsevice.id,
			"serviceTypeId": $routeParams.serviceid,
			"rating": rating,
			"reviewTitle": "",
			"reviewDescription": ""
		};
		console.log(reqObj);
		$http.post(resturl + "/servicerating/save", reqObj).then(function(resp) {
			console.log(resp);
			$http.get(resturl + "/services/" + $routeParams.sid + "/workers?pageNumber=1&pageSize=5").then(function(resp) {
				console.log(resp);
				$scope.servicedetails = resp.data.responseData;
				$scope.getStars = function(rating) {
					// Get the value
					var val = parseFloat(rating);
					// Turn value into number/100
					var size = val / 5 * 100;
						return size + '%';
				};
				$scope.totalCount = resp.data.paginationData.totalCount;
				// $("#"+$scope.selectedtype).prop('checked', true);
				$(".todaydeal-sorting label:contains(" + $scope.selectedtype + ")").prev().prop('checked', true);
			});
		});
	};
	$scope.mechpopup = function(detailsevice) {
		$scope.vendorName = detailsevice.companyName;
		$scope.customerName = $scope.loggedInUserName;
		$scope.id = detailsevice.id;
		$("#appointmentDate").datepicker({
			autoclose: true,
			format: "yyyy-mm-dd"
		});
		$('.bookNowPopup').modal('show');
	};
	$scope.ratebook = function(detailsevice) {
		console.log(detailsevice);
		$scope.ratingpopup = {
			rateid: detailsevice.id,
			ratingcumponey: detailsevice.companyName,
		};
	};
	
	/* Save Review & Rating For Service Providers */
	$scope.onItemRating = function(rating, detailsevice, id) {
		$scope.starValue = rating;
		console.log($scope.starValue);
		console.log(detailsevice);
	
	
		var reqObj = {
			"customerId": $scope.loggedInuserId,
			"serviceId": detailsevice.id,
			"serviceTypeId": $routeParams.serviceid,
			"rating": $scope.starValue,
			"reviewDescription": "",
			"reviewTitle": ""
		};
		console.log(reqObj);
		$http.post(resturl + "/servicerating/save", reqObj).then(function(resp) {
			console.log(resp);
			rating = $scope.starValue;
			rating = "0";
			if (resp.data.status == true) {
				$scope.success = resp.data.successMessage;
				$('.successPopup').modal('show');
			} else {
				$scope.failure = resp.data.errorMessage;
				$('.errorPopup').modal('show');
			}
			$http.get(resturl + "/services/" + $routeParams.sid + "/workers?pageNumber=1&pageSize=5").then(function(resp) {
				console.log(resp);
				$scope.servicedetails = resp.data.responseData;
				$scope.getStars = function(rating) {
					// Get the value
					var val = parseFloat(rating);
					// Turn value into number/100
					var size = val / 5 * 100;
					return size + '%';
				};
				$scope.totalCount = resp.data.paginationData.totalCount;
				// $("#"+$scope.selectedtype).prop('checked', true);
				$(".todaydeal-sorting label:contains(" + $scope.selectedtype + ")").prev().prop('checked', true);
			});
		});
	};
	// Search A Service Provider By Location //
	$scope.searchVendor = function(searchStr) {
		console.log(searchStr);
		var searchRequest = {
			searchString: searchStr,
			customerType: $scope.selectedtype
		};
		$scope.searchStr = "";
		console.log(searchRequest);
		$http.post(resturl + "/getServiceProvidersByLocation", searchRequest).then(function(resp) {
			console.log(resp);
			if(resp.data.paginationData == null){
				$scope.totalCount = 0;
				$scope.servicedetails = "";
			}
			$scope.servicedetails = resp.data.responseData;
			if(resp.data.responseData == null) {
				$scope.errorMsg = resp.data.errorMsg;
				$scope.serveshow = true;
			}
			else{
				$scope.serveshow = false;
			}
			$scope.totalCount = resp.data.paginationData.totalCount;
		});
	};
	// Top Rated vendors Service //
	$scope.constitutionchange = function(param) {
		console.log(param);
		$scope.serveshow=false;
		if (param == "TopRated") {
			$scope.totalCount = 0;
			$http.get(resturl + "/services/" + $routeParams.sid + "/workers/toprated?pageNumber=1&pageSize=5").then(function(resp) {
				console.log(resp);
				$scope.servicedetails = resp.data.responseData;
				$scope.totalCount = resp.data.paginationData.totalCount;
			});
			$scope.page = 1;
			$scope.detailsPagingAct = function(page, pageSize, total) {
				$http.get(resturl+"/services/"+$routeParams.sid +"/workers/toprated?pageNumber="+page+"&pageSize=5").then(function(resp) {
					console.log(resp);
					$scope.servicedetails = resp.data.responseData;
					$scope.totalCount = resp.data.paginationData.totalCount;
					// $("#"+$scope.selectedtype).prop('checked', true);
				});
			};
		}
	};
	// Get Logged In User //
	$http.get(resturl+"/getUser/"+localStorage.loggedInuserId).then(function(resp){
		console.log(resp);
		if(localStorage.loggedInUserType == "CUSTOMER"){
			$scope.loggedInUserPincode = resp.data.customerDetails.billing.postalCode;
		}
		else if(localStorage.loggedInUserType == "SERVICE"){
			$scope.loggedInUserPincode = resp.data.serviceDetails.pinCode;
		}
		else{
			$scope.loggedInUserPincode = resp.data.vendorDetails.pinCode;
		}
	});
	
	// Get Service Providers Method By Distance //
	$scope.getProvidersByDistance = function(distance){
		console.log(distance, $routeParams.sid);
		console.log($scope.loggedInUserPincode);
		if(distance != ''){
			var distArray = distance.split('-');
			console.log(distArray);
			$http.get(resturl+'/services/'+$routeParams.sid+'/'+$scope.loggedInUserPincode+'/'+distArray[0]+'/'+distArray[1]+"?pageNumber=1&pageSize=5").then(function(resp){
				console.log(resp);
				if(resp.data.responseData != null){
					$scope.serveshow = false;
					$scope.servicedetails = resp.data.responseData;
					$scope.getStars = function(rating) {
						// Get the value
						var val = parseFloat(rating);
						// Turn value into number/100
						var size = val / 5 * 100;
						return size + '%';
					};
					$scope.totalCount = resp.data.paginationData.totalCount;
					$(".todaydeal-sorting label:contains("+$scope.selectedtype+")").prev().prop('checked', true);
				}
				else{
					$scope.serveshow = true;
					$scope.servicedetails = '';
					$scope.totalCount = 0;
					$scope.errorMsg = 'No Service Providers are available over selected Range of Distance';
				}
			});
		}
	};
	
	
	$scope.detailsPagingAct = function(page, pageSize, total, distance){
		console.log(page, pageSize, total, distance);
		if(distance != ''){
			var distArray = distance.split('-');
			console.log(distArray);
			$http.get(resturl+'/services/'+$routeParams.sid+'/'+$scope.loggedInUserPincode+'/'+distArray[0]+'/'+distArray[1]+'?pageNumber='+page+'&pageSize=5').then(function(resp){
				console.log(resp);
				$scope.servicedetails = resp.data.responseData;
				$scope.getStars = function(rating) {
					// Get the value
					var val = parseFloat(rating);
					// Turn value into number/100
					var size = val / 5 * 100;
					return size + '%';
				};
				$scope.totalCount = resp.data.paginationData.totalCount;
			});
		}
	};
	
	// Page Navigation To Top Functionality //
	jQuery(window).scroll(function() {
		if (jQuery(this).scrollTop() >= 50) { // If page is scrolled more than 50px
			jQuery('#return-to-top').fadeIn(200); // Fade in the arrow
		} else {
			jQuery('#return-to-top').fadeOut(200); // Else fade out the arrow
		}
	});
	jQuery('#return-to-top').click(function() { // When arrow is clicked
		jQuery('body,html').animate({
			scrollTop: 0 // Scroll to top of body
		}, 500);
	});
}]);
angular.module('newapp')
  .directive('starRating', function(){
	return {
		restrict: 'A',
		template: '<i class="fa fa-star" ng-repeat="star in stars" ng-class="star" aria-hidden="true"></i>',
		scope: {
			ratingValue: '=',
			max: '=',
			onRatingSelected: '&'
		},
		link: function(scope, elem, attrs) {
			var updateStars = function() {
				scope.stars = [];
				for (var i = 0; i < scope.max; i++) {
					scope.stars.push({
						disabled: i > scope.ratingValue
					});
					if(i == scope.ratingValue){
						scope.stars[i].disabled = true;
					}
				}
			};
			scope.toggle = function(index) {
				scope.ratingValue = index + 1;
				scope.onRatingSelected({
					rating: index + 1
				});
			};
			scope.$watch('ratingValue', function(oldVal, newVal) {
				if (!isNaN(newVal)) {
					updateStars();
				}
			});
		}
	};
});