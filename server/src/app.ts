import 'reflect-metadata';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import responser from 'responser';

import { config } from './config';
import appDataSource from './config/app-data-source';
import { UserController, UserPrivateController } from './controllers';
import { CommentController } from './controllers/comment.controller';
import { MovieController } from './controllers/movie.controller';
import { privateAuthMiddleware } from './middleware';

// establish database connection
appDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const app: Express = express();

app.use(responser);
app.use(bodyParser.json());

// Helmet is used to secure this app by configuring the http-header
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: [config.cors_origin, 'https://localhost', 'https://localhost:3000'],
    credentials: true,
  })
);

app.use(cookieParser());

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'success', data: 'Hello World!' });
});

app.use('/api/auth', UserController);
app.use('/api/auth', privateAuthMiddleware, UserPrivateController);

app.use('/api/movies', privateAuthMiddleware, MovieController);
app.use('/api/movies', privateAuthMiddleware, CommentController);

export { app };
