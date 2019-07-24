/*LIBRERIA MONGODB */
const mongoose=require('mongoose');
mongoose.connect(`mongodb://localhost:27017/WebTravelAgency_dev`,{
   useNewUrlParser: true, useCreateIndex:true })
.then(() => console.log(`Connected to database mongodb://localhost:27017/WebTravelAgency_dev`))
.catch((error) => console.log('Connection to MongoDB failed!:( \n' + e))

module.exports=mongoose;