angular.module('starter.services', [])

.factory('Auth', function($q, $http, $location, $ionicUser, $ionicPush, persistentStorage) {
	
	var storageKeyName = 'auth';
	var authService = {
		baseUrl: 'http://cl.rgaz.su/api',
		homePath: '/dash',
		loginPath: '/login',
		storage: persistentStorage.retrieveObject(storageKeyName) || {}
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
		return !this.storage.token || !$ionicUser.get().user_id;
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
		this.storage = {};
	}
	
	// set new auth token
	authService.setToken = function(token) {
		if (!token) {
			return;
		}
		this.storage.token = token;
		persistentStorage.storeObject(storageKeyName, this.storage);
	}
	
	// identify user
	authService.identify = function(access_token) {
		if (!access_token) {
			return;
		}
		return $http.get(this.baseUrl+'/user?access_token='+access_token)
			.success(function(data) {
				console.log('Identifying user.');
				$ionicUser.identify(data);
				$ionicPush.register({
					// canShowAlert: false,
					// onNotification: function(notification) {
					// }
				}).then(function(deviceToken) {
					// storenew device token
					if (!authService.storage.deviceToken || authService.storage.deviceToken!=deviceToken){
						console.log('Send device token to server.');
						authService.storage.deviceToken = deviceToken;
						persistentStorage.storeObject(storageKeyName, authService.storage);
						$http.get(authService.baseUrl+'/registerDevice?'+serialize({
							platform: ionic.Platform.platform(),
							access_token: access_token,
							token: deviceToken
						}));
					}
				});
			});
	}
	
	// check authorization
	authService.check = function(){
		var isGuest = this.isGuest();
		if ($location.path()===this.loginPath) {
			if (!isGuest) {
				$location.path(this.homePath);
			}
		}
		else {
			if (isGuest) {
				$location.path(this.loginPath);
			}
		}
	}
	
	authService.identify(authService.storage.token, authService.check);
	
	return authService;
})

;
