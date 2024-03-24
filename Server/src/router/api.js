const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');


const api = express.Router();

console.log('API ROUTER');

api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);


module.exports = api;
