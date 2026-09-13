import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/database-config.js";
import ContactRoutes from "./routes/contacts-routes.js";

dotenv.config(); 
  
const app = express(); 

const PORT = process.env.PORT;  

connectDb();

app.set("view engine", "ejs"); 
app.use(express.static("public")); 
app.use(express.urlencoded({ extended: false })); 


app.use("/", ContactRoutes);
 
app.listen(PORT, () => {
    console.log(`App start at the ${PORT}`);
});