// Nodejs Modules
const path = require('path')

// Express
const express = require('express')

// Personal Modules
const routes = require('./routes/index')

// Setting the App and the Port 
const app = express();
const port = 5000;

// Making the App listen for requests
app.listen(port, () => console.log(`server listening at port: ${port}`));

// Setting the views
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Reading urlencoded files
app.use(express.urlencoded({ extended: true }))

// Using routes
routes(app)



