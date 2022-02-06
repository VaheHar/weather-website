const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
	const url = 'http://api.weatherstack.com/current?access_key=5000b632b35c99e6ba101302ea34dd28&query=' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude);

	request({ url, json: true}, (error, response) => {
		if (error) {
			callback('Unable to connect to forecast services!');
		} else if (response.body.error) {
			callback('Unable to find location. Try another search.')
		} else {
			callback('', response.body.current);
		}
	})
}

module.exports = forecast;