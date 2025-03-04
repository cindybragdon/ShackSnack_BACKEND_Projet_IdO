import { Schema } from "mongoose";


//Shéma mongoose d'un device.
//Utilisé pour le mode vacances
const daySchema = new Schema({
  day: { 
    type: String, 
    required: true, 
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] 
  },
  isSelected: { 
    type: Boolean, 
    default: false 
  }
}, { _id: false });

const feedingTimeSchema = new Schema({
  name: { type: String, required: true },
  hour: { type: Number, required: true },
  minute: { type: Number, required: true },
  days: {
    type: [daySchema],
    default: [
        { day: "Monday", isSelected: false },
        { day: "Tuesday", isSelected: false },
        { day: "Wednesday", isSelected: false },
        { day: "Thursday", isSelected: false },
        { day: "Friday", isSelected: false },
        { day: "Saturday", isSelected: false },
        { day: "Sunday", isSelected: false }
    ]
  }
});


const deviceShemaDefinition = new Schema({
  name: {
      type: String,
      required:true
  },
  mac_adress: {
      type: String,
      required:true
  },
  feedingTimes: {
      type: [feedingTimeSchema],
      default: []
  },
  isVacationModeActive: {
      type: Boolean,
      required: true,
      default: false
  },
  vacationFeedingTime: {
      type: Number,
      required: true,
      default: 2
  }
});

export default deviceShemaDefinition;