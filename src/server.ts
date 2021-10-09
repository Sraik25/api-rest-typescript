import 'dotenv/config';
import App from './app';
import AuthenticationController from 'authentication/authentication.controller';
import UserController from 'users/user.controller';
import PostController from './post/posts.controller';
import validateEnv from './utils/validateEnv';
import ReportController from 'report/report.controller';

validateEnv();

const app = new App([
  new PostController(),
  new AuthenticationController(),
  new UserController(),
  new ReportController(),
]);

app.listen();
