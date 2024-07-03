import { Request, Response } from 'express';
import express from 'express';
import { z } from 'zod';

import appDataSource from '../config/app-data-source';
import { Comment } from '../entity/comment.entity';
import { validateData } from '../middleware';

const CommentController = express.Router();

export const movieFormSchema = z.object({
  text: z.string().min(3, { message: 'Minimum 3 characters required' }),
});

const createComment = async (req: Request, res: Response) => {
  const { text } = req.body;
  const movieId = req.params.id;

  try {
    const movieComment = appDataSource.getRepository(Comment).create({
      text,
      movieId: movieId,
      userId: req.currentUser.id,
    });
    const result = await appDataSource
      .getRepository(Comment)
      .save(movieComment);

    return res.send_ok('Success', { movie: result });
  } catch (err) {
    console.log(err);
    return res.send_internalServerError('Internal server error');
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const commentId = req.params.id;

  try {
    const movie = await appDataSource.getRepository(Comment).findOneBy({
      id: commentId,
    });

    if (!movie) {
      return res.send_notFound('Movie/Comment not found');
    }

    // Update the user with the new data
    const deleteMovie = await appDataSource.getRepository(Comment).delete({
      id: commentId,
    });

    // Respond with the updated movie
    return res.send_ok('Deleted comment', deleteMovie);
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.send_internalServerError('Internal server error');
  }
};

CommentController.post(
  '/:id/comment',
  validateData(movieFormSchema),
  createComment
);
CommentController.delete('/:movieId/comment/:id', deleteComment);

export { CommentController };
