import mongoose from "mongoose";

const User = new mongoose.Schema({
    userid :  Number,
    username : String,
    email : String,
    password :  String,
    mobile :  Number
}, { collection: 'User' })
export default mongoose.model('User',User);