angular.module('lanterna.controllers', [])

.controller('MainCtrl', function($scope, $ionicPopup, $timeout) {
	//console.log('MainCtrl');
	
	//alert dialog
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
	
	//handler functions
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
			//close app
			closeApp(res);
		});

		$timeout(function() {
			myPopup.close(); // close the popup after 10 seconds
		}, 10000);
	}
	
	function closeApp(pass) {
		//console.log('closeing app...');
		//check pass and close
		if (pass === 'lanterna') {
			ionic.Platform.exitApp();
		}
	}
})

.controller('LanterneCtrl', function($scope, $stateParams, LanterneList) {
	//console.log('LanterneCtrl');

	$scope.svjetionik = {};
	
	//svi svjetionici
	$scope.getAll = function() {
		doGetAll();
	}
	
	//search svjetionik
	$scope.search = function(){
		//console.log($scope);
		var svjetionik = $scope.svjetionik.name;
		
		//ako je polje prazno, dohvati sve
		if (svjetionik == '' || svjetionik == null) {
			doGetAll()
		} else {
			doSearch(svjetionik);
		}
	}
	
	// handler functions
	function doGetAll() {
		//console.log('in getAll');
		//call service
		LanterneList.all()
			.then(function(response){
				$scope.lanterne = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
			
		// hide all listings
		$scope.showAll = true;
		
		// show search results
		$scope.showResults = false;
	}
	
	function doSearch(svjetionik){
		//console.log('doSearch...', svjetionik);
		//call service
		LanterneList.find(svjetionik)
			.then(function(response){
				$scope.lanterne = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
		
		//hide all listings
		$scope.showAll = false;
		
		//show search results
		$scope.showResults = true;
	}
})

//ako se nece koristiti list ekran, moze se maknuti
.controller('LanterneListCtrl', function($scope, $stateParams, LanterneList) {
	//console.log('LanterneListCtrl');
	
	//svi svjetionici
	getAll();
	
	//handler function
	function getAll() {
		//console.log('in getAll');
		//call service
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
		//get all people asociated with that particular lantern
		//!!!!!ovo se ne koristi jer se podaci nalaze u svjetionici.json!!!!!!
		//getPeopleDetails($stateParams.name);
	}
	
	// handler functions
	function getDetails(name) {
		//console.log('in getDetails ' + name);
		//call service
		LanterneList.getDetails(name)
			.then(function(response){
				//detalji o svjetioniku
				$scope.svjetionik = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}
	
	function getPeopleDetails(name) {
		//console.log('in getPeopleDetails ' + name);
		//call service
		LanterneList.getPeopleOnLanterna(name)
			.then(function(response){
				//list of people associated with that particular lantern
				$scope.people = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}
	
	/*
	* toggle functions
	* if given group is the selected group, deselect it
	* else, select the given group
	*/
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
})

.controller('SvjetionicariCtrl', function($scope, SvjetionicariList) {
	//console.log('SvjetionicariCtrl');
	
	//set object
	$scope.svjetionicar = {};
	
	//svi svjetionicari
	$scope.getAll = function(){
		doGetAll();
	}

	// search svjetionicare
	$scope.search = function(){
		//console.log($scope);
		//podaci s ekrana
		var ime = $scope.svjetionicar.ime;
		var prezime = $scope.svjetionicar.prezime;
		
		//opcije sto je upisano na ekranu:
		//1 - uneseno ime i prezime
		//2 - uneseno samo ime
		//3 - uneseno samo prezime
		var option;
		
		//ako su polja prazna dohvati sve
		if ((ime == '' || ime == null) && (prezime == '' || prezime == null)){
			doGetAll();
		} else {
			if ((ime != '' || ime != null) && (prezime != '' || prezime != null)){
				option = 1;
			}
			if ((ime != '' || ime != null) && (prezime == '' || prezime == null)){
				option = 2;
			}
			if ((ime == '' || ime == null) && (prezime != '' || prezime != null)){
				option = 3;
			}
			doSearch(ime, prezime, option);
		}		
	}
	
	//handler functions
	function doGetAll() {
		//call service
		SvjetionicariList.all()
			.then(function(response){
				//lista svjetionicara
				$scope.people = response; //assign data here to your $scope object
			},function(error){
				console.log(error);
			});
			
		//hide all listings
		$scope.showAll = true;
		
		//show search results
		$scope.showResults = false;
	}
	
	function doSearch(ime, prezime, option){
		//call service
		SvjetionicariList.find(ime, prezime, option)
			.then(function(response){
				//lista svjetionicara (search)
				$scope.people = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
		
		//hide all listings
		$scope.showAll = false;
		
		// show search results
		$scope.showResults = true;
	}
})

//ako se nece koristiti list ekran, moze se maknuti
.controller('SvjetionicariListCtrl', function($scope, $stateParams, SvjetionicariList) {
	//console.log('SvjetionicariListCtrl');
	
	getAll();
	
	//handler function
	function getAll() {
		//call service
		SvjetionicariList.all()
			.then(function(response){
				//lista svjetionicara
				$scope.people = response; //assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}
})

.controller('SvjetionicariDetailCtrl', function($scope, $stateParams, SvjetionicariList) {
	//check id first
	if($stateParams.id != undefined || $stateParams.id != ''){
		//dohvati detalje
		getPersonDetails($stateParams.id);
		getLanternForPerson($stateParams.id);
	}
	
	//handler function
	function getPersonDetails(id) {
		//call service
		SvjetionicariList.getPerson(id)
			.then(function(response){
				//detalji o svjetionicaru
				$scope.person = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}
	
	function getLanternForPerson(id) {
		//console.log('in getLanternForPerson ' + id);
		//call service
		SvjetionicariList.getLanternForPerson(id)
			.then(function(response){
				//lista svjetionika povezanih sa svjetionicarem
				$scope.svjetionici = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}
	
	/*
	* toggle functions
	* if given group is the selected group, deselect it
	* else, select the given group
	*/
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
})

.controller('BibliotekaCtrl', function($scope, $stateParams, BibliotekaList) {
	//console.log('BibliotekaCtrl');
	//dohvati knjige
	getAll();
	
	//handler function
	function getAll() {
		//call service
		BibliotekaList.all()
			.then(function(response){
				//lista knjiga
				$scope.knjige = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}
})

.controller('BibliotekaDetailCtrl', function($scope, $stateParams, BibliotekaList) {
	//console.log('BibliotekaDetailCtrl ' + $stateParams);
	//check id first
	if($stateParams.name != undefined || $stateParams.name != ''){
		//detalji
		getDetails($stateParams.name);
	}
	
	//handler function
	function getDetails(name) {
		//call service
		BibliotekaList.getDetails(name)
			.then(function(response){
				//knjiga object
				$scope.knjiga = response; // assign data here to your $scope object
				$scope.pdfUrl = $scope.knjiga.source;
				$scope.httpHeaders = { Authorization: 'Bearer some-aleatory-token' };
				//pdfDelegate.$getByHandle('my-pdf-container').load($scope.pdfUrl);
				//console.log($scope.pdfUrl);
			},function(error){
				console.log(error);
			});
	}
	
	$scope.loading = 'Loading...';

	$scope.onLoad = function() {
		// do something when pdf is fully loaded
		// $scope.loading = '';
		console.log('Loaded...');
		$scope.loading = '';
	}
	
	$scope.onProgress = function (progress) {
        console.log('Progress...');
		console.log(progress);
    };
});
