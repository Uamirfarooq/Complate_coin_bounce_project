const mongoose = require ("mongoose");
const { MONGODB_CONNECTION_STRING } = require("../config/index");



const dbConnect = async ()=> {

    try {
    const conn   = await mongoose.connect(MONGODB_CONNECTION_STRING)
    console.log(`Database is connected ${conn.connection.host}`);
    } catch (error) {
        console.log('idk');
    }
}
module.exports=dbConnect