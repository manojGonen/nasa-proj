const express = require('express');

const planetsRouter = express.Router();

const {httpGetAllPlanets} = require('./planets.controller');

console.log('planets router');
planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;
