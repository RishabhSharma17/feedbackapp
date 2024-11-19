import mongoose from "mongoose";

type connected = {
    isConnected?:number;
}

const connection : connected = {}

async function dbconnection(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URL || '');
        console.log(db);
        connection.isConnected = db.connections[0].readyState;
        console.log("Db connected successfully");
        return
    }
    catch(err){
        console.log("Some error occurred while connecting to database : ",err);

        process.exit(1);
    }
}