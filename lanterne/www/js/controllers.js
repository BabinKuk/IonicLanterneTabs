angular.module('lanterna.controllers', [])

.controller('MainCtrl', function($scope, $ionicPopup, $timeout) {
	//console.log('MainCtrl');
	
	// An alert dialog
	$scope.showPopup = function() {
		//console.log('alert');
		$scope.data = {};

		// An elaborate, custom popup
		var confirmPopup = $ionicPopup.confirm({
			title: 'Pozor',
			template: 'Da li ste sigurni da želite zatvoriti aplikaciju?'
		}).then(function(res) {
			if (res) {
				passwordPopup();
				//ionic.Platform.exitApp();
			}
		});
	};
	
	// handler functions
	function passwordPopup() {
		//console.log('pass');
		
		var myPopup = $ionicPopup.show({
			template: '<input type="password" ng-model="data.pass">',
			title: 'Za izlaz iz aplikacije potrebno je unijeti lozinku',
			subTitle: 'Vrijeme unosa je ograničeno na 10 sekundi',
			scope: $scope,
			buttons: [
				{ text: 'Cancel' },
				{
					text: '<b>Enter</b>',
					type: 'button-assertive',
					onTap: function(e) {
						if (!$scope.data.pass) {
							// don't allow the user to close unless he enters password
							//console.log('!');
							e.preventDefault();
						} else {
							//console.log('else');
							return $scope.data.pass;
						}
					}
				}
			]
		});
		
		myPopup.then(function(res) {
			//console.log('Tapped!', res);
			closeApp(res);
		});

		$timeout(function() {
			myPopup.close(); // close the popup after 10 seconds
		}, 10000);
		
	}
	function closeApp(pass) {
		//console.log('closeing app...');
		if (pass === 'lanterna') {
			//console.log('lanterna');
			ionic.Platform.exitApp();
		}
	}
})

.controller('LanterneCtrl', function($scope, $stateParams, LanterneList) {
	console.log('LanterneCtrl');

	$scope.svjetionik = {};

	// search
	$scope.search = function(){
		console.log($scope);
		var svjetionik = $scope.svjetionik.name;
		console.log('Searching...', svjetionik);

		// call service
		LanterneList.find(svjetionik)
			.then(function(response){
				$scope.lanterne = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
		
		// hide latest listings
		$scope.showAll = false;
		
		// show search results
		$scope.showResults = true;
	}
	
	//svi svjetionici
	$scope.getAll = function() {
		console.log('in getAll');
		// call service
		LanterneList.all()
			.then(function(response){
				$scope.lanterne = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
			
		// hide latest listings
		$scope.showAll = true;
		
		// show search results
		$scope.showResults = false;
	}
	
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
		//getPeopleDetails($stateParams.name);
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
	
	/*
	* if given group is the selected group, deselect it
	* else, select the given group
	*/
	$scope.toggleGroup = function(group) {
		//console.log('toggleGroup ', group);
		if ($scope.isGroupShown(group)) {
			//console.log('shownGroup ', null);
			$scope.shownGroup = null;
		} else {
			//console.log('shownGroup ', group);
			$scope.shownGroup = group;
		}
	};
	$scope.isGroupShown = function(group) {
		//console.log('isGroupShown ', group);
		return $scope.shownGroup === group;
	};
})

.controller('SvjetionicariCtrl', function($scope, SvjetionicariList) {
	//console.log('SvjetionicariCtrl');
	
	// search function
	$scope.search = function(query) {
		//console.log(query);
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
	//console.log('SvjetionicariListCtrl');
	
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
		getLanternForPerson($stateParams.id);
	}
	
	// handler function
	function getPersonDetails(id) {
		//console.log('in getPersonDetails ' + id);
		// call service
		SvjetionicariList.getPerson(id)
			.then(function(response){
				$scope.person = response; // assign data here to your $scope object
				//console.log($scope.person);
				//$scope.karijera = $scope.people.karijera;
			},function(error){
				console.log(error);
			});
	}
	
	function getLanternForPerson(id) {
		//console.log('in getLanternForPerson ' + id);
		// call service
		SvjetionicariList.getLanternForPerson(id)
			.then(function(response){
				$scope.svjetionici = response; // assign data here to your $scope object
				//console.log($scope.svjetionici);
				//$scope.karijera = $scope.people.karijera;
			},function(error){
				console.log(error);
			});
	}
	
		/*
	* if given group is the selected group, deselect it
	* else, select the given group
	*/
	$scope.toggleGroup = function(group) {
		//console.log('toggleGroup ', group);
		if ($scope.isGroupShown(group)) {
			//console.log('shownGroup ', null);
			$scope.shownGroup = null;
		} else {
			//console.log('shownGroup ', group);
			$scope.shownGroup = group;
		}
	};
	$scope.isGroupShown = function(group) {
		//console.log('isGroupShown ', group);
		return $scope.shownGroup === group;
	};
	
	function isNull(name){
		//console.log('is null ' + name);
		if (name.length > 0) {
			return true;
		} else {
			return false;
		}
	}
})

.controller('BibliotekaCtrl', function($scope, $stateParams, BibliotekaList) {
	//console.log('BibliotekaCtrl');
	
	getAll();
	
	// handler function
	function getAll() {
		//console.log('in getAll');
		// call service
		BibliotekaList.all()
			.then(function(response){
				$scope.knjige = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}
})

.controller('BibliotekaDetailCtrl', function($scope, $stateParams, BibliotekaList) {
	//console.log('BibliotekaDetailCtrl ' + $stateParams);
	//console.log(pdfDelegate)
	// check id first
	if($stateParams.name != undefined || $stateParams.name != ''){
		getDetails($stateParams.name);
	}
	
	// handler function
	function getDetails(name) {
		//console.log('in getDetails ' + name);
		// call service
		BibliotekaList.getDetails(name)
			.then(function(response){
				$scope.knjiga = response; // assign data here to your $scope object
				$scope.pdfUrl = $scope.knjiga.source;
				$scope.httpHeaders = { Authorization: 'Bearer some-aleatory-token' };
				//pdfDelegate.$getByHandle('my-pdf-container').load($scope.pdfUrl);
				//console.log($scope.pdfUrl);
			},function(error){
				console.log(error);
			});
	}
});
