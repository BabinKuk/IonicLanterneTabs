// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'lanterna' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'lanterna.services' is found in services.js
// 'lanterna.controllers' is found in controllers.js
angular.module('lanterna', ['ionic', 'lanterna.controllers', 'lanterna.services'])

.run(function($ionicPlatform, $ionicPopup) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
	
	$ionicPlatform.registerBackButtonAction(function (event) {
		// An alert dialog
		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: $state.current.name,
				template: $state.current.name
			});
			
			alertPopup.then(function(res) {
				console.log($state.current.name);
			});
		};
		
		if($state.current.name == "tab.home"){
			console.log('tab.home');
			//navigator.app.exitApp(); //<-- remove this line to disable the exit
			
			$ionicPopup.confirm({
				title: 'System warning',
				template: 'Are you sure you want to exit?'
			}).then(function(res) {
				if (res) {
					ionic.Platform.exitApp();
				}
			})
		} else {
			//console.log('app.backhistory');
			navigator.app.backHistory();
		}
	}, 100);
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

	// Place tabs at the top/bottom of the screen using ionicConfigProvider
	// Android defaults to top and iOS defaults to bottom.
	$ionicConfigProvider.tabs.position('bottom');
	
	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// setup an abstract state for the tabs directive
	.state('tab', {
		url: '/tab',
		abstract: true,
		templateUrl: 'templates/tabs.html'
	})

	// Each tab has its own nav history stack:
	.state('tab.home', {
		url: '/home',
		views: {
			'tab-home': {
				templateUrl: 'templates/tab-home.html',
				controller: 'MainCtrl'
			}
		}
	})
	.state('tab.lanterne', {
		url: '/lanterne',
		views: {
			'tab-lanterne': {
				templateUrl: 'templates/tab-lanterne.html',
				controller: 'LanterneCtrl'
			}
		}
	})
	.state('tab.lanterne-list', {
		url: '/lanterne-list',
		views: {
			'tab-lanterne': {
				templateUrl: 'templates/tab-lanterne-list.html',
				controller: 'LanterneListCtrl'
			}
		}
	})
	.state('tab.lanterne-detail', {
		url: '/lanterne-list/:name',
		views: {
			'tab-lanterne': {
				templateUrl: 'templates/lanterne-detail.html',
				controller: 'LanterneDetailCtrl'
			}
		}
	})
	.state('tab.svjetionicari', {
		url: '/svjetionicari',
		views: {
			'tab-svjetionicari': {
				templateUrl: 'templates/tab-svjetionicari.html',
				controller: 'SvjetionicariCtrl'
			}
		}
	})
	.state('tab.svjetionicari-list', {
		url: '/svjetionicari-list',
		views: {
			'tab-svjetionicari': {
				templateUrl: 'templates/tab-svjetionicari-list.html',
				controller: 'SvjetionicariListCtrl'
			}
		}
	})
	.state('tab.svjetionicari-detail', {
		url: '/svjetionicari-list/:id',
		views: {
			'tab-svjetionicari': {
				templateUrl: 'templates/svjetionicari-detail.html',
				controller: 'SvjetionicariDetailCtrl'
			}
		}
	})
	.state('tab.biblioteka', {
		url: '/biblioteka',
		views: {
			'tab-biblioteka': {
				templateUrl: 'templates/tab-biblioteka.html',
				controller: 'BibliotekaCtrl'
			}
		}
	})
	;

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/home');
});