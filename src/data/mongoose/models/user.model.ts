import mongoose, { Schema } from 'mongoose';


const userSchema = new Schema({
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
        required: false
    },
    fromOAuth: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', function(next) {
    if ( !this.fromOAuth && !this.password ) {
        this.invalidate('password', 'Password is required');
    }
    
    next();
})

export const UserModel = mongoose.model('User', userSchema);