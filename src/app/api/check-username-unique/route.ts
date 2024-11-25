import { z } from 'zod'
import { dbConnect } from "@/src/libs/dbConnected";
import UserModel from "@/src/model/user";
import { usernameValidation } from "@/src/Schemas/signUpSchema";

const usernameSchema = z.object({
    username:usernameValidation,
})

export async function GET (req:Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const  queryparam = {
            username: searchParams.get('username'),
        }

        const result = usernameSchema.safeParse(queryparam);

        if(!result.success){
            const usernameError = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameError.length >0 ? 
                usernameError.join(', ') : 'Invalid username',
            })
        }

        const user = await UserModel.findOne({
            username: result.data.username,
            isVerified: true,
        });

        if (user) {
            return Response.json(
              {
                success: false,
                message: 'Username is already taken',
              },
              { status: 200 }
            );
        }
        
        return Response.json({
            success:true,
            message: 'Username is available',
        });

    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: 'Error while processing request',
        });
    }

}