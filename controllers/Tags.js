const Tag = require("../models/Tag");


// tag handler
exports.createTag = async(req,res)=>{
    try{
        // data fetch
        const {name , description} = req.body;
        // validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        // create entry in db
        const tagDetails = await Tag.create({
            name:name,
            description:description,
        })
        console.log(tagDetails);
        // return res
        return res.status(200).json({
            success:true,
            message:"tag Created successfully",
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong while creating tag",
            error:error.message,
        })
    }
}

// get all tags
exports.showAlltags = async(req,res)=>{
    try{
        const allTags = await Tag.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"all tags returned successfully",
            allTags,
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong while fetching tag",
            error:error.message
        })

    }
}