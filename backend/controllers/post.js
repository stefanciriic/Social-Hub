const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const { text, id } = req.body;
    const post = await new Post({ content: text, postedBy: id }).save();
    await post.populate({
      path: "postedBy",
      select: "firstName lastName",
    });

    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const followingTemp = await User.findById(req.user.id).select("following");
    const following = followingTemp.following;

    const promises = following.map((user) => {
      return Post.find({ postedBy: user })
        .populate("postedBy", "firstName lastName profilePicture username")
        .populate(
          "comments.commentBy",
          "firstName lastName profilePicture username"
        )
        .sort({ createdAt: -1 })
        .limit(10);
    });
    const followingPosts = await (await Promise.all(promises)).flat();

    const userPosts = await Post.find({ postedBy: req.user.id })
      .populate("postedBy", "firstName lastName profilePicture username")
      .populate(
        "comments.commentBy",
        "firstName lastName profilePicture username"
      )
      .sort({ createdAt: -1 })
      .limit(10);

    const allPosts = [...followingPosts, ...userPosts];
    allPosts.sort((a, b) => b.createdAt - a.createdAt);
    res.json(allPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.comment = async (req, res) => {
  try {
    const { comment, postId } = req.body;
    let newComments = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            comment: comment,
            commentBy: req.user.id,
            commentAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    ).populate("comments.commentBy", "firstName lastName username");
    res.json(newComments.comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post does not exists!" });
    }
    const userId = req.user.id;
    const likes = post.likes;

    const isLiked = likes.includes(userId);

    if (isLiked) {
      post.likes = likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({ message: "Success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const userId = req.user.id;

    const comment = await Post.findOne(
      { _id: postId },
      { comments: { $elemMatch: { _id: commentId } } }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment does not exists!" });
    }

    const likes = comment.comments[0].likes;

    const isLiked = likes.includes(userId);

    if (isLiked) {
      comment.comments[0].likes = likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      comment.comments[0].likes.push(userId);
    }

    await comment.save();
    res.json({ message: "Success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const userId = req.user.id;

    if (
      post.postedBy.toString() === userId ||
      comment.commentBy.toString() === userId
    ) {
      post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
      await post.save();
      return res.json({ message: "Comment deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
