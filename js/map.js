var meetupURL = 'https://api.meetup.com/2/open_events?&sign=true&photo-host=public&lat=37.4347&state=CA&text=coding java python web&lon= -121.8950&radius=20&status=upcoming&page=20&key=6ab5e2d3c46794b78504857152479b';
var map;
/*A Google Map object*/
var googleMap = function(center, element) {
	var self = this;
	var options = {
		zoom: 12,
		center: center
	}
	var gmap = new google.maps.Map(element, options);
	return gmap;
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
	map = googleMap(center, element);
}


//Create ViewModel
var ViewModel = function() {
	var self = this;
	self.meetups = ko.observableArray([]);
	fetchData(meetupURL);
	self.search = function() {

	}

	function fetchData(url) {
		var data;
		var res = $.ajax({
			url: url,
			type: 'GET',
			timeout: 5000,
			dataType: 'jsonp',
			cache: false
		});
		res.done(function(response) {
			data = response.results;
			data.forEach(function(meetup) {
				var newMeet = new Meetup(meetup, map);
				self.meetups.push(newMeet);
			});
		});

		res.fail(function(response, status, error) {
		//TODO handle this failure
		});
	}
	google.maps.event.addDomListener(window, 'load', initMap());


}
//create Meetup class
var Meetup = function(meetup, map) {
	var self = this;
	self.venue = meetup.venue;
	self.hasVenue = self.venue ? true : false;
	self.id = meetup.id;
	self.name = meetup.name;
	self.url = meetup.envent_url;
	self.lat = 0;
	self.lng = 0;
	if(self.hasVenue) {
		if(self.venue.lat) {
			self.lat = self.venue.lat;
		}

		if(self.venue.lon) {
			self.lng = self.venue.lon;
		}
	}
	self.location = (self.lat === 0 || self.lng === 0) ? null : new google.maps.LatLng(self.lat, self.lng);
	if(self.location) {
		var marker = new google.maps.Marker({
			position: self.location,
			map: map
		});
	}
}
ko.applyBindings(new ViewModel());

//Add































