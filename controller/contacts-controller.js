import Contacts from "../models/contacts.model.js"
import mongoose from "mongoose"
import bcrypt from 'bcryptjs';
import { query, validationResult }  from 'express-validator';
 //home route
export const homeRoute=async (req, res) => {
  try {
    const contactDetail = await Contacts.find();
    const counter=await Contacts.countDocuments();


    res.render('home',{userContact:contactDetail,counter:counter});
  } catch (error) {
  
    res.status(500).json({ error: error.message });
  }
};
//show contacts 
export const showContacts =async(req,res)=>{
  const userDetail=await Contacts.findById(req.params.userId);
  res.render('partials/showContacts',{contact:userDetail}) 
};
//add contact page
export const addContactPage=(req,res)=>{
  res.render('addContacts');
};
//add contact 
export const addContacts=async(req,res)=>{
 try{
  const addContacts=await Contacts.insertOne({
  first_name:req.body.first_name,
  last_name:req.body.last_name,
  email:req.body.email,
  phone:req.body.phone,
  address:req.body.address,
  });
  // res.send(req.body);
 res.redirect('/');
 }catch(e){
  res.render("500-error",{message:e});
 }
};
//update contact page
export const updateContactPage=async(req,res)=>{
   if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
    res.render('404-error',{message:'Invalid Id'});
    return;
  }
  try{
const userDetail=await Contacts.findById(req.params.userId);
  if(!userDetail){
    res.render('404-error',{message:"Contact detail not fetch due to some issue,plz try again"});
  }
  // res.send(userDetail)
res.render('updateContacts',{contact:userDetail});
  }catch(e){
    res.render("500-error",{message:e});
  }

};
//update contacts
export const updateContact =async(req,res)=>{
   if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
    res.render('404-error',{message:'Invalid Id'});
    return;
  }
  try{
   const  contact=await Contacts.findByIdAndUpdate(req.params.userId,req.body);
   if(!contact){
    res.render('404-error',{message:"Contact not found"});
   }
res.redirect('/');
  }catch(e){
   res.render("500-error",{message:e});
  }

};
//delete contact
export const deleteContact=async(req,res)=>{
   if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
    res.render('400-error',{message:'Invalid Id'});
    return;
  }
  try{
    const contacts= await Contacts.findByIdAndDelete(req.params.userId);
      if(!contacts){
    res.render('404-error',{message:"Contact not found"});
   }
res.redirect('/');
  }catch(e){
res.render("500-error",{message:e});
  }

};
//form validation check
export const formvalidationCheck = (req, res) => {

  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return res.send("Form submitted successfully!");
  }

  res.render("form-validation", {
    errors: errors.array(),
    formData: req.body
  });
};


export const formvalidations = (req, res) => {

  res.render("form-validation", {
    errors: [],
    formData: {}
  });

};
//upload file to selected folder
export const fileUploading = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file selected');
  }
    console.log(req.file);

    res.json({
        message: "File uploaded successfully",
        file: req.file
    });
};
//destroy session
export const destroySession=(req,res)=>{
 req.session.destroy((err)=>{
  if(err){
    res.status(500).send('Failed to destroy session')
  }else{
    res.send('Session destroy successfully');
  }
 })
};
//get session data
export const getSessionData=(req,res)=>{
  if(req.session.name){
   return res.send(`Session data is :${req.session.name}`)
  }
  res.send('Session data not found');
};
//set session data 
export const setSesstionData=(req,res)=>{
  req.session.name='Muhammad Safwan';
  res.send(`Session created successfully and data is ${req.session.name}`);
};
export const loginPage = (req, res) => {
  res.render('login', {
    error: null
  });
};

//register user code
export const register = async (req, res) => {

  try {

    const { username, password } = req.body;

    const existingUser = await Contacts.findOne({ username });

    if (existingUser) {
      return res.render('register', {
        error: 'Username already exists'
      });
    }
 //hash password
    const hashPassword = await bcrypt.hash(password, 10);
 //save to mongodb
    await Contacts.create({
      username,
      password: hashPassword
    });

    res.redirect('/login');

  } catch (error) {

    console.log(error);

    res.status(500).send('Something went wrong');

  }
};


export const registerPage = (req, res) => {

  if (req.session.userKey) {
    return res.redirect('/home-page');
  }

  res.render('register');
};

//login user
export const loginUser = async (req, res) => {

  const { username, password } = req.body;

  const user = await Contacts.findOne({ username });

  // User exist nahi karta
  if (!user) {
    return res.render('login', {
      error: 'Invalid username/password'
    });
  }
//compare hashpassword and current password set by user 
  const isMatch = await bcrypt.compare(
    password,
    user.password
  );
//is same then login is different then  go to login
  if (!isMatch) {
    return res.render('login', {
      error: 'Invalid username/password'
    });
  }

  // Successful login
  req.session.userKey = user.username;

  return res.redirect('/home-page');
};


export const logout = (req, res) => {

  req.session.destroy((err) => {

    if (err) {
      return res
        .status(500)
        .send('Internal error found during session expiration/logout');
    }

    res.redirect('/login');
  });

};


export const homePage = (req, res) => {

  if (!req.session.userKey) {
    return res.redirect('/login');
  }

  res.render('home-page');
};
export const processPost=(req, res) => {

  res.send(
    `Data is being processed and the value of body is ${JSON.stringify(req.body)}`
  );

};
//here we set the csruf value to input method 
export const getForm=(req, res) => {

  res.render('csurf-check', {
    csrfToken: req.csrfToken()
  });

};
//remove cookei
export const removeCookie=(req, res) => {

  res.clearCookie('myName');

  res.send('The value of cookie removed successfully');
};
//get cookei value
export const getCookieValue= (req, res) => {

  if (!req.cookies.myName) {
    return res.send('Cookie value has not been stored yet');
  }

  res.send(
    `The value of cookie stored is: ${req.cookies.myName}`
  );

};
//set cookei value 
export const setCookeiValue=(req, res) => {

  res.cookie('myName', 'Muhammad Safwan', {
    maxAge: 868000,
    httpOnly: true
  });

  res.send('Cookie value stored successfully');

};
