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


describe('<-- MODEL VALIDATIONS -->', () => {


    describe('<-- ANIMAL VALIDATIONS -->', () => {
        let testID;
        let subdocId;
        
        
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



            testID = testUser._id;
            testUser.animals.push(animal);
            const res = await testUser.save();

            
            subdocId = res.animals[0]._id;
        });

        afterEach(async () => {
            await userMongoModel.deleteMany({});
        });

        test('Should work when all fieds are valid', async () => {

            const req = mockRequest({id:testID, subdocument:"animals", subdocId:subdocId}, {
                name:"NOUVEAU NOM",
                type_animal:"LE CHAT EST UNE PATATE",
                number_sec_treats:323,
                number_sec_food:1123,
                weight:1
            });
            const res = mockResponse();
            const next = jest.fn();

            await userController.updateSubdocument(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });


        test('Should not work when the weight is negative', async () => {

            const req = mockRequest({id:testID, subdocument:"animals", subdocId:subdocId}, {
                name:"NOUVEAU NOM",
                type_animal:"LE CHAT EST UNE PATATE",
                number_sec_treats:323,
                number_sec_food:1123,
                weight:-1
            });
            const res = mockResponse();
            const next = jest.fn();

            await userController.updateSubdocument(req, res, next);

            expect(next).toHaveBeenCalled();
        });


        test('Should not work when the number_sec_treats is negative', async () => {

            const req = mockRequest({id:testID, subdocument:"animals", subdocId:subdocId}, {
                name:"NOUVEAU NOM",
                type_animal:"LE CHAT EST UNE PATATE",
                number_sec_treats:-323,
                number_sec_food:1123,
                weight:1
            });
            const res = mockResponse();
            const next = jest.fn();

            await userController.updateSubdocument(req, res, next);

            expect(next).toHaveBeenCalled();
        });


        test('Should not work when the number_sec_food is negative', async () => {

            const req = mockRequest({id:testID, subdocument:"animals", subdocId:subdocId}, {
                name:"NOUVEAU NOM",
                type_animal:"LE CHAT EST UNE PATATE",
                number_sec_treats:323,
                number_sec_food:-1123,
                weight:1
            });
            const res = mockResponse();
            const next = jest.fn();

            await userController.updateSubdocument(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });






});