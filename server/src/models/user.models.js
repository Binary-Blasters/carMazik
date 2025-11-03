import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    phonenumber : {
        type : Number,
        unique : true,
        required : true
    },
    password : {
        type : String,
        requied : true,
        
    },
    role : {
        type : String,
        enum : ['user','seller','admin'],
        default : 'user'
    },
    isBlocked : {
        type : Boolean,
        default : false

    },
    reSetPassOtp : String,
  },
  { timestamps: true }
);

userSchema.index({name : 'text', email : 'text', username : 'text', phonenumber : 'text'})
userSchema.pre("save",async function(next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)

}
userSchema.methods.genarateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            name : this.name,
            email : this.email,
            username : this.username,
            role : this.role
        },
        process.env.ACCESS_TOKEN_SECRET_KEY ,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRE_IN
        }
    )
}

export const User = mongoose.model("User", userSchema);
