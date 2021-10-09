import NotAuthorizedException from 'exceptions/NotAuthorizedException';
import { NextFunction, Response, Router } from 'express';
import Controller from 'interfaces/controller.interface';
import RequestWithUser from 'interfaces/requestWithUser.interface';
import authMiddleware from 'middleware/auth.middleware';
import postModel from 'post/posts.model';

class UserController implements Controller {
  public path: string = '/user';
  public router: Router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id/posts`,
      authMiddleware,
      this.getAllPostsOfUser
    );
  }

  private getAllPostsOfUser = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    const userId = request.params.id;

    if (userId === request.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      response.send(posts);
    }
    next(new NotAuthorizedException());
  };
}

export default UserController;
