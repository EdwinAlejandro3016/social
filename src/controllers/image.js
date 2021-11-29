const ctrl = {};
const path = require('path');
const fs = require('fs-extra');
const { randomNumber } = require('../helpers/libs');
const { Image, Comment } = require('../models/index');
const md5 = require('md5');
const sidebar = require('../helpers/sidebar');

ctrl.index = async(req,res)=>{
    let viewModel = { img: {}, comments: {}};
    const id = req.params.image_id;
    const img = await Image.findOne({filename: {$regex: id}});

    if(img){
        img.views = img.views + 1;
        viewModel.img = img;
        await img.save();

        const comments = await Comment.find({img_id: img._id});
        viewModel.comments = comments;
        viewModel = await sidebar(viewModel);
        console.log('image',viewModel.sidebar.comments._image);
        res.render('image',viewModel);
    }else{
        res.redirect('/'); 
    }

};

ctrl.create = (req,res)=>{
    const saveImage = async()=>{
        const imgURL = randomNumber();
        const images = await Image.find({filename: imgURL});    
        if(images.length > 0){
            saveImage();
        }else{
            const ext = path.extname(req.file.originalname).toLowerCase();
            const imageTempPath = req.file.path;
            const targetPath = path.resolve(`src/public/upload/${imgURL}${ext}`)
        
            if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif'){
                await fs.moveSync(imageTempPath,targetPath);
                const newImg = new Image({
                    title: req.body.title,
                    filename: `${imgURL}${ext}`,
                    description: req.body.description
                })
                const savedImg = await newImg.save();
                console.log(savedImg.uniqueId);
                res.redirect('/images/' + imgURL);
            }else{
                await fs.unlink(imageTempPath);
                res.status(500).json({
                    error: 'Only Images are allow'
                })
            }
        }
    }

    saveImage();
   
};

ctrl.like = async(req,res)=>{
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if(image){
        image.likes = image.likes + 1;
        await image.save();
        res.json({
            likes: image.likes
        })
    }else{
        res.status(500).json({
            error: 'internal error'
        })
    }
};

ctrl.comment = async(req,res)=>{
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if(image){
        const newComment = new Comment(req.body);
        newComment.gravatar = md5(newComment.email);
        newComment.img_id = image._id;
        await newComment.save();
        res.redirect('/images/' + image.uniqueId);
    }else{
        res.redirect('/');
    }
   

};

ctrl.remove = async(req,res)=>{
   const image = await Image.findOne({filenam: {$regex: req.params.image_id}});
   if(image){
       await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
       await Comment.deleteOne({image_id: image._id});
       await image.remove();
       res.json(true);
   }
};

module.exports = ctrl;