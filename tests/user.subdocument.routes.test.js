import request from 'supertest';
import mongoose from 'mongoose';
import { server, app } from '../src/index.js';
import userMongoModel from '../src/models/mongo.model.user.js';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/config.js';
import { connectToMongoDatabase } from '../src/utils/mongo.connectToDatabase.js';

// Helper to generate JWT tokens
function generateToken(payload) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
}

//Connect to mongo Database before all
beforeAll(async () => {
    await connectToMongoDatabase(config.DB_TEST_IDO_PROJET);
});

//After all tests, disconnect from database
afterAll(async () => {
    await mongoose.disconnect();
    server.close();
});


describe('User Subdocuments Routes (Animals)', () => {
    let userToken;
    let userId = new mongoose.Types.ObjectId();
    let animalId = new mongoose.Types.ObjectId();

    beforeAll(async () => {
        // Generate a test JWT token
        userToken = generateToken({ id: userId, role: 'User' });


        await userMongoModel.create({
            _id: userId,
            firstname: "Test",
            lastname: "User",
            username: "testuser",
            email: "testuser@gmail.com",
            password: "password123",
            role: "User",
            animals: [
                {
                    _id: animalId,
                    name: "Test Animal",
                    nickname: "Testy",
                    type_animal: "Cat",
                    weight: 4.5,
                    number_sec_treats: 2,
                    number_sec_food: 3
                }
            ]
        });
    });

    afterAll(async () => {
        // Clean up the database after all tests
        await userMongoModel.deleteMany({});
    });

    it('should return all animals for a valid user with permissions', async () => {
        const res = await request(app)
            .get(`/users/${userId}/animals`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('name', 'Test Animal');
    });

    it('should return a specific animal by ID', async () => {
        const res = await request(app)
            .get(`/users/${userId}/animals/${animalId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('_id', animalId.toString());
        expect(res.body).toHaveProperty('name', 'Test Animal');
    });

    it('should create a new animal if user has permission', async () => {
        const res = await request(app)
            .post(`/users/${userId}/animals`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'New Animal',
                type_animal: 'Dog',
                weight: 12,
                number_sec_treats: 1,
                number_sec_food: 2
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.animals.some(animal => animal.name === 'New Animal')).toBe(true);
    });

    it('should update an animal if user has permission', async () => {
        const res = await request(app)
            .put(`/users/${userId}/animals/${animalId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Updated Animal' });

        expect(res.statusCode).toBe(200);
        expect(res.body.animals.some(animal => animal.name === 'Updated Animal')).toBe(true);
    });

    it('should delete an animal if user has permission', async () => {
        const res = await request(app)
            .delete(`/users/${userId}/animals/${animalId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toBe(204);

        // Verify that the animal was deleted
        const user = await userMongoModel.findById(userId);
        expect(user.animals.id(animalId)).toBeNull();
    });
});
