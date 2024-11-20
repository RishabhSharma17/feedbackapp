import { dbConnect } from "@/src/lib/dbConnected";
import UserModel from "@/src/model/user";

import { sendVerificationEmail } from "@/src/helper/sendVerificationEmail";
import bcrypt from 'bcrypt';
import { ApiResponse } from "@/src/types/ApiResponse";

export async function POST(req:Request) {
    await dbConnect();
    try{
        const { username,email,password } = await req.json();

        return Response.json({
            success:true,
            message:"User signup successfully!",
        },
        {
            status:200
        })
    }
    catch(err){
        console.error("Error while registering ",err);

        return Response.json({
            success:false,
            message:"Error while registering user",
        }
    )
    }
}