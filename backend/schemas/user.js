import mongoose from "mongoose";

const mobileNumberRegex = /^[0-9]{10}$/;

const User = new mongoose.Schema({
    username : {type : String, required : true},
    email : {type : String, required : true},
    password :  {type : String, required : true},
    mobile : {type: String,
        required: true,
        validate: {
          validator: function (v) {
            return mobileNumberRegex.test(v);
          },
          message: props => `${props.value} is not a valid mobile number!`
        }}
}, { collection: 'User' })
export default mongoose.model('User',User);