const launchesDatabase = require('./launches.mongo');
const planetDatabase = require('./planets.mongo');
const axios = require('axios');

// const launch = {
//     flightNumber: 100,
//     mission: 'kep',
//     rocket: 'pokemon',
//     lauchDate: new Date('December 27, 2030'),
//     target: 'Kepler-1652 b',
//     customer: ['NASA'],
//     upcoming: true,
//     success: true
// };

const DEFAULT_FLIGHT_NUMBER = 100;
// const launches = new map();
// launches.set(launch.flightNumber, launch);

async function getAllLaunches(skip, limit) {
    // return Array.from(launches.values());
   return await launchesDatabase.find({}, {
        '_id': 0,
        '__v': 0
    })
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit)
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
    const responce = await axios.post(SPACEX_API_URL, {
        query : {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        "name": 1
                    },
                    path: "payloads",
                    select: {
                        "customers": 1
                    }
                }
            ]
        }
    })

    if(responce !== 200) {
        console.log('unable to dowload launch data');
        throw new Error('launch data download failed')
    }

    const launchDocs = responce.data.docs;
    for(let launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        }
        // console.log(`${launch.flightNumber} ${launch.mission}`)
        await saveLaunch(launch);
    }
}

async function loadLaunchData () {
    console.log('load Launch data')
    const isLaunchExists = await findLaunch({
        flightNumber: 1,
        // rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if(isLaunchExists) {
        console.log('LaunchData already exists');
    } else {
        await populateLaunches()
    }
}

async function getLatestFlightNumber() {
    const latestFlight = await launchesDatabase
    .findOne()
    .sort('-flightNumber');
    console.log('latest nuber rea -> ', latestFlight);
    if(!latestFlight) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    
    return latestFlight.flightNumber;
}

async function f(launch) {
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

async function setNewLaunch(launch) {
    const planet = await planetDatabase.findOne({
        keplerName: launch.target
    });

    if(!planet) {
        throw new Error('Invalid planet found');
    }

    const latestFlightNumber = await getLatestFlightNumber() + 1;
    console.log('latestFlign--> ', latestFlightNumber)
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['kenshin', 'saito'],
        flightNumber: latestFlightNumber
    });
    
    await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function isLaunchExists(launchId) {
    // return launches.has(launchId);
    return await findLaunch({
        flightNumber: launchId
    });
}

async function abortLaunch(launchId) {
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;

    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming : false,
        success : false
    });
    console.log('aborted', aborted)
console.log('abort ok', aborted.acknowledged)
console.log('abort.modeify', aborted.nModified)
    return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

//thsi method was creating before persisting daat in DB
// function setNewLaunch(launch) {
//     latestFlightNr++;
//     launches.set(latestFlightNr, Object.assign(
//         launch, 
//         {
//             flightNumber: latestFlightNr,
//             customer: ['NASA, ISRO'],
//             upcoming: true,
//             success: true
//         }
//         ));
// }

module.exports = {
    loadLaunchData,
    getAllLaunches,
    setNewLaunch,
    isLaunchExists,
    abortLaunch
};