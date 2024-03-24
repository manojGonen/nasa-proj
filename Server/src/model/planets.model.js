// let planets = []
// console.log("from model")

const {parse} = require('csv-parse');

const planets = require('./planets.mongo');

const path = require('path')

const fs = require('fs')
// const { resolve, dirname } = require('path')

// const stream = fs.createReadStream('Kepler_data.csv')

function isHabitable(planet){
    // console.log(planet)
    // console.log(planet['koi_disposition'], planet['koi_insol'], planet['koi_insol'], planet['koi_prad'] )
    // setTimeout(() => {
        return planet['koi_disposition'] === 'CONFIRMED' && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
    // }, 1000)
    
}
// note: we need to wait for the stream to be parsed as streams are async.
//  so we use promises here to wiat for the process to be complete thereby making sure we dont end an empty array
console.log("get habitable planets 1")

function getHabitablePlanets() {
    console.log("get habitable planets 2")
   return new Promise((resolve, reject) => {
    // setTimeout(() => {
    
    console.log("get habitable planets 3")
        fs.createReadStream(path.join(__dirname, '..', 'Data', 'Kepler_data.csv'))
        .pipe(parse({
            comment:'#',
            columns :true  
        }))
        .on('data', async (data)=>{
            if(isHabitable(data)) {
                // habitablePlanets.push(data)
                savePlanets(data)
                // console.log("habiable planets are **** ", habitablePlanets)
            } 
        })
        .on('error',(error)=>{
            console.log(error)
            reject(error)
        })
        .on('end',async() => {
            // console.log(habitablePlanets.map(planet=>{
            //     return planet['kepler_name']
            // }))
            // console.log(`${habitablePlanets.length} are habitable planets!!`)
            console.log('end is here');
            console.log("The number of habitable planets are", (await getAllPlanets()).length);
            // console.log(habitablePlanets)
            // setTimeout(() => {
                resolve();
            // }, 3000)
            
        })
    // }, 10000)
      })
}

// stream.on('data', (data)=>{
//     console.log(data)
// })
// .on('end',()=>{
//     console.log('end is here')
// })

async function getAllPlanets() {
    // return habitablePlanets;
    return await planets.find({}, {
        '_id' : 0, '__v': 0
    });
}

async function savePlanets (planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        },{
            upsert: true
        }
        );
    } catch(err) {
        console.log('could not save planet', err);
    }
     
}

module.exports ={ 
    getAllPlanets,
    getHabitablePlanets
 }