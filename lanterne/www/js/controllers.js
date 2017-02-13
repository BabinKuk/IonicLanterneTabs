angular.module('lanterna.controllers', [])

.controller('MainCtrl', function($scope, $ionicPopup, $timeout) {
	//console.log('MainCtrl');
	
	// An alert dialog
	$scope.showPopup = function() {
		console.log('alert');
		$scope.data = {};

		// An elaborate, custom popup
		var myPopup = $ionicPopup.show({
			template: '<input type="password" ng-model="data.pass">',
			title: 'Please Enter Password To Exit App',
			subTitle: 'Please use normal things',
			scope: $scope,
			buttons: [
				{ text: 'Cancel' },
				{
					text: '<b>Enter</b>',
					type: 'button-assertive',
					onTap: function(e) {
						if (!$scope.data.pass) {
							// don't allow the user to close unless he enters password
							console.log('!');
							e.preventDefault();
						} else {
							console.log('else');
							return $scope.data.pass;
						}
					}
				}
			]
		});

		myPopup.then(function(res) {
			console.log('Tapped!', res);
			closeApp(res);
		});

		$timeout(function() {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 10000);
	};
	
	// handler function
	function closeApp(pass) {
		console.log('closeing app...');
		if (pass === 'lanterna') {
			console.log('lanterna');
			$ionicPopup.confirm({
				title: 'System warning',
				template: 'Are you sure you want to exit?'
			}).then(function(res) {
				if (res) {
					ionic.Platform.exitApp();
				}
			})
			
		}
	}
})

.controller('LanterneCtrl', function($scope) {
	//console.log('LanterneCtrl');
})

.controller('LanterneListCtrl', function($scope, $stateParams, LanterneList) {
	//console.log('LanterneListCtrl');
	
	getAll();
	
	// handler function
	function getAll() {
		//console.log('in getAll');
		// call service
		LanterneList.all()
			.then(function(response){
				$scope.lanterne = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}
})

.controller('LanterneDetailCtrl', function($scope, $stateParams, LanterneList) {
	//console.log($stateParams);
	
	// check id first
	if($stateParams.name != undefined || $stateParams.name != ''){
		// get lantern details
		getDetails($stateParams.name);
		// get all people asociated with that particular lantern
		getPeopleDetails($stateParams.name);
	}
	
	// handler functions
	function getDetails(name) {
		//console.log('in getDetails ' + name);
		// call service
		LanterneList.getDetails(name)
			.then(function(response){
				// lanterndetails
				$scope.svjetionik = response; // assign data here to your $scope object
				//console.log($scope.svjetionik);
			},function(error){
				console.log(error);
			});
	}
	
	function getPeopleDetails(name) {
		//console.log('in getPeopleDetails ' + name);
		// call service
		LanterneList.getPeopleOnLanterna(name)
			.then(function(response){
				//list of people associated with that particular lantern
				$scope.people = response; // assign data here to your $scope object
				//$scope.karijera = $scope.people.karijera;
				//console.log($scope.people);
			},function(error){
				console.log(error);
			});
	}
	
})

.controller('SvjetionicariCtrl', function($scope, SvjetionicariList) {
	console.log('SvjetionicariCtrl');
	
	// search function
	$scope.search = function(query) {
		console.log(query);
		doSearch(query);
	}
	
	//handler function
	var doSearch = ionic.debounce(function(query) {
		console.log('doSearch ' + query);
		//Flickr.search(query).then(function(resp) {
		//	$scope.photos = resp;
		//});
		// call service
		SvjetionicariList.find(query)
			.then(function(response){
				$scope.people = response; //assign data here to your $scope object
			},function(error){
				console.log(error);
			});
		
	}, 200);
})

.controller('SvjetionicariListCtrl', function($scope, $stateParams, SvjetionicariList) {
	//console.log('SvjetionicariCtrlList');
	
	getAll();
	
	// handler function
	function getAll() {
		//console.log('in getAllPeople');
		// call service
		SvjetionicariList.all()
			.then(function(response){
				$scope.people = response; //assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}
})

.controller('SvjetionicariDetailCtrl', function($scope, $stateParams, SvjetionicariList) {
	//console.log($stateParams);
	
	// check id first
	if($stateParams.id != undefined || $stateParams.id != ''){
		getPersonDetails($stateParams.id);
	}
	
	// handler function
	function getPersonDetails(id) {
		//console.log('in getPersonDetails ' + id);
		// call service
		SvjetionicariList.getPerson(id)
			.then(function(response){
				$scope.people = response; // assign data here to your $scope object
				$scope.karijera = $scope.people.karijera;
			},function(error){
				console.log(error);
			});
	}
	
	function isNull(name){
		console.log('is null ' + name);
		if (name.length > 0) {
			return true;
		} else {
			return false;
		}
	}
});
