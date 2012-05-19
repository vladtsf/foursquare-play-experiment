module.exports = (function() {
	var
		async = require('async'),
		url = require('url'),
		http = require('http');

	var City = function(lat, lon, rad) {
		this.rad = rad || 2e4;
		this.lat = lat || 55.6238846;
		this.lon = lon || 37.6044856;
	};

	City.categories = [
		'4bf58dd8d48988d184941735' // Stadium
	,	'4e39a891bd410d7aed40cbc2' // Tennis
	];

	City.decode = function(city_name, callback) {
		var addr = url.parse('http://geocode-maps.yandex.ru/1.x/?geocode=' + encodeURIComponent(city_name) + '&results=1&kind=locality&format=json');
		
		http.get(addr, function(res) {
			res.setEncoding('utf8');
			var data = '';
			res
				.on('data', function (chunk) {
					data += chunk;
				})
				.on('end', function() {
					if(typeof callback == 'function') {
						try {
							var
								dec = JSON.parse(data).response,
								pos = dec.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
							
							callback(pos.split(' '));
						} catch(e) {
							callback(false);
						}
					}
					
				});
		})	

	};

	City.prototype = {

		genURL: function(category_id) {
			return 'http://www.4sqmap.com/data/venues/search?query=&categoryId=' + category_id + '&ll=' + [this.lat, this.lon].join(',') + '&radius=' + this.rad;
		},

		getVenues: function(main_callback) {
			var reqs = [];

			City.categories.forEach(function(category_id, i) {
				var addr = url.parse(this.genURL(category_id));

				reqs.push(function(callback) {
					http.get(addr, function(res) {
						res.setEncoding('utf8');
						var data = '';
						res
							.on('data', function (chunk) {
								data += chunk;
							})
							.on('end', function() {
								callback(null, JSON.parse(data).response.venues);
							});
					})
				});
			}.bind(this));


			async.parallel(reqs,
				// optional callback
				function(err, results) {
					var venues = {};

					results.forEach(function(list) {
						list.forEach(function(venue) {
							venues[venue.id] = venue;
						})
					});

					main_callback(venues)
					// the results array will equal ['one','two'] even though
					// the second function had a shorter timeout.
				});

		}
	};




	return City;

})();