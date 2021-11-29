const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const commentSchema = new Schema({
    img_id: { type: ObjectId },
    name: { type: String},
    email: { type: String},
    comment: { type: String},
    timestamp: { type: Date, default: Date.now},
    gravatar: { type: String}
});


module.exports = mongoose.model('comment', commentSchema); 