import mongoose from "mongoose";
import { connectToMongoDatabase } from "../src/utils/mongo.connectToDatabase.js"
import UserController  from "../src/controllers/user.controller.js"
import { config } from "../src/config/config.js"
import userMongoModel from "../src/models/mongo.model.user.js"
//https://basarat.gitbook.io/typescript/intro-1/jest
const userController = new UserController();

//Create false response 
const mockResponse = ()  => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

//Create false request
const mockRequest = (params, data) => ({ params:params, body: data });

//Connect to mongo Database before all
beforeAll(async () => {
    await connectToMongoDatabase(config.DB_TEST_IDO_PROJET);
});

//After all tests, disconnect from database
afterAll(async () => {
    await mongoose.disconnect();
});


describe('<-- USER CONTROLLER -->', () => {

    describe('<-- getAllUsers function -->', () => {

        beforeEach(async () => {
            const testUser = new userMongoModel({ firstname:"testFirstName", lastname:"testLastName", username:"Test", email:"test@gmail.com", password:"testPassword", role:"User"});
            await testUser.save();
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    
        test('Should work when there is data is the document', async () => {
            const req = mockRequest();
            const res = mockResponse();
    
            await userController.getAllUsers(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work when there is no data is the document', async () => {

            await userMongoModel.collection.drop();
            const req = mockRequest({},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.getAllUsers(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });



    describe('<-- getUserById function -->', () => {


        let testID;
        beforeEach(async () => {
            const testUser = new userMongoModel({ firstname:"testFirstName", lastname:"testLastName", username:"Test", email:"test@gmail.com", password:"testPassword", role:"User"});
            testID = testUser._id;
            await testUser.save();
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    
        test('Should work when there is data is the document', async () => {
            const req = mockRequest({id:testID},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.getUserById(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work when there is no data is the document', async () => {

            await userMongoModel.collection.drop();
            const req = mockRequest({id:testID},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.getUserById(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work when the params id is not a mongoose objectID', async () => {

            const req = mockRequest({id:"aiklplsd"},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.getUserById(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });

    describe('<-- createUser FUNCTION -->', () => {

        beforeEach(async () => {
            const testUser = new userMongoModel({ firstname:"testFirstName", lastname:"testLastName", username:"Test", email:"test@gmail.com", password:"testPassword", role:"User"});
            await testUser.save();
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    
        test('Should work with valid inputs', async () => {
            const req = mockRequest({},{ firstname:"testFirstName", lastname:"testLastName", username:"Stephane", email:"steph@gmail.com", password:"IAmStephane", role:"User" });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.createUser(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(201);
        });


        test('Should not work without the password and other missing fields', async () => {
            const req = mockRequest({},{ firstname:"testFirstName", lastname:"testLastName", username:"Stephane", email:"steph@gmail.com", role:"User" });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.createUser(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work if the email and other fileds are missing', async () => {
            const req = mockRequest({},{ username:"Stephane", email:"test@gmail.com", password:"IAmStephane", role:"User" });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.createUser(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });


    describe('<-- updateUser FUNCTION -->', () => {

        let testID;
        beforeEach(async () => {
            const testUser = new userMongoModel({ firstname:"testFirstName", lastname:"testLastName", username:"Test", email:"test@gmail.com", password:"testPassword", role:"User"});
            testID = testUser._id;
            await testUser.save();
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    
        test('Should work with valid inputs', async () => {
            const req = mockRequest({id:testID},{ firstname:"testFirstName", lastname:"testLastName", username:"Stephane", email:"steph@gmail.com", password:"IAmStephane", role:"User" });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.updateUser(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work if the params id is not a valid mongoose object id', async () => {
            const req = mockRequest({id:"ajdjjd"},{ firstname:"testFirstName", lastname:"testLastName", username:"Stephane", email:"steph@gmail.com", role:"User" });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.updateUser(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work if the user doesnt exist', async () => {
            await userMongoModel.deleteMany({});
            const req = mockRequest({id:testID},{ firstname:"testFirstName", lastname:"testLastName", username:"Stephane", email:"steph@gmail.com", password:"IAmStephane", role:"User" });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.updateUser(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });


    describe('<-- deleteUser FUNCTION -->', () => {

        let testID;
        beforeEach(async () => {
            const testUser = new userMongoModel({ firstname:"testFirstName", lastname:"testLastName", username:"Test", email:"test@gmail.com", password:"testPassword", role:"User"});
            testID = testUser._id;
            await testUser.save();
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    
        test('Should work with valid inputs', async () => {
            const req = mockRequest({id:testID},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.deleteUser(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work if the params ID is not a mongoose objet id', async () => {
            const req = mockRequest({id:"akskkdkdk"},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.deleteUser(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work if the user doesnt exist', async () => {
            await userMongoModel.deleteMany({});
            const req = mockRequest({id:testID},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.deleteUser(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });


})
