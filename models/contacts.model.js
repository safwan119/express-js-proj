import mongoose from "mongoose"

// Define Schema
const contactSchema = mongoose.Schema({
  first_name: {
    type: String
  },

  last_name: {
    type: String
  },

  email: {
    type: String
  },

  phone: {
    type: String
  },

  address: {
    type: String
  }
});
//login schema
const loginSchema=new mongoose.Schema({
username:{
  type:String,
  require
  :true,
  unique:true,

},
password:{
  type:String,
  require:true,
  password:true ,
}
});

// const contact = mongoose.model("Contact", contactSchema);
const loginData=mongoose.model('userData',loginSchema);

export default loginData;