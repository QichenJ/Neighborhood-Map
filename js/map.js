var meetupURL = 'https://api.meetup.com/2/open_events?&sign=true&photo-host=public&zip=95035&text=coding java python c c++&radius=20&status=upcoming&page=50&key=6ab5e2d3c46794b78504857152479b';
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
	self.positions = ko.observableArray([]);
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
				addMeetup(newMeet);
			});
		});

		res.fail(function(response, status, error) {
		//TODO handle this failure
		});
	}

	function addMeetup(meetup) {
		if(meetup.hasVenue && meetup.venue.lat && meetup.venue.lon) {
			var pos;
			self.positions().forEach(function(position) {
				if(position.id === meetup.venue.id) {
					pos = position;
					return;
				}
			});
			if(pos == null) {
				pos = new Position(meetup.venue, map);
				self.positions.push(pos);
			}
			pos.add(meetup);
		}
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
	self.time = meetup.time;
	self.count = meetup.headcount;
	self.headcount = meetup.headcount;
	self.location = new google.maps.LatLng(self.lon, self.lat);
		var marker = new google.maps.Marker({
		position: self.location,
		map: map
	});



}
ko.applyBindings(new ViewModel());

//create Position class
var Position = function(venue, map) {
	var self = this;
	self.id = venue.id;
	self.lon = venue.lon;
	self.lat = venue.lat;
	self.location = new google.maps.LatLng(self.lon, self.lat);
	self.address = venue.address_1;
	self.meetups = ko.observableArray([]);
	self.add = function(meetup) {
		self.meetups.push(meetup);
	}
	var marker = new google.maps.Marker({
		position: self.location,
		map: map
	});

}































