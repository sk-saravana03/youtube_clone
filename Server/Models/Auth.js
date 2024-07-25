import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {type:String , require: true},
    name: {type:String},
    desc:{type:String},
    joinedOn: { type: Date, default: Date.now },
    viewedVideos: { type: [mongoose.Schema.Types.ObjectId], ref: 'videofile', default: [] }
})

export default mongoose.model("User",userSchema)