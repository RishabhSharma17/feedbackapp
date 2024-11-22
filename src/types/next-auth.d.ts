import 'next-auth'

declare module 'next-auth' {
    interface User{
        username?:string;
        _id?:string;
        isVerified?:boolean;
        isAccepting?:boolean;
    }
    interface Session {
        user: {
          _id?: string;
          isVerified?: boolean;
          isAcceptingMessages?: boolean;
          username?: string;
        } & DefaultSession['user'];
    }
}