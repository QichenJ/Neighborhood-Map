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
			self.positions().forEach(function(position) {
				google.maps.event.addListener(position.marker, 'click', function() {
					self.selectPos(position);
				});
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
	var infowindow = new google.maps.InfoWindow();
	self.selectPos = function (position) {
		if(position.marker.getAnimation() !== null) {
			position.marker.setAnimation(null);
		} else {
			position.marker.setAnimation(google.maps.Animation.BOUNCE);
		}
		map.panTo(position.location);
		infowindow.setContent(position.string());
		infowindow.open(map, position.marker);
		self.positions().forEach(function(temp) {
			if(temp != position) {
				temp.marker.setAnimation(null);
			}
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
	self.url = meetup.event_url;
	self.time = meetup.time;
	self.count = meetup.headcount;
	self.headcount = meetup.headcount;
}
ko.applyBindings(new ViewModel());

//create Position class
var Position = function(venue, map) {
	var self = this;
	self.id = venue.id;
	self.lon = venue.lon;
	self.lat = venue.lat;
	self.location = new google.maps.LatLng(self.lat, self.lon);
	self.address = venue.address_1;
	self.meetups = ko.observableArray([]);
	self.name = venue.name;
	self.length = ko.computed(function() {
		return self.meetups().length;
	});
	self.add = function(meetup) {
		self.meetups.push(meetup);
	}
	self.string = ko.computed(function() {
		var result = '<ul class="info-window-list">';
		self.meetups().forEach(function(meetup) {
			result += '<li>' + '<a href="' + meetup.url + '">' + meetup.name  +
			'</a>' + ' on ' + meetup.date + '</li>';
		});
		result += '</ul>';
		result = '<div class="info-window">' + '<span class="info-header">' +
		self.name + '</span>' + '<p>' + self.address + '</p>' + result +
		'</div>';
		return result;
	});
	self.marker = new google.maps.Marker({
		position: self.location,
		map: map,
		animation: google.maps.Animation.DROP
	});
}