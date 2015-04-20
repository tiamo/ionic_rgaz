angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $location, $ionicPush, $ionicLoading, Auth) {

	$scope.credentials = {
		username: '',
		password: ''
	}
	$scope.logout = function(){
		Auth.logout();
		$location.path(Auth.loginPath);
	}
	$scope.login = function(credentials){
		$scope.error = '';
		$ionicLoading.show({
			template: 'Загрузка...'
		});
		Auth.login(credentials).then(function(data){
			if (data.token){
				Auth.identify(data.token).then(function(){
					$location.path(Auth.homePath);
					$ionicLoading.hide();
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
	$scope.gasvolume = parseFloat($scope.user.gasvolume) || 0;
	$scope.gasvelocity = parseFloat($scope.user.gasvelocity) || 0;
})

.controller('GasCtrl', function($scope, $ionicUser) {
	$scope.user = $ionicUser.get();
})

.controller('AccountCtrl', function($scope, $ionicUser) {
	$scope.user = $ionicUser.get();
})

;
