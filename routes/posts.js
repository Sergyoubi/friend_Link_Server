import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePosts,
  commentPosts,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/authorization.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); // get user feed when we're on the home page
router.get("/:userId/posts", verifyToken, getUserPosts); // get one user's post
/* UPDATE */
router.patch("/:id/like", verifyToken, likePosts); // for like and unlike a post
router.patch("/:id/comment", verifyToken, commentPosts);

export default router;
