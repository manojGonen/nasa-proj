const { getAllPlanets } = require('../../model/planets.model');
 
 async function httpGetAllPlanets(req, res) {
    console.log('controller');
    return res.status(200).json(await getAllPlanets());
    // res.end("something");
}

module.exports = {
    httpGetAllPlanets
}