import request from 'supertest';
import jwt from 'jsonwebtoken';
import { server, app } from '../src/index.js';
import { config } from '../src/config/config.js';
import mongoose from 'mongoose';
import userMongoModel from '../src/models/mongo.model.user.js';
import { connectToMongoDatabase } from '../src/utils/mongo.connectToDatabase.js';

// Mock JWT generation for testing purposes
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

describe('User Routes', () => {
    let adminToken, userToken;

    const userId = new mongoose.Types.ObjectId();

    const adminId = new mongoose.Types.ObjectId();

    beforeAll(async ()  =>  {
        // Generate mock tokens for testing

        adminToken = generateToken({ id: adminId, role: 'Admin' });
        userToken = generateToken({ id: userId, role: 'User' });
    });

    afterEach(async () => {
        await userMongoModel.deleteMany({});
    });

    describe('GET /users', () => {
        it('should return 403 if not an admin', async () => {
            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${userToken}`);
        
            console.log('Response body:', res.body); // Debug output
        
            expect(res.statusCode).toBe(403);
            expect(res.body).toEqual({
                message: "You are not permitted to access this information",
            });
        });
        
        

        it('should return a list of users for admin', async () => {

            // Create a user in the database
            await userMongoModel.create({
                _id: userId,
                firstname: "Test",
                lastname: "User",
                username: "testuser",
                email: "testuser@gmail.com",
                password: "password123",
                role: "User"
            });

            const res = await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /users/:id', () => {
        it('should return user details for valid user with permission', async () => {
           
        
            // Create a user in the database
            await userMongoModel.create({
                _id: userId,
                firstname: "Test",
                lastname: "User",
                username: "testuser",
                email: "testuser@gmail.com",
                password: "password123",
                role: "User"
            });
        
            // Perform the GET request
            const res = await request(app)
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${userToken}`);
        
            // Verify the response
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('_id', userId.toString());
        });

        it('should return 403 if user lacks permission to view another user', async () => {
            const res = await request(app)
                .get('/users/user2')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
        });
    });

    describe('POST /users', () => {
        it('should return 403 if a regular user tries to create a user', async () => {
            const res = await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${userToken}`)
                .send({     
                    _id: userId,
                    firstname: "Test",
                    lastname: "User",
                    username: "testuser",
                    email: "testuser@gmail.com",
                    password: "password123",
                    role: "User"});

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe('You are not permitted to access this information');
        });

        it('should create a new user if admin', async () => {
            const res = await request(app)
                .post('/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({                   
                    _id: userId,
                    firstname: "Test",
                    lastname: "User",
                    username: "testuser",
                    email: "testuser@gmail.com",
                    password: "password123",
                    role: "User"});

            expect(res.statusCode).toBe(201);
            expect(res.body.username).toBe('testuser');
        });
    });

    describe('PUT /users/:id', () => {
        it('should update user details if user has permission', async () => {
            
        
            // Create a user in the database
            await userMongoModel.create({
                _id: userId,
                firstname: "Test",
                lastname: "User",
                username: "testuser",
                email: "testuser@gmail.com",
                password: "password123",
                role: "User"
            });
        
            // Perform the PUT request
            const res = await request(app)
                .put(`/users/${userId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ username: 'updatedUser' });
        
            // Verify the response
            expect(res.statusCode).toBe(200);
            expect(res.body.username).toBe('updatedUser');
        });

        it('should return 403 if user tries to update another user without permission', async () => {
            const res = await request(app)
                .put('/users/user2')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ username: 'hackAttempt' });

            expect(res.statusCode).toBe(403);
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete the user if user has permission', async () => {

        
            // Create a user in the database
            await userMongoModel.create({
                _id: userId,
                firstname: "Test",
                lastname: "User",
                username: "testuser",
                email: "testuser2@gmail.com",
                password: "password123",
                role: "User"
            });
        
            // Perform the DELETE request
            const res = await request(app)
                .delete(`/users/${userId}`)
                .set('Authorization', `Bearer ${userToken}`);
        
            // Verify the response
            expect(res.statusCode).toBe(204);
        });

        it('should return 403 if user tries to delete another user without permission', async () => {
            const res = await request(app)
                .delete('/users/user2')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(403);
        });
    });
});
