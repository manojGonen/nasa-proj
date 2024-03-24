const {getAllLaunches, setNewLaunch, isLaunchExists, abortLaunch} = require('../../model/launches.model');

const {pagination} = require('../../server/query');

async function httpGetAllLaunches(req, res) {
    const {skip, limit} = pagination(req.query);
    const launches = await getAllLaunches(skip, limit);
     res.status(200).json(launches);
};

function httpAddNewLaunches(req, res) {
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return res.status(400).json({
            error: 'missing required launch property'
        })
    }

    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(new Date(launch.launchDate))) {
        return res.status(400).json({
            error: 'invalid Date'
        })
    }

    setNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const isLaunchExist = await isLaunchExists(launchId)
    if(!isLaunchExist){
        return res.status(400).json({
            error: 'launch id does not exist'
        })
    } 
       const abortedLaunch =  await abortLaunch(launchId)

       if(!abortedLaunch){
            return res.status(400).json({ error: 'abort failed'})
       }
       return res.status(200).json({ok: true})
}

module.exports ={
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunch
} ;