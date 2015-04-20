angular.module('starter.services', [])

.factory('Auth', function($http, $location, $ionicUser) {
	
	var authService = {
		baseUrl: 'http://cl.rgaz.su/api',
		homePath: '/dash',
		loginPath: '/login',
		token: localStorage.getItem('token')
	}
	
	// login
	authService.login = function(credentials, successCallback) {
		return $http.post(this.baseUrl+'/auth',{
			identity: credentials.username,
			credential: credentials.password
		}).then(function(response) {
			authService.setToken(response.data.token);
			if (successCallback){
				successCallback(response.data);
			}
		});
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
		return $http.get(this.baseUrl+'/user?access_token='+token).then(function(response) {
			$ionicUser.identify(response.data);
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
