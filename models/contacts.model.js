import mongoose from "mongoose"

// Define Schema of contact for saving data in mongoDb
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
//login schema of mongoDb
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
//here we export the schema data 
export default loginData;