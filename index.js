const mongoose = require("mongoose")
const app = require("./app")
async function main(){
    await mongoose.connect("mongodb://localhost:27017/InstaClone")
    console.log("database connected");
    app.listen(3000,()=>console.log("server is listening at 3000"))
    
}

main()

