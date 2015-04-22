angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $location, $ionicLoading, Auth) {
	$scope.isGuest = Auth.isGuest();
	$scope.credentials = {
		username: '',
		password: ''
	}
	$scope.logout = function(){
		Auth.logout();
		$scope.isGuest = true;
		$location.path(Auth.loginPath);
	}
	$scope.login = function(credentials){
		$scope.error = '';
		$ionicLoading.show({
			template: 'Загрузка...'
		});
		Auth.login(credentials)
			.then(function(data){
				if (data.token){
					Auth.identify(data.token).then(function(){
						$location.path(Auth.homePath);
						$ionicLoading.hide();
						$scope.isGuest = false;
					});
				}
				else {
					$scope.error = 'Вы ввели не правильные данные.';
					$ionicLoading.hide();
				}
			});
	}
})

.controller('DashCtrl', function($scope, $ionicUser) {
	$scope.user = $ionicUser.get();
})

.controller('DataCtrl', function($scope, $ionicUser) {
	$scope.user = $ionicUser.get();
	$scope.gasvolume = parseFloat($scope.user.gasvolume) || 0;
	$scope.gasvelocity = parseFloat($scope.user.gasvelocity) || 0;
})

.controller('AccountCtrl', function($scope, $ionicUser) {
	$scope.user = $ionicUser.get();
})

.controller('NewsCtrl', function($scope, $rootScope, persistentStorage) {
	$scope.items = persistentStorage.retrieveObject('news') || [];
	$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
		$scope.items.push({
			text: notification.alert,
			date: new Date()
		});
		persistentStorage.storeObject('news', $scope.items);
    });
})

;
