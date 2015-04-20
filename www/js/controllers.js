angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $location, $ionicPush, Auth) {
	$scope.credentials = {
		username: '',
		password: ''
	}
	$scope.logout = function(){
		Auth.logout();
		$location.path(Auth.loginPath);
	}
	$scope.loading = false;
	$scope.login = function(credentials){
		$scope.error = '';
		$scope.loading = true;
		Auth.login(credentials, function(data){
			if (data.token){
				Auth.identify(data.token).then(function(){
					$location.path(Auth.homePath);
					$scope.loading = false;
				});
			}
			else {
				$scope.error = 'Вы ввели не правильные данные.';
			}
		});
	}
})

.controller('DashCtrl', function($scope, $ionicUser) {
	var user = $ionicUser.get();
	$scope.gasvolume = parseFloat(user.gasvolume) || 0;
	$scope.gasvelocity = parseFloat(user.gasvelocity) || 0;
})

.controller('GasCtrl', function($scope, $ionicUser) {
	$scope.user = $ionicUser.get();
})

.controller('AccountCtrl', function($scope, $ionicUser) {
	$scope.user = $ionicUser.get();
})

;
