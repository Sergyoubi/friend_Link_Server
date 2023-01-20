import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE POST */
// "createPost" will be imported directly into server bcz we want to handle "file upload" if post has picture
export const createPost = async (req, res) => {
  try {
    const { userId, description, postPicturePath } = req.body;
    const user = await User.findById(userId);
    const filter = {};
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      postPicturePath,
      userPicturePath: user.picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    //find all posts and send it to the Front-end
    const post = await Post.find(filter);
    res.status(201).json(post);
  } catch (error) {
    console.error(
      `Error(${error.name}) from controllers/post.js/createPost(): ${error.message}`
    );
    res.status(409).json({ message: error.message });
  }
};

/* READ POST */
export const getFeedPosts = async (req, res) => {
  // this will grab all user's post (news feed)
  try {
    const filter = {};
    const post = await Post.find(filter);
    res.status(200).json(post);
  } catch (error) {
    console.error(
      `Error(${error.name}) from controllers/post.js/getFeedPosts(): ${error.message}`
    );
    res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  // this will grab one user's post (news feed)
  try {
    const { userId } = req.params;
    const filter = { userId };
    const post = await Post.find(filter);
    res.status(200).json(post);
  } catch (error) {
    console.error(
      `Error(${error.name}) from controllers/post.js/getUserPosts(): ${error.message}`
    );
    res.status(404).json({ message: error.message });
  }
};

/* UPDATE */
export const likePosts = async (req, res) => {
  try {
    const { id } = req.params; //post's id
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId); // returns "true" if user "_id" is in the "likes Map (object)"

    if (isLiked) {
      post.likes.delete(userId); // we don't want to add "userId" in the likes Map again
    } else {
      post.likes.set(userId, true); // post.isLiked.set(userId, true); // add user's id to the Map()
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes }, //the new like Map()
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(
      `Error(${error.name}) from controllers/post.js/likePosts(): ${error.message}`
    );
    res.status(404).json({ message: error.message });
  }
};

export const commentPosts = async (req, res) => {
  try {
    const { id } = req.params; //post's id
    const { name, comment } = req.body;
    const post = await Post.findById(id);
    post.comments.push({ name, comment });
    await post.save();
    const updatedPost = await Post.findById(id);

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(
      `Error(${error.name}) from controllers/post.js/commentPosts(): ${error.message}`
    );
    res.status(404).json({ message: error.message });
  }
};
