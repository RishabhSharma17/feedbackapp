import { dbConnect } from "@/src/lib/dbConnected";
import UserModel from "@/src/model/user";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { next_Options } from "../[...nextauth]/options";

export async function POST(req:Request){
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

    try {
        const {acceptMessage} = await req.json();
        const userId = user._id;

        const updatedUser = await UserModel.findByIdAndUpdate(
             userId,
            { isAccepting:acceptMessage },
            { new:true },
        );

        if(!updatedUser){
            return Response.json({
                success:false,
                message: 'User not found',
            })
        }

        return Response.json(
            {
              success: true,
              message: 'Message acceptance status updated successfully',
              updatedUser,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return Response.json({
            success:false,
            message: 'Error while processing request',
        })
    }

}

export async function GET(request: Request) {
    // Connect to the database
    await dbConnect();
  
    // Get the user session
    const session = await getServerSession(next_Options);
    const user = session?.user;
  
    // Check if the user is authenticated
    if (!session || !user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
  
    try {
      // Retrieve the user from the database using the ID
      const foundUser = await UserModel.findById(user._id);
  
      if (!foundUser) {
        // User not found
        return Response.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
  
      // Return the user's message acceptance status
      return Response.json(
        {
          success: true,
          isAcceptingMessages: foundUser.isAccepting,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error retrieving message acceptance status:', error);
      return Response.json(
        { success: false, message: 'Error retrieving message acceptance status' },
        { status: 500 }
      );
    }
  }