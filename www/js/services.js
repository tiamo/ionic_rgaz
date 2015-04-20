angular.module('starter.services', [])

.factory('Auth', function($q, $http, $location, $ionicUser, $ionicPush, $timeout, $window) {
	
	var authService = {
		baseUrl: 'http://cl.rgaz.su/api',
		homePath: '/dash',
		loginPath: '/login',
		token: localStorage.getItem('token')
	}
	
	// login
	authService.login = function(credentials) {
		var deferred = $q.defer();
		$http.post(this.baseUrl+'/auth',{
			identity: credentials.username,
			credential: credentials.password
		})
		.success(function(data) {
			authService.setToken(data.token);
			deferred.resolve(data);
		})
        .error(function() {
			deferred.reject('error');
        });
		return deferred.promise;
	}
	
	// logout
	authService.logout = function() {
		localStorage.clear();
		this.token = null;
	}
	
	// set new auth token
	authService.setToken = function(token) {
		if (!token) {
			return;
		}
		localStorage.setItem('token', token);
		this.token = token;
	}
	
	// identify user
	authService.identify = function(token) {
		if (!token) {
			return;
		}
		return $http.get(this.baseUrl+'/user?access_token='+token)
		.success(function(data) {
			$ionicPush.register({
				// canShowAlert: false,
				onTokenRecieved: function(token) {
					// console.log('token recived: ' + token);
				},
				onNotification: function(notification) {
					// console.log('notification: ' + JSON.stringify(notification));
					// authService.push.lastNotification = JSON.stringify(notification);
				}
			}, data).then(function(deviceToken) {
				$ionicUser.set('deviceToken', deviceToken);
			});
		});
	}
	
	// check authorization
	authService.check = function() {
		if ($location.path()===this.loginPath) {
			if (this.token) {
				$location.path(this.homePath);
			}
		}
		else {
			if (!this.token) {
				$location.path(this.loginPath);
			}
		}
	}
	
	authService.identify(authService.token, authService.check);
	
	return authService;
})

;
