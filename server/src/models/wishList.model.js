import mongoose from "mongoose";

const wishListShema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
        unique : true
    },
    cars : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Car",
    }]
},{timestamps : true})
wishListShema.index({user : 1, car : 1},{unique : true})

export const WishList = mongoose.model("WishList",wishListShema)