const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
	res.render('index', {
		title: 'Dynamic Title',
		name: 'No need to know'
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'Vahe'
	})
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help Me Please',
	})
});

app.get('/help/*', (req, res) => {
	res.render('notFound', {
		title: 'Help article not found.'
	})
});

app.get('/weather', (req, res) => {
	if (!req.query.address)
		return res.send({
			error: "You must provide an address"
		});
	
	geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
		if (error) {
			return res.send({
				error
			});
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({
					error
				});
			}

			res.send({
				location,
				forecastData
			});
		})
	})
})

app.get('/products', (req, res) => {
	if (!req.query.search)
		return res.send({
			errorMessage: 'You must provide a search term'
		})
	
	res.send({
		products: []
	})
})

app.get('*', (req, res) => {
	res.render('notFound', {
		title: 'Not found'
	})
});

app.listen(3000, () => {
	console.log('Server is up on port 3000');
});