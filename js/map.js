var map;
function initMap(){
	var options = {
		zoom : 8,
		center: {
			lat: -34.397,
			lng: 150.644
		}
	}
	var self = this;
	map = new google.maps.Map(document.getElementById('map'), options);
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			map.setCenter(pos);
		});
	}
}