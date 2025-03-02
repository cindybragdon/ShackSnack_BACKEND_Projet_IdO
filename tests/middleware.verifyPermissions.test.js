import { denyCreateAccountAdmin, verifyAdmin, verifyPermissions } from "../src/middlewares/middleware.verifyPermissions";

const mockResponse = ()  => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

//Create false request
const mockRequest = (params, data, user) => ({ params:params, body: data, user:user });

describe("<-- VERIFY PERMISSIONS -->", () => {

    describe("<-- verifyPermissions function -->", () => {

        test("Should work when the connected user is an Admin wants to change someting about another user ", () => {

            const req = mockRequest({id:"1234"},{id:"4567"},{role:"Admin"});
            const res = mockResponse();
            const next = jest.fn();
    
            verifyPermissions(req, res, next)


            expect(next).toHaveBeenCalledWith();
        }); 

        test("Should not work when the connected user is an User wants to change someting about another user ", () => {

            const req = mockRequest({id:"1234"},{id:"4567"},{role:"User"});
            const res = mockResponse();
            const next = jest.fn();
    
            verifyPermissions(req, res, next)

            const error = new Error("You are not permitted to access this information");
            error.status = 403;

            expect(next).toHaveBeenCalledWith(error);
        }); 
        


        test("Should work when the connected user is an Admin wants to change a role for an Admin ", () => {

            const req = mockRequest({id:"1234"},{role:"Admin"},{role:"Admin"});
            const res = mockResponse();
            const next = jest.fn();
    
            verifyPermissions(req, res, next)


            expect(next).toHaveBeenCalledWith();
        }); 

        test("Should not work when the connected user is a User wants to change a role for a Admin ", () => {

            const req = mockRequest({id:"1234"},{role:"Admin"},{role:"User"});
            const res = mockResponse();
            const next = jest.fn();
    
            verifyPermissions(req, res, next)

            const error = new Error("You are not permitted to access this information");
            error.status = 403;

            expect(next).toHaveBeenCalledWith(error);
        }); 

    });




    describe("<-- verifyAdmin function -->", () => {

        test("Should work when the connected user is an Admin", () => {

            const req = mockRequest({id:"1234"},{id:"4567"},{role:"Admin"});
            const res = mockResponse();
            const next = jest.fn();
    
            verifyAdmin(req, res, next)


            expect(next).toHaveBeenCalledWith();
        }); 

        
        test("Should not work when the connected user is not an Admin", () => {

            const req = mockRequest({id:"1234"},{id:"4567"},{role:"User"});
            const res = mockResponse();
            const next = jest.fn();
    
            verifyAdmin(req, res, next)

            const error = new Error("You are not permitted to access this information");
            error.status = 403;

            expect(next).toHaveBeenCalledWith(error);
        }); 

    });




    describe("<-- denyCreateAccountAdmin function -->", () => {

        test("Should work when the value of req.body is 'User'", () => {

            const req = mockRequest({},{role:"User"},{});
            const res = mockResponse();
            const next = jest.fn();
    
            denyCreateAccountAdmin(req, res, next)


            expect(next).toHaveBeenCalledWith();
        }); 

        
        test("Should not work when the value of req.body is 'Admin'", () => {

            const req = mockRequest({},{role:"Admin"},{});
            const res = mockResponse();
            const next = jest.fn();
    
            denyCreateAccountAdmin(req, res, next)

            const error = new Error("You don't have the rights to do this");
            error.status = 403;

            expect(next).toHaveBeenCalledWith(error);
        }); 

    });

});



