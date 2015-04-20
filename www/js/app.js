// Ionic Rgaz Application

angular.extend(angular, {
	toParam: function(object, prefix) {
		var stack = [];
		var value;
		var key;
		for(key in object) {
			value = object[ key ];
			key = prefix ? prefix + '[' + key + ']' : key;
			if (value === null) {
				value = encodeURIComponent(key) + '=';
			} else if (typeof(value) !== 'object') {
				value = encodeURIComponent(key) + '=' + encodeURIComponent(value);
			} else {
				value = toParam(value, key);
			}
			stack.push(value);
		}
		return stack.join('&');
	}
});

angular.module('starter', ['ionic', 'ionic.service.core', 'ionic.service.push', 'starter.controllers', 'starter.services'])
// angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.config(['$ionicAppProvider', function($ionicAppProvider) {
	// Identify app
	$ionicAppProvider.identify({
		// The App ID for the server
		app_id: '6b38e95d',
		// The API key all services will use for this app
		api_key: '08a8d5bc67c81347d95533272a8891c2186db8c8304b1c6a'
		// Your GCM sender ID/project number (Uncomment if using GCM)
		//gcm_id: 'YOUR_GCM_ID'
	});
}])

.config(function($httpProvider) {
	$httpProvider.defaults.headers.post[ 'Content-Type' ] = 'application/x-www-form-urlencoded;charset=utf-8';
	$httpProvider.defaults.transformRequest = function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? angular.toParam(data) : data;
	};
})

.run(function($ionicPlatform, $rootScope, $ionicPush, Auth) {
	
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			
			$ionicPush.register({
				canShowAlert: false,
				onNotification: function(notification) {
					// Called for each notification for custom handling
					// $scope.lastNotification = JSON.stringify(notification);
				}
			}).then(function(deviceToken) {
				// $scope.token = deviceToken;
			});
		}
		if (window.StatusBar) {
			StatusBar.styleLightContent();
		}
		
	});
	
	$rootScope.$on('$stateChangeStart', function(e) {
		Auth.check();
	});
	
})

.config(function($stateProvider, $urlRouterProvider) {
	
	$stateProvider

		.state('login', {
			url: '/login',
			templateUrl: 'templates/login.html'
		})
		
		// setup an abstract state for the tabs directive
		
		.state('tab', {
			url: '/tab',
			abstract: true,
			templateUrl: 'templates/tabs.html'
		})
		
		// Each tab has its own nav history stack:
		
		.state('tab.dash', {
			url: '/dash',
			views: {
				'tab-dash': {
					templateUrl: 'templates/tab-dash.html',
					controller: 'DashCtrl'
				}
			}
		})
		
		.state('tab.gas', {
			url: '/gas',
			views: {
				'tab-gas': {
					templateUrl: 'templates/tab-gas.html',
					controller: 'GasCtrl'
				}
			}
		})
		
		.state('tab.account', {
			url: '/account',
			views: {
				'tab-account': {
					templateUrl: 'templates/tab-account.html',
					controller: 'AccountCtrl'
				}
			}
		})
	;
	
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/dash');
	
});
