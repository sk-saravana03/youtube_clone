import mongoose from "mongoose";
import user from "../Models/Auth.js";

export const pointsController = async (req, res) => {
    const { id: _id } = req.params;
    const { Viewer } = req.body; 
  
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("Video Unavailable..");
    }
  
    try {
      let updatedUser;
      let newUser;
      const users = await user.findById(Viewer);
      if (!users) {
        return res.status(404).send("User not found");
      }
  
      
      if (!users.viewedVideos.some((videoId) => videoId.equals(_id))) {
        
        updatedUser = await users.findByIdAndUpdate(Viewer, {
          $addToSet: { viewedVideos: _id },
        });
        newUser = await user.findById(Viewer);
      }
      else{
        newUser = user;
      }
  
      res.status(200).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };