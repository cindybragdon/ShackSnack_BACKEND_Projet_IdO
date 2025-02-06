import mongoose from "mongoose";
import { connectToMongoDatabase } from "../src/utils/mongo.connectToDatabase.js"
import UserController  from "../src/controllers/user.controller.js"
import { config } from "../src/config/config.js"
import userMongoModel from "../src/models/mongo.model.user.js"


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
    
            expect(res.status).toHaveBeenCalledWith(204);
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



    
    describe('<-- getAllSubdocuments function -->', () => {


        let testID;
        beforeEach(async () => {
            const testUser = new userMongoModel({ 
                firstname:"testFirstName", 
                lastname:"testLastName", 
                username:"Test", 
                email:"test@gmail.com", 
                password:"testPassword", 
                role:"User", animals:[{
                    name:"chat1",
                    type_animal:"chat",
                    number_sec_treats:3,
                    number_sec_food:1
                }]});
            testID = testUser._id;
            await testUser.save();
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    
        test('Should work when there is valid data is the document', async () => {
            const req = mockRequest({id:testID, subdocument:"animals"},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.getAllSubdocuments(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work when there is no data is the document', async () => {

            await userMongoModel.collection.drop();
            const req = mockRequest({id:testID, subdocument:"animals"},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.getAllSubdocuments(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work when the params id is not a mongoose objectID or the subdocument name doesnt exist', async () => {

            const req = mockRequest({id:"aiklplsd",subdocument:"carrots"},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.getAllSubdocuments(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });



    describe('<-- getSubdocumentById function -->', () => {


        let testID;
        let subdocId;
        
        beforeEach(async () => {
            const testUser = new userMongoModel({ 
                firstname:"testFirstName", 
                lastname:"testLastName", 
                username:"Test", 
                email:"test@gmail.com", 
                password:"testPassword", 
                role:"User"});

            const animal = {
                name:"chat1",
                type_animal:"chat",
                number_sec_treats:3,
                number_sec_food:1
            }



            testID = testUser._id;
            testUser.animals.push(animal);
            const res = await testUser.save();

            //console.log(res.animals[0]._id);
            
            subdocId = res.animals[0]._id;
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    
        test('Should work when there is valid data is the document', async () => {
            const req = mockRequest({id:testID, subdocument:"animals", subdocId:subdocId},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.getSubdocumentById(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work when the parent docuemnt is missing', async () => {

            await userMongoModel.collection.drop();
            const req = mockRequest({id:testID, subdocument:"animals", subdocId:subdocId},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.getSubdocumentById(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work when the params id is not a mongoose objectID or the subdocument name doesnt exist', async () => {

            const req = mockRequest({id:"aiklplsd",subdocument:"carrots", subdocId:subdocId},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.getSubdocumentById(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });


    describe('<-- createSubdocument function -->', () => {


        let testID;
        
        beforeEach(async () => {
            const testUser = new userMongoModel({ 
                firstname:"testFirstName", 
                lastname:"testLastName", 
                username:"Test", 
                email:"test@gmail.com", 
                password:"testPassword", 
                role:"User"
            });

            testID = testUser._id;
            await testUser.save();

        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    
        test('Should work when there is valid data is the document', async () => {
            const req = mockRequest({id:testID, subdocument:"animals"},{
                name:"chat1",
                type_animal:"chat",
                number_sec_treats:3,
                number_sec_food:1
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.createSubdocument(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(201);
        });


        test('Should not work when there is no user', async () => {

            await userMongoModel.collection.drop();
            const req = mockRequest({id:testID, subdocument:"animals"},{
                name:"chat1",
                type_animal:"chat",
                number_sec_treats:3,
                number_sec_food:1
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.createSubdocument(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work when there is missing required subdocument fields', async () => {

            const req = mockRequest({id:testID, subdocument:"animals"},{
                name:"chat1",
                number_sec_treats:3,
                number_sec_food:1
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.createSubdocument(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });


    describe('<-- updateSubdocument function -->', () => {


        let testID;
        let subdocId;
        
        beforeEach(async () => {
            const testUser = new userMongoModel({ 
                firstname:"testFirstName", 
                lastname:"testLastName", 
                username:"Test", 
                email:"test@gmail.com", 
                password:"testPassword", 
                role:"User"});

            const animal = {
                name:"chat1",
                type_animal:"chat",
                number_sec_treats:3,
                number_sec_food:1
            }



            testID = testUser._id;
            testUser.animals.push(animal);
            const res = await testUser.save();

            //console.log(res.animals[0]._id);
            
            subdocId = res.animals[0]._id;
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    
        test('Should work when there is valid data is the document', async () => {
            const req = mockRequest({id:testID, subdocument:"animals", subdocId:subdocId}, {
                name:"NOUVEAU NOM",
                type_animal:"LE CHAT EST UNE PATATE",
                number_sec_treats:323,
                number_sec_food:1123
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.updateSubdocument(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work when there is no parent document', async () => {

            await userMongoModel.collection.drop();
            const req = mockRequest({id:testID, subdocument:"animals", subdocId:subdocId}, {
                name:"NOUVEAU NOM",
                type_animal:"LE CHAT EST UNE PATATE",
                number_sec_treats:323,
                number_sec_food:1123
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.updateSubdocument(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work when the params id is not a mongoose objectID or the subdocument name doesnt exist', async () => {

            const req = mockRequest({id:"aiklplsd",subdocument:"carrots", subdocId:subdocId}, {
                name:"NOUVEAU NOM",
                type_animal:"LE CHAT EST UNE PATATE",
                number_sec_treats:323,
                number_sec_food:1123
            });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.updateSubdocument(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });

        
        test('Should not work when there is no child document', async () => {




            const req = mockRequest({id:testID, subdocument:"carrot", subdocId:subdocId}, {
                name:"NOUVEAU NOM",
                type_animal:"LE CHAT EST UNE PATATE",
                number_sec_treats:323,
                number_sec_food:1123
            });
            const res = mockResponse();
            const next = jest.fn();
    


            await userController.updateSubdocument(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });

    
    });



    describe('<-- deleteSubdocument function -->', () => {


        let testID;
        let subdocId;
        
        beforeEach(async () => {
            const testUser = new userMongoModel({ 
                firstname:"testFirstName", 
                lastname:"testLastName", 
                username:"Test", 
                email:"test@gmail.com", 
                password:"testPassword", 
                role:"User"
            });

            const animal = {
                name:"chat1",
                type_animal:"chat",
                number_sec_treats:3,
                number_sec_food:1
            }



            testID = testUser._id;
            testUser.animals.push(animal);
            const res = await testUser.save();

            
            subdocId = res.animals[0]._id;
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    


        test('Should work when there is valid data is the document', async () => {

            
            const req = mockRequest({id:testID, subdocument:"animals", subdocId:subdocId.toString()},{});
            const res = mockResponse();
            const next = jest.fn();

            const response = await userMongoModel.find();
            await userController.deleteSubdocument(req, res, next);
    

            expect(res.status).toHaveBeenCalledWith(204);
        });


        test('Should not work when the parent document is missing', async () => {

            await userMongoModel.collection.drop();
            const req = mockRequest({id:testID, subdocument:"animals", subdocId:subdocId},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.deleteSubdocument(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work when the subdocument name doesnt exist', async () => {

            const req = mockRequest({id:testID,subdocument:"carrots", subdocId:subdocId},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.deleteSubdocument(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work when the child document is missing', async () => {

            const req = mockRequest({id:testID,subdocument:"animals", subdocId:subdocId},{});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.deleteSubdocument(req, res, next);

            await userController.deleteSubdocument(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });

    
    
    describe('<-- createNewAccount FUNCTION -->', () => {

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
    
            await userController.createNewAccount(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(201);
        });


        test('Should not work without the password and other missing fields', async () => {
            const req = mockRequest({},{ firstname:"testFirstName", lastname:"testLastName", username:"Stephane", email:"steph@gmail.com", role:"User" });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.createNewAccount(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });


        test('Should not work if the email and other fileds are missing', async () => {
            const req = mockRequest({},{ username:"Stephane", password:"IAmStephane", role:"User" });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.createNewAccount(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });


    describe('<-- loginAccount FUNCTION -->', () => {

        let password;
        beforeEach(async () => {
            const testUser = new userMongoModel({ firstname:"testFirstName", lastname:"testLastName", username:"Test", email:"test@gmail.com", password:"testPassword", role:"User"});
            const response = await testUser.save();
            password = response.password
        });
    
        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });
    
        test('Should work with valid inputs', async () => {
            const req = mockRequest({},{email:"test@gmail.com",password:password });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.loginAccount(req, res, next);
    
            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work if the email is invalid', async () => {
            const req = mockRequest({},{email:"idontexist@gmail.com",password:password });
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.loginAccount(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });

        test('Should not work if the password is invalid', async () => {
            const req = mockRequest({},{email:"test@gmail.com", password:"allslsl"});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.loginAccount(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });

        test('Should not work if the email or password fields are not procured', async () => {
            const req = mockRequest({},{password:password});
            const res = mockResponse();
            const next = jest.fn();
    
            await userController.loginAccount(req, res, next);
    
            expect(next).toHaveBeenCalled();
        });
    
    });


})
