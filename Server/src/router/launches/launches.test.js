const request = require('supertest');
const app = require('../../app')
const {connectMongo} = require('../../server/mongo');


describe('Lanunches', () => {
    beforeAll(async () => {
        await connectMongo();
    });

    describe('TEST GET /launches', () => {
        test('it should respond with status code 200', async() => {
            const response =  await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
            // console.log(response.get('/launches'),"---------<");
            // expect(response.status).tobe(200)
        });
    });
});


// describe('TEST POST/launches', () => {
//     test('', () => {

//     })
// });