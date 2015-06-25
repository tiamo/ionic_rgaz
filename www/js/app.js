/**
 * Rgaz (ionic application) http://rgaz.su
 * @author vk.tiamo@gmail.com
 */

angular.module('starter', ['ionic', 'ionic.service.core', 'ionic.service.push', 'ionic.service.deploy', 'ionic.service.analytics', 'starter.controllers', 'starter.services'])

.config(['$ionicAppProvider', function($ionicAppProvider) {
	$ionicAppProvider.identify({
		// Set the app to use development pushes
		// dev_push: true,
		app_id: '6b38e95d',
		api_key: '97f6c4a0c5de265390f557bb9cd8a806b66e3a406bb128e9'
	});
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	
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
		
		.state('tab.data', {
			url: '/data',
			views: {
				'tab-data': {
					templateUrl: 'templates/tab-data.html',
					controller: 'DataCtrl'
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
		
		.state('tab.news', {
			url: '/news',
			views: {
				'tab-news': {
					templateUrl: 'templates/tab-news.html',
					controller: 'NewsCtrl'
				}
			}
		})
		
	;
	
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/dash');
	
}])

.run(['$ionicPlatform', '$ionicDeploy', '$ionicAnalytics', '$rootScope', 'Auth', function($ionicPlatform, $ionicDeploy, $ionicAnalytics, $rootScope, Auth) {
	
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleLightContent();
		}
	});
	
	// check user auth
	$rootScope.$on('$stateChangeStart', function(e) {
		Auth.check();
	});
	
	// register analytics
	$ionicAnalytics.register();
	
    // Check for updates
    $ionicDeploy.check().then(function(response) {
		// response will be true/false
		if (response) {
			// Download the updates
			$ionicDeploy.download().then(function() {
				// Extract the updates
				$ionicDeploy.extract().then(function() {
					// Load the updated version
					$ionicDeploy.load();
				}, function(error) {
					// Error extracting
				}, function(progress) {
					// Do something with the zip extraction progress
					$scope.extraction_progress = progress;
				});
			}, function(error) {
				// Error downloading the updates
			}, function(progress) {
				// Do something with the download progress
				$scope.download_progress = progress;
			});
		}
	},
	function(error) {
		// Error checking for updates
	});
}])

;
