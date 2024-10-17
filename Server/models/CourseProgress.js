const mongoose=require('mongoose');

const courseProgress=new mongoose.Schema({
    courseID:{
        type:mongoose.Types.ObjectId,
        ref:"Course",
    },
    completedVideos:[
        {
            type:mongoose.Types.ObjectId,
            ref:"SubSection",
        }
    ],
});

module.exports=mongoose.model("CourseProgress",courseProgress);