var
	City = require('../lib/city');


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Places' })
};

exports.decode = function(req, res) {
	var city = req.param('city');

	if(!city) {
		res.redirect('/');
	} else if (city) {
		City.decode(city, function(pos) {
			if(pos) {
				res.redirect('/city/' + [pos[1], pos[0]].join(',') + '/');
			} else {
				res.send(404);
			}
		})
	}
}

exports.city = function(req, res){
	var 
		lat = req.route.params[0],
		lon = req.route.params[1],
		rad = req.route.params[2] || false;

	var city = new City(lat, lon, rad);

	city.getVenues(function(venues) {
		res.render('city', {title: 'Places | City', venues: venues});
	});
};