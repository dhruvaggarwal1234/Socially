import dotenv from "dotenv"
import ConnectDB from "../../../Stacksocial/Backend/src/Db/db.js"
import { app } from "./app.js"

dotenv.config()

ConnectDB()
.then(()=>{
    app.on("error" ,(error) =>{
        console.log("App Error :" , error)
    })
    app.listen(process.env.PORT || 8080 , () =>{
        console.log(`Port is the working properly  ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("App Error :" , error)
})