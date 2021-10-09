import { NextFunction, Request, Response, Router } from 'express';
import Controller from 'interfaces/controller.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { Post } from './port.interface';
import CreatePostDto from './post.dto';
import postModel from './posts.model';

class PostController implements Controller {
  public path: string = '/post';
  public router = Router();

  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getThePostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.modifyPost
      )
      .delete(`${this.path}/:id`, this.deletePost)
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreatePostDto),
        this.createPost
      );
  }

  private getAllPosts = async (request: Request, response: Response) => {
    const posts = await this.post.find().populate('author', '-password');
    response.send(posts);
  };

  private getThePostById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const post = this.post.findById(id);
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private modifyPost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const postData: Post = request.body;
    const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private createPost = async (request: RequestWithUser, response: Response) => {
    const postData: CreatePostDto = request.body;
    const createdPost = new this.post({
      ...postData,
      author: request.user._id,
    });

    const savedPost = await createdPost.save();
    await savedPost.populate('author');
    response.send(savedPost);
  };

  private deletePost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.params.id;
    const successResponse = await this.post.findByIdAndDelete(id);

    if (successResponse) {
      response.send(200);
    } else {
      next(new PostNotFoundException(id));
    }
  };
}

export default PostController;
