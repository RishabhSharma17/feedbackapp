import { dbConnect } from "@/src/lib/dbConnected";
import UserModel from "@/src/model/user";
import { Message } from "@/src/model/user";

export async function POST(req:Request){
    await dbConnect();

    try {
        const{username,content} = await req.json();
        const user = await UserModel.findOne({username: username});

        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
            },{
                status:404
            });
        }

        if(!user.isAccepting){
            return Response.json({
                success: false,
                message: "User is not accepting feedback",
            },{
                status:403
            });
        }

        const newMessage = {
            content: content,
            createdAt: new Date(),
        };

        user.message.push(newMessage as Message);
        user.save()

        return Response.json({
            success: true,
            message: "Feedback registered successfully",
            messages: user.message,
        },{
            status:201
        });

    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: "Error while registering user",
        },{
            status:500
        })
    }
}