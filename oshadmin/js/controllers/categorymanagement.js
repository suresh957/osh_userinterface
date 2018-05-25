angular.module('newapp')
  .controller('catMgmtCtrl', function ($scope, $http, $location, resturl, $window) {
	$http.get(resturl + "/getAllCategories").then(function (resp) {
		console.log(resp);
		$scope.menuitem = resp.data.categoryData;
	});
	$scope.catchange = function () {
		console.log($scope.catvalue);
		var index = $scope.menuitem.findIndex(function (item, i) {
			return item.title === $scope.catvalue;
		});
		$scope.categorySub = $scope.menuitem[index].subCategory
	}

	$scope.files = [];
	$scope.$on("seletedFile", function (event, args) {
		$scope.$apply(function () {
			//add the file object to the scope's files collection
            if($scope.files.length == 0){
				$scope.files.push(args.file);
            }
			else{
				$scope.files.splice(0, 1);
				$scope.files.push(args.file);
            }
		});
	});

	
	// Default Listing Of All Sub-Categories Images //
    $http.get(resturl+"/getAllSubCatImages?pageNumber=1&pageSize=2").then(function (resp) {
		console.log(resp);
		$scope.page = 1;
		$scope.respData = resp.data.responseData;
		$scope.totalCount = resp.data.paginationData.totalCount;
	});
	
	// Pagination Method //
	$scope.subCategoryPaging = function(page, pageSize, total){
		$window.scrollTo(0,0);
		$scope.page = page;
		console.log(page, pageSize, total);
		$http.get(resturl+"/getAllSubCatImages?pageNumber="+page+"&pageSize=2").then(function (resp) {
			console.log(resp);
			$scope.respData = resp.data.responseData;
			$scope.totalCount = resp.data.paginationData.totalCount;
		});
	};
	
	// Create A Sub Category Image Method //
	$scope.createSubCategory = function () {
		var request = {
			categoryName : $scope.catvalue,
			subCategoryName : $scope.subCatValue
		};
		console.log(request);
		$http({
			method: 'POST',
			url: resturl + "/uploadOrUpdateSubCatImage",
			headers: {
				'Content-Type': undefined
			},
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("subCatImageRequest", JSON.stringify(request));
				if(data.file.length == 0){
					formData.append("file", new File([""], "emptyFile.jpg", {
						type: "impage/jpeg"
					}));
				}else{
					for (var i = 0; i < data.file.length; i++) {
						// formData.append("file", data.file);
                        formData.append("file", data.file[i]);
					}
				}
				return formData;
			},
			data: {
				fileInfo: request,
				file: $scope.files
			}
		})
		.success(function (resp, status, headers, config) {
			console.log(resp);
			console.log(resp.status);
			$scope.files = [];
			if (resp.status == "true") {
				$('.successPopup').modal('show');
				$scope.success = resp.successMessage;
				console.log($scope.success);
				$http.get(resturl+"/getAllSubCatImages?pageNumber="+$scope.page+"pageSize=2").then(function (resp) {
					console.log(resp);
					$scope.respData = resp.data.responseData;
					$scope.totalCount = resp.data.paginationData.totalCount;
				});
			}else{
				$('#ErrdealModal').modal('show');
				$scope.failure = resp.errorMessage;
			}
		});
	};

	$scope.getSubCatDetails = function (subCatData, catName) {
		$scope.subCatData = subCatData;
		$scope.key = catName;
	};
	
	// Delete Confirmation Popup //
	$scope.confirmDelete = function () {
		$('.getSubCatImgPopup').modal('hide');
		$('.confirmPopup').modal('show');
	};

	// Delete Popup //
	$scope.deleteSubCat = function (subCatData) {
		console.log(subCatData.subCategoryId);
		$http.get(resturl+"/deleteSubCatImage/"+subCatData.subCategoryId).then(function (resp) {
			console.log(resp);
			$scope.deleteResp = resp.data;
			$('.confirmPopup').modal('hide');
			if(resp.data.status == "true"){
				$('.successPopup').modal('show');
				$scope.success = resp.data.successMessage;
				console.log($scope.success);
				$http.get(resturl+"/getAllSubCatImages?pageNumber="+$scope.page+"pageSize=2").then(function (resp) {
					console.log(resp);
					$scope.respData = resp.data.responseData;
					$scope.totalCount = resp.data.paginationData.totalCount;
				});
			}
			else{
               $('#ErrdealModal').modal('show');
               $scope.failure = resp.data.errorMessage;
            }
         });
      };
   });

newapp.directive('categoryFiles', function () {
   return {
      require: 'ngModel',
      //create a new scope
      scope: true,
      link: function (scope, el, attrs, ngModel) {
         el.bind('change', function (event) {
            var files = event.target.files;
            //iterate files since 'multiple' may be specified on the element
            for (var i = 0; i < files.length; i++) {
               //emit event upward
               scope.$emit("seletedFile", {
                  file: files[i]
               });
            }
            scope.$apply(function () {
               console.log(el.val());
               ngModel.$setViewValue(el.val());
               ngModel.$render();
            })
         });
      }
   };
});