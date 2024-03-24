const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;


mongoose.connection.once('open', () => {
    console.log('mongoose conenction is ready');
  });
  
  mongoose.connection.on('error', (err) => {
    console.log('we have an error', err);
  });

  async function connectMongo() {
     await mongoose.connect(MONGO_URL)
  }

  module.exports = {
    connectMongo
  }