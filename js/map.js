var meetupURL = 'https://api.meetup.com/2/open_events?&sign=true&photo-host=public&lat=37.4347&state=CA&text=coding java python web&lon= -121.8950&radius=20&status=upcoming&page=20
&key=6ab5e2d3c46794b78504857152479b';

/*A Google Map object*/
var googleMap = function(center, element) {
	var self = this;
	var options = {
		zoom: 12,
		center: center
	}
	var map = new google.maps.Map(element, options);
	return map;
}


//Initial map
function initMap() {
	var element = document.getElementById('map');
	var center = {
		lat: 37.4347,
		lng: -121.8950
	}
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			center = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
		});
	}
	map = new googleMap(center, element);
}

function fetchData(url) {
	var data;
	var result;
	var res = $.ajax({
		url: url,
		type: 'GET',
		timeout: 5000,
		dataType: 'jsonp',
		cache: false
	});
	res.done(function(response)) {
		data = response.results;
		data.forEach(function(meetup)) {
			result.push(new Meetup(meetup));
		}
	}

	res.fail(function(response, status, error)) {
		//TODO handle this failure

	}
	return result;
}

//Create ViewModel
var ViewModel = function() {
	var self = this;
	var data = fetchData(meetupURL);
	var meetupArr = [];
	for(var meet: data) {
		meetupArr.push(new Meetup(meet));
	}
	self.meetups = ko.observableArray(meetupArr);
	self.search = function() {

	}

}
//TODO create Meetup class
var Meetup = function(meetup) {
	var self = this;
	self.venue = meetup.venue;
	self.hasVenue = self.venue ? true : false;
	self.id = meetup.id;
	self.name = meetup.name;
	self.url = meetup.envent_url;
}
ko.applyBindings(new ViewModel());



































