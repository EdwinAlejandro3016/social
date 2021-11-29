const { Image} = require('../models');
const Comment = require('../models/comment');

module.exports = {
    async newest (){
       const comments = await Comment.find().limit(5).sort({timestamp: -1});
       for(const comment of comments){
           const image = Image.findOne({_id: Comment.image_id});
            comment.image = image;
       }
       return comments;
    }
}