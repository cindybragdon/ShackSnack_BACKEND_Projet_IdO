import mongoose from "mongoose";
import { connectToMongoDatabase } from "../src/utils/mongo.connectToDatabase.js"
import FeedingLogsController  from "../src/controllers/feedingLog.controller.js"
import { config } from "../src/config/config.js"
import feedingLogsModel from "../src/models/mongo.model.feedinglogs.js"
import userMongoModel from "../src/models/mongo.model.user.js";

const feedingLogsController = new FeedingLogsController();
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


describe('<-- FEEDING LOGS CONTROLLER -->', () => {

    describe('<-- getFeedingLogsByUserId function -->', () => {

        let testID;
        let animalID;
        let deviceID;

        beforeEach(async () => {


            const testUser = new userMongoModel({ 
                firstname:"testFirstName", 
                lastname:"testLastName", 
                username:"Test", 
                email:"validationtest@gmail.com", 
                password:"testPassword", 
                role:"User"
            });

            const animal = {
                name:"chat1",
                type_animal:"chat",
                number_sec_treats:3,
                number_sec_food:1
            }


            const device = {
                name:"chat1",
                mac_adress:"00:00:ab:27:00"
            }


            testID = testUser._id;
            testUser.animals.push(animal);
            testUser.devices.push(device);
            const res = await testUser.save();

            
            animalID = res.animals[0]._id;

            deviceID = res.devices[0]._id;


            const testFeedingLogs = new feedingLogsModel({
                feeding_quantity:3,
                feeding_food_type:"Dry Food",
                feeding_date:"2024",
                userId:testID,
                animalId:animalID,
                deviceId:deviceID
            });
            await testFeedingLogs.save();
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
            await feedingLogsModel.deleteMany({});
        });
    
        test('Should work when there is data is the document', async () => {
            const req = mockRequest({id:testID},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.getFeedingLogsByUserId(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work when the feedingLog userID dont exist', async () => {
            await feedingLogsModel.deleteMany({});
            const req = mockRequest({id:testID},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.getFeedingLogsByUserId(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });



        test('Should not work when the id is not a mongoose object id', async () => {
            await userMongoModel.deleteMany({});
            const req = mockRequest({id:"i am not an id"},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.getFeedingLogsByUserId(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });



    });



    describe('<-- getFeedingLogsByAnimalId function -->', () => {

        let testID;
        let animalID;
        let deviceID;

        beforeEach(async () => {


            const testUser = new userMongoModel({ 
                firstname:"testFirstName", 
                lastname:"testLastName", 
                username:"Test", 
                email:"validationtest@gmail.com", 
                password:"testPassword", 
                role:"User"
            });

            const animal = {
                name:"chat1",
                type_animal:"chat",
                number_sec_treats:3,
                number_sec_food:1
            }


            const device = {
                name:"chat1",
                mac_adress:"00:00:ab:27:00"
            }


            testID = testUser._id;
            testUser.animals.push(animal);
            testUser.devices.push(device);
            const res = await testUser.save();

            
            animalID = res.animals[0]._id;

            deviceID = res.devices[0]._id;


            const testFeedingLogs = new feedingLogsModel({
                feeding_quantity:3,
                feeding_food_type:"Dry Food",
                feeding_date:"2024",
                userId:testID,
                animalId:animalID,
                deviceId:deviceID
            });
            await testFeedingLogs.save();
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
            await feedingLogsModel.deleteMany({});
        });
    
        test('Should work when there is data is the document', async () => {
            const req = mockRequest({animalId:animalID},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.getFeedingLogsByAnimalId(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work when the feedingLog animalId dont exist', async () => {
            await feedingLogsModel.deleteMany({});
            const req = mockRequest({animalId:animalID},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.getFeedingLogsByAnimalId(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });



        test('Should not work when the id is not a mongoose object id', async () => {
            await userMongoModel.deleteMany({});
            const req = mockRequest({animalId:"i am not an id"},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.getFeedingLogsByAnimalId(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    });





    describe('<-- createFeedingLog function -->', () => {

        let testID;
        let animalID;
        let deviceID;
        let testUser;
        let animal;
        let device;

        beforeEach(async () => {


            testUser = new userMongoModel({ 
                firstname:"testFirstName", 
                lastname:"testLastName", 
                username:"Test", 
                email:"validationtest@gmail.com", 
                password:"testPassword", 
                role:"User"
            });
            testUser.animals.remove()

            animal = {
                name:"chat1",
                type_animal:"chat",
                number_sec_treats:3,
                number_sec_food:1
            }


            device = {
                name:"chat1",
                mac_adress:"00:00:ab:27:00"
                
            }


            testID = testUser._id;
            testUser.animals.push(animal);
            testUser.devices.push(device);
            const res = await testUser.save();

            
            animalID = res.animals[0]._id;

            deviceID = res.devices[0]._id;


            const testFeedingLogs = new feedingLogsModel({
                feeding_quantity:3,
                feeding_food_type:"Dry Food",
                feeding_date:"2024",
                userId:testID,
                animalId:animalID,
                deviceId:deviceID
            });
            await testFeedingLogs.save();
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
            await feedingLogsModel.deleteMany({});
        });
    
        test('Should work when there is data is the document', async () => {
            const req = mockRequest({},{
                feeding_quantity:3,
                feeding_food_type:"Dry Food",
                feeding_date:"2024",
                userId:testID,
                animalId:animalID,
                deviceId:deviceID
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.createFeedingLog(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(201);
        });



        test('Should not work when the userId of the feedinglog dont exist', async () => {
            
            await userMongoModel.deleteMany({});
            const req = mockRequest({},{
                feeding_quantity:3,
                feeding_food_type:"Dry Food",
                feeding_date:"2024",
                userId:testID,
                animalId:animalID,
                deviceId:deviceID
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.createFeedingLog(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });



        test('Should not work when the animalId of the feedinglog dont exist', async () => {
            
            testUser.animals.remove(animal);
            await testUser.save();

            const req = mockRequest({},{
                feeding_quantity:3,
                feeding_food_type:"Dry Food",
                feeding_date:"2024",
                userId:testID,
                animalId:animalID,
                deviceId:deviceID
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.createFeedingLog(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });



        test('Should not work when the deviceId of the feedinglog dont exist', async () => {
            
            testUser.devices.remove(device);
            await testUser.save();
            
            const req = mockRequest({},{
                feeding_quantity:3,
                feeding_food_type:"Dry Food",
                feeding_date:"2024",
                userId:testID,
                animalId:animalID,
                deviceId:deviceID
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.createFeedingLog(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work when the deviceId, userId or animalId is not a mongoose objetct id', async () => {
            
            testUser.devices.remove(device);
            await testUser.save();
            
            const req = mockRequest({},{
                feeding_quantity:3,
                feeding_food_type:"Dry Food",
                feeding_date:"2024",
                userId:"ajhd",
                animalId:animalID,
                deviceId:deviceID
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await feedingLogsController.createFeedingLog(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    });
})
