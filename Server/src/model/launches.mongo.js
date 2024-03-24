const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
        default: 100
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    lauchDate: {
        type: Date,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    customers: [String],
    upcoming: {
        type: Boolean,
        required: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }
});

//Mongoose model connects the launchSchema with the launches colection.

module.exports = mongoose.model('Launch', launchesSchema);

