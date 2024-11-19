import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date;
}

const MessageSchema : Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required:true,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAccepting: boolean;
    message: Message[]
}

const UserSchema : Schema<User> = new Schema({
    username: {
        type:String,
        required:[true, "Username is required"],
        unique: true,
        minlength:3,
        trim:true,
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/,'please use a valid email address']
    },
    password:{
        type: String,
        required:[true, "Password is required"],
        minlength: 6
    },
    verifyCode: {
        type: String,
        required:[true,'Verify Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required:[true,'Verify Code Expiry is required'],
    },
    isAccepting: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    message:[MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema));

export default UserModel;