import mongoose from "mongoose"
import { DB_NAME } from "../../../../Stacksocial/Backend/src/contents.js"


const ConnectDB = ( async () => {

    try{
        await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log("✅ Mongodb connected successfully" )

    }
    catch(error){

        console.log("❌ Error from Mongodb :", error)
        process.exit(1)

    }

})

export default ConnectDB;
