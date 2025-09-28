import mogoose from "mongoose"

const connectDB = async () => {
    try {
        await mogoose.connect(`${process.env.MONGODB_CONNECTION_sTRING}/carmazik`)
        console.log(`MongoDB connect to server`);
        
    } catch (error) {
        console.log(error);
        process.exit(1)
        
    }
}

export {connectDB}