angular.module('starter.services', [])

.factory('Auth', function($q, $http, $location, $ionicUser, $ionicPush, $timeout, $window) {
	
	var authService = {
		baseUrl: 'http://cl.rgaz.su/api',
		homePath: '/dash',
		loginPath: '/login',
		token: localStorage.getItem('auth.token')
	}
	
	function serialize(obj) {
		var str = [];
		for(var p in obj) {
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		}
		return str.join("&");
	}
	
	// check is guest
	authService.isGuest = function() {
		return !$ionicUser.get().user_id;
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
		localStorage.setItem('auth.token', token);
		this.token = token;
	}
	
	// identify user
	authService.identify = function(token) {
		if (!token) {
			return;
		}
		return $http.get(this.baseUrl+'/user?access_token='+token)
			.success(function(data) {
				console.log('Identifying user.');
				$ionicUser.identify(data);
				$ionicPush.register({
					// canShowAlert: false,
					onNotification: function(notification) {
						var news = localStorage.getItem('news')||[];
						news.push({
							message: notification.alert,
							date: new Date()
						});
						localStorage.setItem('news', news);
					}
				}).then(function(deviceToken) {
					console.log('Send deviceToken to server');
					$http.get(authService.baseUrl+'/registerDevice?'+serialize({
						access_token: token,
						platform: ionic.Platform.platform(),
						user_id: data.user_id,
						token: deviceToken
					}));
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
