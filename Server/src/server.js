const http = require('http');
require('dotenv').config();

const {connectMongo } = require('./server/mongo');

const {getHabitablePlanets} = require('./model/planets.model');
const {loadLaunchData} = require('./model/launches.model');

const port = process.env.PORT || 8000;

const app = require('./app');

const server = http.createServer(app);

listenServer();

async function listenServer() {
  await connectMongo();
  await getHabitablePlanets();
  // await loadLaunchData();
    server.listen(port, () => {
        console.log(`hey listeneing on ${port}`)
    });
}

