const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {
    // to be used in POST test
    const testDogData = {
        breed: 'Poodle',
        name: 'Sasha',
        color: 'black',
        description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
    };
    
    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });
    describe('GET /dogs/:id', () => {
        it('should return a specific dog by id with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs/1');
            //console.log(response.body)
            
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body.id).toBeDefined();

            const foundDog = await Dog.findByPk(1)
            console.log(foundDog.name)
        
            // toEqual checks deep equality in objects
            expect(response.body.name).toBe(foundDog.name);
            //expect(response.body).toBe(foundDog);
        });
    });

    describe('POST /dogs', () => {
        it('should create a dog in the database', async () => {
            // make a request
            const response = await request(app).post('/dogs').send(testDogData);
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body).toEqual(expect.objectContaining(testDogData));
        });
    });
    describe('DELETE /dogs/:id', () => {
        it('should delete a dog by id in the database and return status 200', async () => {
            // make a request
            const response = await request(app).delete('/dogs/1')
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            const deletedDog = await Dog.findByPk(1);
            // console.log(deletedDog)
            // toEqual checks deep equality in objects
            expect(deletedDog).toBeNull();
        });
    });
});