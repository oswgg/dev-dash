import mongoose, { Schema } from "mongoose";

export type ImplementationService = "github";

const implementationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    service: {
        type: String,
        enum: ["github"],
        required: true
    },
    accessToken: String,
    refreshToken: String,
    username: String,
    enabled: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export const ImplementationModel = mongoose.model("Implementation", implementationSchema);