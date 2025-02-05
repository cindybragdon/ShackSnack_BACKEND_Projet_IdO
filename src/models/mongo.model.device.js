import { Schema } from "mongoose";



const daySchema = new mongoose.Schema({
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

const feedingTimeSchema = new mongoose.Schema({
    name: { type: String, required:true},
    hour: { type: Number, required: true },
    minute: { type: Number, required: true },
    days: {type: [daySchema], default: function () {
      return [
        { day: "Monday", isSelected: false },
        { day: "Tuesday", isSelected: false },
        { day: "Wednesday", isSelected: false },
        { day: "Thursday", isSelected: false },
        { day: "Friday", isSelected: false },
        { day: "Saturday", isSelected: false },
        { day: "Sunday", isSelected: false }
      ];
    }}
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
  }
});

export default deviceShemaDefinition;