import { dbConnect } from "@/src/libs/dbConnected";
import UserModel from "@/src/model/user";

export async function POST (req:Request){
    await dbConnect();

    try {
        const {username,code} = await req.json();
        const decodeuser =  decodeURI(username);
        
        const existinguser = await UserModel.findOne({
            username: decodeuser,
        });

        if (!existinguser) {
            return Response.json(
              { success: false, message: 'User not found' },
              { status: 404 }
            );
          }
      

        if(existinguser?.isVerified){
            return Response.json({
                success:false,
                message:"User already verified!"
            },{
                status:400,
            });
        }

        const validcode = code === existinguser?.verifyCode;
        const validdate = new Date(existinguser?.verifyCodeExpiry)> new Date();

        if(validcode && validdate){
            existinguser.isVerified = true;
            await existinguser.save();
            return Response.json({
                success:true,
                message:"User verified successfully!"
            },{
                status:200,
            });
        } else if(!validdate){
            return Response.json({
                success:false,
                message:"Verification code expired! , Try signing up agian..."
            },{
                status:400,
            })
        } else{
            return Response.json({
                success:false,
                message:"Invalid verification code!"
            },{
                status:400,
            })
        }

    } catch (error) {
        console.error(error);
        return Response.json({
            success:false,
            message:"Error occured while verifying!"
        },{
            status:500,
        })
    }
}