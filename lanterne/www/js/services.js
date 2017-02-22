angular.module('lanterna.services', [])

.factory('SvjetionicariList', function($http, $q, serverUrl) {
	
	return {
		//svi svjetionicari
		all: getAllPeople,
		//detalji o svjetionicaru
		getPerson: getPerson,
		//lista svjetionika na kojem je svetionicar bio
		getLanternForPerson: getLanternForPerson,
		//find by name
		find: findByName
	}
	
	//handler functions
	function getAllPeople() {
		//console.log('svi svjetionicari');
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		//get data
		//$http.get("json/svjetionicari.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionicari.json").then(function(response) {
			//console.log(response.data);
			deffered.resolve(response.data);
		})
        return deffered.promise;
	}

	function getPerson(personId) {
		//console.log('person ' + personId);
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		//get data
		//$http.get("json/svjetionicari.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionicari.json").then(function(response) {
			//svi svjetionicari
			var people = response.data;
			var person;
			//loop people
			for (var i = 0; i < people.length; i++) {
				//console.log(people[i]);
				if (people[i].id === parseInt(personId)) {
					person = people[i];
					//return person;
				}
			}
			deffered.resolve(person);
		})
		return deffered.promise;
	}
	
	//!!!!!!!!!!!SAMO AKO SE SVI PODACI NALAZE U svjetionicari.json!!!!!!!!!!
	function getLanternForPerson(personId) {
		//async function to know when the data has arrived
		var deffered = $q.defer();
				
		//get data
		//$http.get("json/svjetionici.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionici.json").then(function(response) {
			//svi svjetionici u json fileu
			var allLanterne = response.data;
			
			// svjetionici na kojima je bio svjetionicar(personId)
			var lanternArray = [];
			//loop through svi svjetionici array
			for (var i = 0; i < allLanterne.length; i++) {
				//create objects
				var lantern = {};
				var personDetails;
				
				//loop through svjetionicari array for each svjetionik
				for (var j = 0; j < allLanterne[i].svjetionicari.length; j++) {
					//provjeri ako je svjetionicar bio na svjetioniku
					if (allLanterne[i].svjetionicari[j].id == parseInt(personId)) {
						//object
						lantern.id = allLanterne[i].id;
						lantern.name = allLanterne[i].name;
						lantern.image = allLanterne[i].image;
						lantern.personDetails = allLanterne[i].svjetionicari[j];
						// push into array
						lanternArray.push(lantern);
					}
				}
			}
			deffered.resolve(lanternArray);
		})
		return deffered.promise; 
	}
	
	function findByName(ime, prezime, option) {
		//console.log('in findByName ' + ime + ', ' + prezime);
		
		//async function to know when the data has arrived
		var deffered = $q.defer();

		//get data
		//$http.get("json/svjetionicari.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionici.json").then(function(response) {
			//svi svjetionicari
			var svjetionicari = response.data;
			//svjetionicari filtrirano
			var svjetionicariFiltered = [];
			
			//u filtrirano idu oni koji zadovoljavaju uvjete sa ekrana (ime, prezime)
			svjetionicariFiltered = svjetionicari.filter(function(el) {
				//console.log('filtering ' + svjetionikName.toUpperCase());
				if (option == 1) {
					return (el.ime.toLowerCase().indexOf(ime.toLowerCase()) && el.prezime.toLowerCase()	.indexOf(prezime.toLowerCase())) > -1;
				}
				if (option == 2) {
					return el.ime.toLowerCase().indexOf(ime.toLowerCase()) > -1;
				}
				if (option == 3) {
					return el.prezime.toLowerCase().indexOf(prezime.toLowerCase()) > -1;
				}
			});
			//console.log(svjetioniciFiltered);
			deffered.resolve(svjetionicariFiltered);
		})
        return deffered.promise;
    }
})

.factory('LanterneList', function($http, $q, serverUrl) {
	
	return {
		//svi svjetionici
		all: getAll,
		//detalji o svjetioniku
		getDetails: getDetails,
		//lista svjetionicara koji su bili na svjetioniku
		getPeopleOnLanterna: getPeopleOnLanterna,
		//find by name
		find: findByName
	}

	// handler functions
	function getAll() {
		//console.log('svi svjetionici');
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		// get data
		//$http.get("json/svjetionici.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionici.json").then(function(response) {
			//lista svjetionika
			deffered.resolve(response.data);
		})
        return deffered.promise;
	}

	function getDetails(svjetionikName){
		//console.log('getDetails ' + svjetionikName);
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		//get data
		//$http.get("json/svjetionici.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionici.json").then(function(response) {
			//lista svjetionika
			var svjetionici = response.data;
			//object svjetionik
			var svjetionik;
			
			//loop svjetionici i nadji svjetionikName
			for (var i = 0; i < svjetionici.length; i++) {
				if (svjetionici[i].name == svjetionikName) {
					svjetionik = svjetionici[i];
				}
			}
			deffered.resolve(svjetionik);
		})
        return deffered.promise;
	}
	
	function getPeopleOnLanterna(svjetionikName) {
		//console.log('svjetionik ' + svjetionikName);
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		//get data
		//$http.get("json/svjetionicari.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionicari.json").then(function(response) {
			//lista svih svjetionicara
			var allPeopleArray = response.data;
			//svjetionicari na svjetioniku array
			var peopleArray = [];
			
			//loop through all people
			for (var i = 0; i < allPeopleArray.length; i++) {
				//loop through karijera array for each person
				for (var j = 0; j < allPeopleArray[i].karijera.length; j++) {
					//check if person has svjetionik in karijera
					if (allPeopleArray[i].karijera[j].svjetionik === svjetionikName) {
						person = allPeopleArray[i];
						peopleArray.push(person);
					}
				}
			}
			deffered.resolve(peopleArray);
		})
        return deffered.promise;
	}

	function findByName(svjetionikName) {
		//console.log('in findByName ' + name);
		
		//async function to know when the data has arrived
		var deffered = $q.defer();

		//get data
		//$http.get("json/svjetionici.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionici.json").then(function(response) {
			//lista svih svjetionika
			var svjetionici = response.data;
			//svjetionicari filtrirano
			var svjetioniciFiltered = [];
			
			//u filtrirano idu oni koji zadovoljavaju uvjete sa ekrana (name)
			svjetioniciFiltered = svjetionici.filter(function(el) {
				return el.name.toLowerCase().indexOf(svjetionikName.toLowerCase()) > -1;
			});
			//console.log(svjetioniciFiltered);
			deffered.resolve(svjetioniciFiltered);
		})
        return deffered.promise;
    }
})

.factory('BibliotekaList', function($http, $q, serverUrl) {
	
	return {
		//sve knjige
		all: getAll,
		//get book details
		getDetails: getDetails
	}
	
	// handler functions
	function getAll() {
		//console.log('sve knjige');
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		// get data
		//$http.get("json/biblioteka.json").then(function(response) {
		$http.get(serverUrl + "/json/biblioteka.json").then(function(response) {
			//lista knjiga
			deffered.resolve(response.data);
		})
        return deffered.promise;
	}

	function getDetails(bookName){
		//console.log('getDetails ' + bookName);
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		//get data
		//$http.get("json/biblioteka.json").then(function(response) {
		$http.get(serverUrl + "/json/biblioteka.json").then(function(response) {
			//lista knjiga
			var books = response.data;
			//book object
			var book;
			
			//loop books
			for (var i = 0; i < books.length; i++) {
				if (books[i].name == bookName) {
					book = books[i];
				}
			}
			deffered.resolve(book);
		})
        return deffered.promise;
	}
});