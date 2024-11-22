import { dbConnect } from "@/src/lib/dbConnected";
import UserModel from "@/src/model/user";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { next_Options } from "../[...nextauth]/options";

export async function GET(req:Request){
    await dbConnect();
    const session = await getServerSession(next_Options);
    const user : User = session?.user;

    if(session || !user){
        return Response.json({
            success:false,
            message:"User not signed in"
        },{
            status:500
        })
    }

    const userId = user._id;

    try {
        
        const user = await UserModel.aggregate([
                {$match : {_id:userId}},
                {$unwind:'$messages'},
                {$sort:{'messages.createdAt':-1}},
                {$group:{_id:"$_id",messages:{$push:'$messages'}}},
        ]);

        if(!user || user.length === 0){
            return Response.json({
                success:false,
                message:"User not found",
            },{
                status:500
            });
        }
        console.log(user);
        return Response.json({
            success:true,
            data:user
        },{
            status:200
        })

    } catch (error) {
        console.error(error);
        return Response.json({
            success:false,
            message:"Error while processing request",
        },{
            status:500
        })        
    }
}