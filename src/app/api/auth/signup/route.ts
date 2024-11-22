import { dbConnect } from "@/src/lib/dbConnected";
import UserModel from "@/src/model/user";

import { sendVerificationEmail } from "@/src/helper/sendVerificationEmail";
import bcrypt from 'bcrypt';

export async function POST(req:Request) {
    await dbConnect();
    try{
        const { username,email,password } = await req.json();

        const ExistingUserByUsername = await UserModel.findOne({
            username: username,
            isVerified:true,
        });

        if(ExistingUserByUsername){
            return Response.json({
                success:false,
                message:"Username already taken!",
            },{
                status:400
            });
        }

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const ExistingUserByemail = await UserModel.findOne({email});

        if(ExistingUserByemail){
            if(ExistingUserByemail.isVerified){
                return Response.json({
                    success:false,
                    message:"Email already registered!",
                },{
                    status:400,
                })
            }
            else{
                const hashedpassword = await bcrypt.hash(password,10);
                ExistingUserByemail.verifyCode = verifyCode;
                ExistingUserByemail.password = hashedpassword;
                ExistingUserByemail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await ExistingUserByemail.save();
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryCode = new Date();
            expiryCode.setHours(expiryCode.getHours()+1);

            const newuser = await UserModel.create({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryCode,
                isAccepting: true,
                message: []
            });
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode,
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );   
        }
      
        return Response.json(
            {
              success: true,
              message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 } 
        );
    }
    catch(err){
        console.error("Error while registering ",err);

        return Response.json({
            success:false,
            message:"Error while registering user",
        })
    }
}