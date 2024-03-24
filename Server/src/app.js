const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./router/planets/planets.router');
const launchesRouter = require('./router/launches/launches.router');

// const api = require('./router/api')

const app = express();

app.use(cors({origin: 'http://localhost:3000'}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/v1/planets', planetsRouter);
app.use('/v1/launches', launchesRouter);
// api.use('/v1', api); // check why this is approach is not working
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app
