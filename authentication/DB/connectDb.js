import mongoose from 'mongoose'
const connectDb = () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("[INFO] Connected to DB")
    }
    catch (e) {
        console.log(`[ERROR] Could not connect to DB ${e}`)
    }
}

export default connectDb