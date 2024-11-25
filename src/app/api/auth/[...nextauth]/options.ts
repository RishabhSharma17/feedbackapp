import { NextAuthOptions } from 'next-auth';
import CredentailsProvider from 'next-auth/providers/credentials';
import { dbConnect } from '@/src/libs/dbConnected';
import bcrypt from 'bcrypt';
import UserModel from '@/src/model/user';

export const next_Options : NextAuthOptions = {
    providers:[
        CredentailsProvider({
            id: "credentials",
            name: 'Credentials',
            credentials:{
                username: { label: 'Username or Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentails:any) : Promise<any> {
                await dbConnect();
                try{
                    const user = await UserModel.findOne({
                        "$or":[
                            {email: credentails.email},
                            {username: credentails.username}
                        ]
                    });

                    if(!user){
                        throw new Error("User not found");
                    }

                    const ispassword = await bcrypt.compare(credentails.password,user.password);

                    if(!ispassword){
                        throw new Error("Invalid password");
                    }

                    return user;
                }
                catch(err:any){
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token._id = user._id?.toString(); // Convert ObjectId to string
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAccepting;
            token.username = user.username;
          }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
            session.user.username = token.username;
          }
          return session;
        },
    },
    //if it is defined then it will go to this route
    pages:{
        signIn:'/sign-in',
    },
    session:{
        strategy: 'jwt',
    },
    secret:process.env.NEXTAUTH_SECRET || ""
}