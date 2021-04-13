import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true,
    },
    source: {
        type: String,
    },
    ip: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const User = mongoose.model("Users", UserSchema)

export default User