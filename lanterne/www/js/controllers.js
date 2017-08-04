angular.module('lanterna.controllers', [])

.controller('MainCtrl', function($scope, $ionicPopup, $timeout, $ionicPlatform, $state) {
	//console.log('MainCtrl');
	
	// back button event handling
	$ionicPlatform.registerBackButtonAction(function (event) {
		event.preventDefault();
		//console.log("back button action handler");
		//console.log($state.current);
		
		if($state.current.name == "tab.home"){
			//console.log('home page -> exit app');
			//exit app popup
			showExitAppPopup();
		} else {
			//console.log('app.backhistory');
			navigator.app.backHistory();
		}
	}, 100);
	
	//alert dialog
	$scope.showPopup = function() {
		showExitAppPopup();
	};
	
	//exit app handler functions
	function showExitAppPopup(){
		//console.log('showExitAppPopup');
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
	}
	
	function passwordPopup() {
		//console.log('pass');
		
		var myPopup = $ionicPopup.show({
			template: '<input type="password" ng-model="data.pass">',
			title: 'Za izlaz iz aplikacije potrebno je unijeti lozinku.',
			subTitle: 'Vrijeme unosa lozinke je ograničeno na 10 sekundi.',
			scope: $scope,
			buttons: [
				{ text: 'Cancel' },
				{
					text: '<b>Enter</b>',
					type: 'button-assertive',
					onTap: function(e) {
						if (!$scope.data.pass) {
							// don't allow the user to close unless he enters password
							e.preventDefault();
						} else {
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
		//check pass and close
		if (pass === 'bokinez') {
			ionic.Platform.exitApp();
		}
	}
})

.controller('LanterneCtrl', function($scope, $stateParams, LanterneList, $ionicHistory, $timeout, $ionicNavBarDelegate, CacheFactory, noOfItemsToDisplay) {
	//console.log('LanterneCtrl', $scope);
	
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		//console.log('LanterneCtrl beforeEnter');
		viewData.enableBack = true;
	});
	
	if (!CacheFactory.get('postCache')) {
		CacheFactory.createCache('postCache');
	}
	var postCache = CacheFactory.get('postCache');
	
	//init
	$scope.svjetionik = {};
	$scope.lanterne = [];
	$scope.numberOfItemsToDisplay;
	
	/*
	// Cache a post
	postCache.put(id, data);
	 
	// Delete from cache
	postCache.remove(id);
	 
	// Get a post
	$scope.post = postCache.get(id);
	*/
	
	setCategory('1');
	doGetAll();
	
	//set category
	$scope.setCategory = function(category) {
		//console.log('click category ' + category);
		setCategory(category);
	}
	
	//search svjetionik
	$scope.search = function(category){
		//console.log('search ' + category);
		var svjetionik = $scope.svjetionik.name;
		
		//ako je polje prazno, dohvati sve
		if (svjetionik == '' || svjetionik == null) {
			//doGetAll()
			doSearch('', category);
		} else {
			doSearch(svjetionik, category);
		}
	}
	
	//load more data into list
	$scope.loadMoreData = function() {
		//check to load more data
		if ($scope.moreDataCanBeLoaded) {
			//load number of more items
			$scope.numberOfItemsToDisplay += noOfItemsToDisplay;
			//need to call this when finish loading more data
			//done();
		}
		
		$scope.$broadcast('scroll.infiniteScrollComplete');
	};
	
	//check if there is more data to load
	$scope.moreDataCanBeLoaded = function() {
		return ($scope.lanterne.length > $scope.numberOfItemsToDisplay) ? true : false;
	};
	
	// handler functions
	function setCategory(category) {
		//console.log('cat: ' + category);
		if (category != undefined || category != '') {
			//console.log('cat not null ' + category);
			$scope.svjetionik.categoryId = category;
		} else {
			//console.log('cat null, set default 1');
			$scope.svjetionik.categoryId = '1';
		}
	}
	
	function doGetAll() {
		//reset numberOfItemsToDisplay
		$scope.numberOfItemsToDisplay = noOfItemsToDisplay;
		
		//call service
		LanterneList.all()
			.then(function(response){
				$scope.lanterne = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
			
		//show search results
		$scope.showResults = true;
	}
	
	function doSearch(svjetionik, category){
		//reset numberOfItemsToDisplay
		$scope.numberOfItemsToDisplay = noOfItemsToDisplay;
		
		//call service
		LanterneList.find(svjetionik, category)
			.then(function(response){
				$scope.lanterne = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
		
		//show search results
		$scope.showResults = true;
	}
	
	function getLanterneImages() {
		//call service
		LanterneList.all()
			.then(function(response){
				$scope.lanterne = response; // assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}
})

//ako se nece koristiti list ekran, moze se maknuti
.controller('LanterneListCtrl', function($scope, $stateParams, $timeout, LanterneList) {
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

.controller('LanterneDetailCtrl', function($scope, $stateParams, $timeout, LanterneList, $ionicHistory, $ionicNavBarDelegate) {
	//init
	$scope.naziv;
	$scope.showResults = false;
	$scope.showError = false;
	
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		viewData.enableBack = true;
	});

	// check id first
	if($stateParams.name != undefined || $stateParams.name != ''){
		$scope.naziv = $stateParams.name;
		// get lantern details
		getDetails($stateParams.name);
		//get all people asociated with that particular lantern
		//!!!!!ovo se ne koristi jer se podaci nalaze u svjetionici.json!!!!!!
		//getPeopleDetails($stateParams.name);
	}
	
	$scope.whatClass = function(val){
		if(val == '' || val == undefined || val == null) {
			return null;
		} else {
			return 'col-50';
		}
	}
	
	$scope.displayElement = function(val){
		if(val == '' || val == undefined || val == null) {
			return false;
		} else {
			return true;
		}
	}
	
	// handler functions
	function getDetails(name) {
		//call service
		LanterneList.getDetails(name)
			.then(function(response){
				//detalji o svjetioniku
				$scope.svjetionik = response; // assign data here to your $scope object

				$timeout(function(){
					console.log('in delay...200');
					if ($scope.svjetionik == undefined || $scope.svjetionik == '' || $scope.svjetionik == null) {
						// show search results
						$scope.showResults = false;
						$scope.showError = true;
					} else {
						// show search results
						$scope.showResults = true;
						$scope.showError = false;
					}
				}, 200); //200ms delay
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

.controller('SvjetionicariCtrl', function($scope, SvjetionicariList, $ionicHistory, $ionicNavBarDelegate, $timeout, noOfItemsToDisplay) {
	
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		viewData.enableBack = true;
	});

	//init
	$scope.svjetionicar = {};
	$scope.people = [];
	$scope.numberOfItemsToDisplay;
	
	var ime = '';
	var prezime = '';
	var mjesto = '';
	var option;
	
	doGetAll();

	//search svjetionicare
	$scope.search = function(){
		//podaci s ekrana
		ime = $scope.svjetionicar.ime;
		prezime = $scope.svjetionicar.prezime;
		mjesto = $scope.svjetionicar.mjesto;
		
		//reset numberOfItemsToDisplay
		$scope.numberOfItemsToDisplay = noOfItemsToDisplay;
		
		//opcije kako je upisano na ekranu:
		//0 - sve prazno
		//1 - uneseno ime i prezime, mjesto prazno
		//2 - uneseno samo ime, prezime i mjesto prazno
		//3 - uneseno samo prezime, ime i mjesto prazno
		//4 - uneseno samo mjesto, ime i prezime prazno
		//5 - uneseno prezime i mjesto, ime prazno
		//6 - uneseno ime i mjesto, prezime prazno
		//7 - uneseno ime, prezime i mjesto
		
		//ako su polja prazna dohvati sve
		if ((ime == '' || ime == null) && (prezime == '' || prezime == null) && (mjesto == '' || mjesto == null)){
			//doGetAll();
			option = 0;
		} else {
			if ((ime != '') && (prezime != '') && (mjesto == '')){
				option = 1;
			}
			if ((ime != '') && (prezime == '') && (mjesto == '')){
				option = 2;
			}
			if ((ime == '') && (prezime != '') && (mjesto == '')){
				option = 3;
			}
			if ((ime == '') && (prezime == '') && (mjesto != '')){
				option = 4;
			}
			if ((ime == '') && (prezime != '') && (mjesto != '')){
				option = 5;
			}
			if ((ime != '') && (prezime == '') && (mjesto != '')){
				option = 6;
			}
			if ((ime != '') && (prezime != '') && (mjesto != '')){
				option = 7;
			}
		}
		doSearch(ime, prezime, mjesto, option);
	}
	
	//load more data into list
	$scope.loadMoreData = function() {
		//check to load more data
		if ($scope.moreDataCanBeLoaded) {
			//load number of more items
			$scope.numberOfItemsToDisplay += noOfItemsToDisplay;
			//need to call this when finish loading more data
			//done();
		}
		
		$scope.$broadcast('scroll.infiniteScrollComplete');
	};
	
	//check if there is more data to load
	$scope.moreDataCanBeLoaded = function() {
		return ($scope.people.length > $scope.numberOfItemsToDisplay) ? true : false;
	};
	
	//handler functions
	function doGetAll() {
		//reset numberOfItemsToDisplay
		$scope.numberOfItemsToDisplay = noOfItemsToDisplay;
		
		//call service
		SvjetionicariList.all()
			.then(function(response){
				//lista svjetionicara
				$scope.people = response; //assign data here to your $scope object
			},function(error){
				console.log(error);
			});
			
		//show search results
		$scope.showResults = true;
	}
	
	function doSearch(ime, prezime, mjesto, option){
		//call service
		SvjetionicariList.find(ime, prezime, mjesto, option)
			.then(function(response){
				//lista svjetionicara (search)
				$scope.people = response; // assign data here to your $scope object
			},function(error){
				//console.log(error);
			});
		
		// show search results
		$scope.showResults = true;
	}
})

.controller('SvjetionicariListCtrl', function($scope, $stateParams, $timeout, SvjetionicariList, noOfItemsToDisplay) {
	//init
	$scope.people = [];
	$scope.numberOfItemsToDisplay = noOfItemsToDisplay;
	
	//mjesto
	$scope.mjesto = $stateParams.name;
		
	if($stateParams.name != undefined || $stateParams.name != ''){
		//dohvati listu svjetionicara
		getPersonList($stateParams.id, $stateParams.name);
	}
	
	//load more data into list
	$scope.loadMoreData = function() {
		//check to load more data
		if ($scope.moreDataCanBeLoaded) {
			//load number of more items
			$scope.numberOfItemsToDisplay += noOfItemsToDisplay;
			//need to call this when finish loading more data
			//done();
		}
		
		$scope.$broadcast('scroll.infiniteScrollComplete');
	};
	
	//check if there is more data to load
	$scope.moreDataCanBeLoaded = function() {
		return ($scope.people.length > $scope.numberOfItemsToDisplay) ? true : false;
	};
	
	//handler function
	function getPersonList(id, mjesto) {
		//call service
		// pretraga samo po mjestu (vidi u SvjetionicariCtrl, option 4)
		SvjetionicariList.find('', '', mjesto, 4)
			.then(function(response){
				//lista svjetionicara
				$scope.people = response; //assign data here to your $scope object
			},function(error){
				console.log(error);
			});
	}

})

.controller('SvjetionicariDetailCtrl', function($scope, $stateParams, $timeout, SvjetionicariList, $ionicHistory, $ionicNavBarDelegate, $ionicModal) {
	//init
	$scope.person = '';
	$scope.showResults = false;
	$scope.showError = false;
	
	//check id first
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		viewData.enableBack = true;
	});

	if($stateParams.id != undefined || $stateParams.id != ''){
		//dohvati detalje o svjetionicaru
		getPersonDetails($stateParams.id);
		//dohvati detalje o svjetionicima
		//!!!!!!!!!!!SAMO AKO SE SVI PODACI NALAZE U svjetionici.json!!!!!!!!!!
		getLanternForPerson($stateParams.id);
	}
	
	$scope.whatClass = function(val){
		if(val == '' || val == undefined || val == null) {
			return null;
		} else {
			return 'col-50';
		}
	}
	
	$scope.displayElement = function(val){
		if(val == '' || val == undefined || val == null) {
			return false;
		} else {
			return true;
		}
	}
	
	//handler function
	function getPersonDetails(id) {
		console.log('call person', $scope.person);
		//call service
		SvjetionicariList.getPerson(id)
			.then(function(response){
				//detalji o svjetionicaru
				$scope.person = response; // assign data here to your $scope object
				console.log('person', $scope.person);
				
				$timeout(function(){
					if ($scope.person == undefined) {
						console.log('person null timeout 200');
						// show search results
						$scope.showResults = false;
						$scope.showError = true;
					} else {
						console.log('person NOT null timeout 200');
						// show search results
						$scope.showResults = true;
						$scope.showError = false;
					}
				}, 200); //200ms delay
			},function(error){
				console.log(error);
			});
			
	}
	
	function getLanternForPerson(id) {
		//call service
		SvjetionicariList.getLanternForPerson(id)
			.then(function(response){
				//lista svjetionika povezanih sa svjetionicarem
				$scope.svjetionici = response; // assign data here to your $scope object
				//console.log($scope.svjetionici);
			},function(error){
				console.log(error);
			});
	}
	
	//display details in outside ng-repeat markup
	$scope.itemToDisplay = null;
	
	/*
	* toggle functions
	* if given group is the selected group, deselect it
	* else, select the given group
	*/
	$scope.toggleGroup = function(group) {
		//console.log('in toggle ', group);
		if ($scope.isGroupShown(group)) {
			//console.log('close');
			$scope.shownGroup = null;
			$scope.itemToDisplay = null;
		} else {
			$scope.shownGroup = group;
			$scope.itemToDisplay = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	//openModal
	$scope.openModal = function() {
		//$scope.photos = $scope.cultivar.imageArray;
		//$ionicSlideBoxDelegate.slide(slide);
		$scope.modal.show();
	};
	
	// modal handler
	$ionicModal.fromTemplateUrl('templates/modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	
	$scope.closeModal = function() {
		$scope.modal.hide();
	};
})

.controller('BibliotekaCtrl', function($scope, $stateParams, BibliotekaList, $ionicHistory, $ionicNavBarDelegate, $timeout, noOfItemsToDisplay) {
	
	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
		viewData.enableBack = true;
	});

	//init
	$scope.numberOfItemsToDisplay;
	$scope.knjige = [];
	
	//dohvati knjige
	getAll();
	
	//load more data into list
	$scope.loadMoreData = function() {
		//check to load more data
		if ($scope.moreDataCanBeLoaded) {
			//load number of more items
			$scope.numberOfItemsToDisplay += noOfItemsToDisplay;
			//need to call this when finish loading more data
			//done();
		}
		
		$scope.$broadcast('scroll.infiniteScrollComplete');
	};
	
	//check if there is more data to load
	$scope.moreDataCanBeLoaded = function() {
		return ($scope.knjige.length > $scope.numberOfItemsToDisplay) ? true : false;
	};
	
	//handler function
	function getAll() {
		//reset
		$scope.numberOfItemsToDisplay = noOfItemsToDisplay;
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
			},function(error){
				console.log(error);
			});
	}
	
	$scope.loading = 'Loading...';

	$scope.onLoad = function() {
		// do something when pdf is fully loaded
		// $scope.loading = '';
		$scope.loading = '';
	}
	
	$scope.onProgress = function (progress) {
    };
});