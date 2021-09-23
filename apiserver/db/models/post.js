const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    { timestamps: true }
)

const Post = mongoose.model("Post", postSchema);

module.exports = Post;