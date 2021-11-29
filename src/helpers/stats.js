const { Image } = require('../models');
const comment = require('../models/comment');

async function imageCounter(){
    return await Image.countDocuments()
}

async function commentCounter(){
    return await comment.countDocuments();
}

async function imageTotalViewsCounter(){
    try{
        const result = await Image.aggregate([{$group: {
            _id: '1',
            viewsTotal: {$sum: '$views'}
        }}]);
        return result[0].viewsTotal;
    }catch(e){
        return 0;
    }
}

async function totalLikesCounter(){
    try{
        const result = await Image.aggregate([{$group:{
            _id: '1',
            likesTotal: {$sum: '$likes'}
    
        }}]);
        return result[0].likesTotal;
    }catch(e){
        return 0;
    }
    
}

module.exports = async()=>{
    const results = await Promise.all([
        imageCounter(),
        commentCounter(),
        imageTotalViewsCounter(),
        totalLikesCounter()
    ])

    return {
        images: results[0],
        comments: results[1],
        views: results[2],
        likes: results[3]
    }
}