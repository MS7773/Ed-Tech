const mongoose=require('mongoose');

const tagSchema=new mongoose.Schema({
    name:{
        type:Sting,
        required:true,
    },
    description:{
        type:String,
    },
    course:{
        type:mongoose.Types.ObjectId,
        ref:"Course",
    },
});

module.exports=mongoose.model("Tag",tagSchema);