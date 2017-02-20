angular.module('lanterna.services', [])

.factory('SvjetionicariList', function($http, $q, serverUrl) {
	
	return {
		// svi svjetionicari
		all: getAllPeople,
		// detalji o svjetionicaru
		getPerson: getPerson,
		// lista svjetionika na kojem je svetionicar bio
		getLanternForPerson: getLanternForPerson
		// find by name
		//find: findByName
	}
	
	/*var svjetionicariArray = $resource('json/svjetionicari.json',
		{ format: 'json', jsoncallback: 'JSON_CALLBACK' },
		{ 'load': { 'method': 'JSONP' } }
	);*/
	
	// handler functions
	function getAllPeople() {
		//console.log('svi svjetionicari');
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		// get data
		//$http.get("json/svjetionicari.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionicari.json").then(function(response) {
			//console.log(response.data);
			deffered.resolve(response.data);
		})
        return deffered.promise;
	}

	function getPerson(personId) {
		console.log('person ' + personId);
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		//get data
		//$http.get("json/svjetionicari.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionicari.json").then(function(response) {
			//console.log(response.data);
			var people = response.data;
			var person;
			for (var i = 0; i < people.length; i++) {
				//console.log(people[i]);
				if (people[i].id === parseInt(personId)) {
					console.log(people[i]);
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
			// svjetionici na kojima je bio personId
			var lanternArray = [];
			//loop through svi svjetionici array
			for (var i = 0; i < allLanterne.length; i++) {
				//console.log(allLanterne[i]);
				var lantern = {};
				var personDetails;
				//loop through svjetionicari array for each svjetionik
				for (var j = 0; j < allLanterne[i].svjetionicari.length; j++) {
					//console.log(allLanterne[i].svjetionicari[j]);
					// provjeri ako je svjetionicar bio na svjetioniku
					if (allLanterne[i].svjetionicari[j].id == parseInt(personId)) {
						//console.log(allLanterne[i].svjetionicari[j]);
						//create object
						lantern.id = allLanterne[i].id;
						lantern.name = allLanterne[i].name;
						lantern.image = allLanterne[i].image;
						lantern.personDetails = allLanterne[i].svjetionicari[j];
						//console.log(lantern);
						// push into array
						lanternArray.push(lantern);
					}
				}
			}
			deffered.resolve(lanternArray);
		})
		return deffered.promise; 
	}
	
	function findByName(name) {
		console.log('in findByName ', name);
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		console.log(svjetionicariArray);
		/*svjetionicariArray.load({
			tags: name
		}, function(response) {
			//console.log(response.data);
			deffered.resolve(response.data);
		}, function(err) {
			deffered.reject(err);
		})*/
		
        return deffered.promise;
		
    }
})

.factory('LanterneList', function($http, $q, serverUrl) {
	return {
		// svi svjetionici
		all: getAll,
		// detalji o svjetioniku
		getDetails: getDetails,
		// lista svjetionicara koji su bili na svjetioniku
		getPeopleOnLanterna: getPeopleOnLanterna
	}
	
	function getAll() {
		//console.log('svi svjetionici');
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		// get data
		//$http.get("json/svjetionici.json").then(function(response) {
		$http.get(serverUrl + "/json/svjetionici.json").then(function(response) {
			//console.log(response.data);
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
			//console.log(response.data);
			var svjetionici = response.data;
			var svjetionik;
			for (var i = 0; i < svjetionici.length; i++) {
				//console.log(svjetionici[i].name);
				if (svjetionici[i].name == svjetionikName) {
					svjetionik = svjetionici[i];
					//return person;
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
			//console.log(response.data);
			var allPeopleArray = response.data;
			// svjetionicari na svjetioniku array
			var peopleArray = [];
			//loop thorugh all people
			for (var i = 0; i < allPeopleArray.length; i++) {
				//console.log(allPeopleArray[i].karijera);
				//loop through karijera array for each person
				for (var j = 0; j < allPeopleArray[i].karijera.length; j++) {
					//console.log(allPeopleArray[i].karijera[j]);
					// check if person has svjetionik in karijera
					if (allPeopleArray[i].karijera[j].svjetionik === svjetionikName) {
						person = allPeopleArray[i];
						peopleArray.push(person);
						//return person;
					}
				}
			}
			deffered.resolve(peopleArray);
		})
        return deffered.promise;
	}
})

.factory('BibliotekaList', function($http, $q, serverUrl) {
	
	return {
		// sve knjige
		all: getAll,
		// get details
		getDetails: getDetails
	}
	
	// handler functions
	function getAll() {
		console.log('sve knjige');
		
		//async function to know when the data has arrived
		var deffered = $q.defer();
		
		// get data
		//$http.get("json/biblioteka.json").then(function(response) {
		$http.get(serverUrl + "/json/biblioteka.json").then(function(response) {
			//console.log(response.data);
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
			//console.log(response.data);
			var books = response.data;
			var book;
			for (var i = 0; i < books.length; i++) {
				//console.log(books[i].name);
				if (books[i].name == bookName) {
					book = books[i];
					//return person;
				}
			}
			deffered.resolve(book);
		})
        return deffered.promise;
	}
});
