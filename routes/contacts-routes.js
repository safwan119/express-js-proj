import express from "express"
import { body, cookie }  from 'express-validator';
import multer from 'multer';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import csrf from '@sailshq/csurf'; 
import mongo from 'connect-mongo';
import path from 'path';
const router = express.Router() 
import {
 homeRoute,
  showContacts,
  getCookieValue,
  removeCookie,
  setCookeiValue,
  getForm,
  processPost,
  logout,
  register,
  registerPage,
  loginUser,
  loginPage,
  addContactPage,
  getSessionData,
  destroySession,
  setSesstionData,
  addContacts,
  updateContactPage,
  fileUploading,
  updateContact,
  deleteContact,
  formvalidations,
  formvalidationCheck,
  homePage,
} from "../controller/contacts-controller.js"
import { error } from "console";
const formvalidation=[
  body('username').notEmpty().withMessage('Username is required').isAlpha().withMessage('User name must be alphabetic').isLength({min:3}).withMessage('Username length must be greater than 3').trim(),
  body('email').isEmail().withMessage('Email must be valid').normalizeEmail(),
  body('phone').isMobilePhone().withMessage('Phone number must be valid'),
  body('address').notEmpty().withMessage('Address is required').isUppercase().withMessage('Address must be in upper case'),
];
const storage=multer.diskStorage({
destination:(req,file,cb)=>{
  cb(null,'./upload')
},
filename:(req,file,cb)=>{
   const newFileName=Date.now()+path.extname(file.originalname);
  cb(null,newFileName)
},

});
const fileFilter=(req,file,cb)=>{
 if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
cb(null,true);
}else{
  cb(new Error('only image are allowed which is in the form of png or jpeg',false))
}
}
const upload=multer({
  storage:storage,
  limits:{
    fileSize:1024*1024*1,
  },
  // fileFilter:fileFilter
})
// Error handling middleware — route ke BAAD


router.get('/fileUpload', (req, res) => {
  res.render('file-uploading');
});

router.post(
  '/fileUpload',
  upload.single('userFile'),
  // .array(name,count) ==>For multiple file
  //.fields([{oneName,count},{second,count}])==>for multiple fields
  fileUploading
);
router.use((error, req, res, next) => {

  if (error instanceof multer.MulterError) {
    return res.status(400).send(`Multer error: ${error.message}`);
  }

  if (error) {
    return res.status(400).send(`Something went wrong: ${error.message}`);
  }

  next();
});
router.use(session({
secret:'secrate-data',
cookie:{maxAge:1000*60*60*24},
resave:false,
saveUninitialized:false,
store:mongo.create({mongoUrl:'mongodb://127.0.0.1:27017/login-db'})
}));
const checkLogin = (req, res, next) => {

  if (!req.session.userKey) {
    return next();
  }

  return res.redirect('/home-page');
};

// Cookie Parser
router.use(cookieParser('mySecretePass'));

// CSRF Protection
const csrfProtection = csrf({
  cookie: true
});

router.get('/set-cookie-value',setCookeiValue);
router.get('/get-cookie-value',getCookieValue);
router.get('/remove-cookie-value', removeCookie);
router.get('/form', csrfProtection,getForm);
router.post('/process', csrfProtection,processPost);
router.get('/home-page', homePage);
router.get('/login', checkLogin, loginPage);
router.get('/register', registerPage);
router.post('/register', register);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/set-username',setSesstionData);
router.get('/get-username',getSessionData);
router.get('/destroy',destroySession);
router.get('/', homeRoute);
router.get('/showContacts/:userId',showContacts);
router.get('/addContacts',addContactPage);
router.post('/addContacts',addContacts);
router.get('/updateContacts/:userId',updateContactPage);
router.post('/updateContacts/:userId',updateContact);
router.get('/deleteContacts/:userId',deleteContact);
router.get('/form', formvalidations);
router.post('/form',formvalidation,formvalidationCheck);

export default router