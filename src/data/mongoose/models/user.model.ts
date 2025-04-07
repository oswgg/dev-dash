import mongoose, { Schema } from 'mongoose';


const userSchma = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    integrations: {
        github: {
            accessToken: String,
            username: String,
            enabled: {
                type: Boolean,
                default: false
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const UserModel = mongoose.model('User', userSchma);