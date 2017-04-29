angular.module('lanterna.services', [])

.factory('SvjetionicariList', function($http, $q, serverUrl, svjetionicariFilePath, svjetioniciFilePath) {
	
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
		$http.get(serverUrl + svjetionicariFilePath).then(function(response) {
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
		$http.get(serverUrl + svjetionicariFilePath).then(function(response) {
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
	
	//!!!!!!!!!!!SAMO AKO SE SVI PODACI NALAZE U svjetionici.json!!!!!!!!!!
	function getLanternForPerson(personId) {
		//async function to know when the data has arrived
		var deffered = $q.defer();
				
		//get data
		$http.get(serverUrl + svjetioniciFilePath).then(function(response) {
			//svi svjetionici u json fileu
			var allLanterne = response.data;
			
			// svjetionici na kojima je bio svjetionicar(personId)
			var lanternArray = [];
			//loop through svi svjetionici array
			for (var i = 0; i < allLanterne.length; i++) {
				//create objects
				var lantern;
				var personDetails;
				
				//loop through svjetionicari array for each svjetionik
				for (var j = 0; j < allLanterne[i].svjetionicari.length; j++) {
					//set lantern
					lantern = {};
					
					//console.log('reset person details');
					//provjeri ako je svjetionicar bio na svjetioniku
					if (allLanterne[i].svjetionicari[j].id == parseInt(personId)) {
						//console.log(j);
						//console.log('prsndtls ', allLanterne[i].svjetionicari[j]);
						//object
						lantern.id = allLanterne[i].id;
						lantern.name = allLanterne[i].name;
						lantern.image = allLanterne[i].image;
						lantern.personDetails = allLanterne[i].svjetionicari[j];
						//console.log('lantern', lantern);
						// push into array
						lanternArray.push(lantern);
					}
				}
			}
			deffered.resolve(lanternArray);
		})
		return deffered.promise; 
	}
	
	function findByName(ime, prezime, mjesto, option) {
		console.log('in findByName ' + ime + ', ' + prezime + ', ' + mjesto + ', ' + option);
		
		//async function to know when the data has arrived
		var deffered = $q.defer();

		//get data
		$http.get(serverUrl + svjetionicariFilePath).then(function(response) {
			//svi svjetionicari
			var svjetionicari = response.data;
			//svjetionicari filtrirano
			var svjetionicariFiltered = [];
			
			//opcije kako je upisano na ekranu:
			//1 - uneseno ime i prezime, mjesto prazno
			//2 - uneseno samo ime, prezime i mjesto prazno
			//3 - uneseno samo prezime, ime i mjesto prazno
			//4 - uneseno samo mjesto, ime i prezime prazno
			//5 - uneseno prezime i mjesto, ime prazno
			//6 - uneseno ime i mjesto, prezime prazno
			//7 - uneseno ime, prezime i mjesto
			
			//u filtrirano idu oni koji zadovoljavaju uvjete sa ekrana (ime, prezime, mjesto)
			svjetionicariFiltered = svjetionicari.filter(function(el) {
				//console.log('filtering ' + svjetionikName.toUpperCase());
				if (option == 1) {
					return (el.ime.toLowerCase().indexOf(ime.toLowerCase()) > -1) && (el.prezime.toLowerCase().indexOf(prezime.toLowerCase()) > -1);
				}
				if (option == 2) {
					return el.ime.toLowerCase().indexOf(ime.toLowerCase()) > -1;
				}
				if (option == 3) {
					return el.prezime.toLowerCase().indexOf(prezime.toLowerCase()) > -1;
				}
				if (option == 4) {
					return el.mjesto.toLowerCase().indexOf(mjesto.toLowerCase()) > -1;
				}
				if (option == 5) {
					return (el.mjesto.toLowerCase().indexOf(mjesto.toLowerCase()) > -1) && (el.prezime.toLowerCase().indexOf(prezime.toLowerCase()) > -1);
				}
				if (option == 6) {
					return (el.ime.toLowerCase().indexOf(ime.toLowerCase()) > -1) && (el.mjesto.toLowerCase().indexOf(mjesto.toLowerCase()) > -1);
				}
				if (option == 7) {
					return (el.ime.toLowerCase().indexOf(ime.toLowerCase()) > -1) && (el.prezime.toLowerCase().indexOf(prezime.toLowerCase()) > -1) && (el.mjesto.toLowerCase().indexOf(mjesto.toLowerCase()) > -1);
				}
			});
			//console.log(svjetionicariFiltered);
			deffered.resolve(svjetionicariFiltered);
		})
        return deffered.promise;
    }
})

.factory('LanterneList', function($http, $q, serverUrl, svjetionicariFilePath, svjetioniciFilePath) {
	
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
		$http.get(serverUrl + svjetioniciFilePath).then(function(response) {
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
		$http.get(serverUrl + svjetioniciFilePath).then(function(response) {
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
		$http.get(serverUrl + svjetionicariFilePath).then(function(response) {
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
		$http.get(serverUrl + svjetioniciFilePath).then(function(response) {
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

.factory('BibliotekaList', function($http, $q, serverUrl, bibliotekaFilePath) {
	
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
		$http.get(serverUrl + bibliotekaFilePath).then(function(response) {
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
		$http.get(serverUrl + bibliotekaFilePath).then(function(response) {
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