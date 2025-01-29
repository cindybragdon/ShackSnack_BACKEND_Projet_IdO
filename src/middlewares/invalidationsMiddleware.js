import mongoose from "mongoose";
import { regexEmail } from "../utils/regex";
import userMongoModel from "../models/mongo.model.user";
import { DeviceModel } from "../models/mongo.model.device";

export function validateFormatMiddleware(req, res, next) {

    //Middleware to test if entries in received json
    //Are in the good format
    try{
        if(req.params.id) {
            if(!mongoose.isValidObjectId(req.params.id)){
                return res.status(400).send("Invalid object Id");
            } 
        }

        if(req.body.email) {
            if(!regexEmail.test(req.body.email)){
                return res.status(400).send("Invalid email");
            }
        }

        next();
    } catch(error){
      res.status(500).send("INTERNAL ERROR");
    }
}


//Pas sur si utile
export function validateDocumentMiddleware(req, res, next) {

    //Middleware to test if entries in received json
    //Are in the good format
    try{

        const errorDocumentMessage = "Invalid document format"

        switch (req.body.documentType) {
            case "User":
                if(!validateDocument(userMongoModel, req.body)){
                    return res.status(400).send(errorDocumentMessage);
                } 
              break;
            case "Animal":
                if(!validateDocument(AnimalModel, req.body)){
                    return res.status(400).send(errorDocumentMessage);
                } 
                break;
            case "Notification":
                if(!validateDocument(NotificationModel, req.body)){
                    return res.status(400).send(errorDocumentMessage);
                } 
                break;

            case "Device":
                if(!validateDocument(DeviceModel, req.body)){
                    return res.status(400).send(errorDocumentMessage);
                } 
                break;
            default:
                return res.status(400).send("No existing document found by that name");
        }

        next();
    } catch(error){
      res.status(500).send("INTERNAL ERROR");
    }
}