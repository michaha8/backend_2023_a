import Post from '../models/post_model';
import { Request, Response } from 'express';
import User from '../models/user_model';

const getAllPostsEvent = async () => {
  console.log('getAllPostsEventgetAllPostsEventgetAllPostsEvent');
  try {
    const posts = await Post.find();
    return { status: 'OK', data: posts };
  } catch (err) {
    return { status: 'FAIL', data: '' };
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    let posts: any[] = [];
    console.log('here getting posts');
    if (req.query.sender == null) {
      posts = await Post.find();
      const promises = posts.map(async (p) => {
        const { image, name } = await getUserData(p.sender);
        return {
          ...p._doc,
          userImage: image,
          username: name,
        };
      });
      posts = await Promise.all(promises);
    } else {
      posts = await Post.find({ sender: req.query.sender });
    }
    res.status(200).send(posts);
  } catch (err) {
    res.status(400).send({ error: 'fail to get posts from db' });
  }
};

async function getUserData(id: string) {
  try {
    console.log('getUserImageById');
    try {
      const user = await User.findById(id);
      return { image: user?.image || '', name: user?.name||'' };
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log({ err });
  }
}

const getPostById = async (req: Request, res: Response) => {
  console.log(req.params.id);

  try {
    const posts = await Post.findById(req.params.id);
    res.status(200).send(posts);
  } catch (err) {
    res.status(400).send({ error: 'fail to get posts from db' });
  }
};

const addNewPost = async (req: Request, res: Response) => {
  console.log('addNewPostaddNewPost', req.body);
  const post = new Post({
    message: req.body.message,
    sender: req.body.userId,
    image: req.body.image,
  });

  try {
    const newPost = await post.save();
    console.log('save post in db');
    res.status(200).send(newPost);
  } catch (err) {
    console.log('fail to save post in db', err);
    res.status(400).send({ error: 'fail adding new post to db' });
  }
};

const putPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send(post);
  } catch (err) {
    console.log('fail to update post in db');
    res.status(400).send({ error: 'fail adding new post to db' });
  }
};

export = {
  getAllPosts,
  addNewPost,
  getPostById,
  putPostById,
  getAllPostsEvent,
};
