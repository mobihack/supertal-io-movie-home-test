import { Request, Response } from 'express';
import express from 'express';
import { z } from 'zod';

import appDataSource from '../config/app-data-source';
import { UserRoles } from '../constants/user-role.constant';
import { Movie } from '../entity/movie.entity';
import { User } from '../entity/user.entity';
import { validateData } from '../middleware';

const MovieController = express.Router();

export const movieFormSchema = z.object({
  title: z.string().min(3, { message: 'Minimum 3 characters required' }),
  description: z.string().min(5, { message: 'Minimum 5 characters required' }),
  releaseDate: z.string().datetime(),
  duration: z.coerce.number().min(1, { message: 'Minimum 1 minute required' }),
  coverImageUrl: z.union([z.literal(''), z.string().trim().url()]),
});

const createMovie = async (req: Request, res: Response) => {
  const { title, description, releaseDate, duration, coverImageUrl } = req.body;

  if (req.currentUser.roles !== UserRoles.ADMIN) {
    res.send_forbidden('You should be admin to do this operation');
  }

  try {
    const movie = appDataSource.getRepository(Movie).create({
      title,
      description,
      releaseDate,
      duration,
      coverImageUrl,
      userId: req.currentUser.id,
    });
    const result = await appDataSource.getRepository(Movie).save(movie);

    return res.send_ok('Success', { movie: result });
  } catch (err) {
    console.log(err);
    return res.send_internalServerError('Internal server error');
  }
};

const updateMovie = async (req: Request, res: Response) => {
  const movieId = req.params.id;

  if (req.currentUser.roles !== UserRoles.ADMIN) {
    res.send_forbidden('You should be admin to do this operation');
  }

  const { title, description, releaseDate, duration } = req.body;

  try {
    const movie = await appDataSource.getRepository(Movie).findOneBy({
      id: movieId,
      userId: req.currentUser.id,
    });

    if (!movie) {
      return res.send_notFound('Movie not found');
    }

    // Update the movie with the new data
    const updatedMovie = await appDataSource.getRepository(Movie).save({
      id: movieId,
      title,
      description,
      releaseDate,
      duration,
    });

    // Respond with the updated movie
    return res.send_ok('Updated movie', updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    return res.send_internalServerError('Internal server error');
  }
};

const likeMovie = async (req: Request, res: Response) => {
  const movieId = req.params.id;

  try {
    const movie = await appDataSource.getRepository(Movie).findOneBy({
      id: movieId,
    });
    const user = await appDataSource.getRepository(User).findOne({
      where: { id: req.currentUser.id },
      relations: ['likedMovies'],
    });

    if (!movie || !user) {
      return res.send_notFound('Movie not found');
    }

    // Update the movie with the new data
    user.likedMovies.push(movie);
    const updatedUser = await appDataSource.getRepository(User).save(user);

    // Respond with the updated movie
    return res.send_ok('Updated movie', updatedUser);
  } catch (error) {
    console.error('Error updating movie:', error);
    return res.send_internalServerError('Internal server error');
  }
};

const unlikeMovie = async (req: Request, res: Response) => {
  const movieId = req.params.id;

  try {
    const movie = await appDataSource.getRepository(Movie).findOneBy({
      id: movieId,
    });
    const user = await appDataSource.getRepository(User).findOne({
      where: { id: req.currentUser.id },
      relations: ['likedMovies'],
    });

    if (!movie || !user) {
      return res.send_notFound('Movie not found');
    }

    // Update the movie with the new data
    console.log(movieId, user.likedMovies);

    const updatedUser = await appDataSource.getRepository(User).save({
      ...user,
      likedMovies: user.likedMovies.filter((movie) => movie.id !== movieId),
    });

    // Respond with the updated movie
    return res.send_ok('Updated movie', updatedUser);
  } catch (error) {
    console.error('Error updating movie:', error);
    return res.send_internalServerError('Internal server error');
  }
};

const getAllLikedMovies = async (req: Request, res: Response) => {
  try {
    const user = await appDataSource.getRepository(User).findOne({
      where: { id: req.currentUser.id },
      relations: ['likedMovies'],
    });

    if (!user) {
      return res.send_notFound('Movie not found');
    }

    // Respond with the liked movies
    return res.send_ok('Liked movies', {
      movies: user.likedMovies.map((m) => ({
        ...m,
        isLiked: true,
      })),
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return res.send_internalServerError('Internal server error');
  }
};

const getMovieLikes = async (req: Request, res: Response) => {
  const movieId = req.params.id;

  try {
    const user = await appDataSource.getRepository(User).findOne({
      where: { id: req.currentUser.id, likedMovies: { id: movieId } },
      relations: ['likedMovies'],
    });

    if (!user) {
      return res.send_notFound('Movie not found');
    }

    // Respond with the liked movies
    return res.send_ok('Updated movie', user.likedMovies);
  } catch (error) {
    console.error('Error updating movie:', error);
    return res.send_internalServerError('Internal server error');
  }
};

const deleteMovie = async (req: Request, res: Response) => {
  const movieId = req.params.id;

  if (req.currentUser.roles !== UserRoles.ADMIN) {
    res.send_forbidden('You should be admin to do this operation');
  }

  try {
    const movie = await appDataSource.getRepository(Movie).findOne({
      where: { id: movieId },
      relations: ['likedByUsers'],
    });

    if (!movie) {
      return res.send_notFound('Movie not found');
    }

    // Remove the references in the likedByUsers relation
    movie.likedByUsers = [];
    await appDataSource.getRepository(Movie).save(movie);

    // delete movie
    await appDataSource.getRepository(Movie).delete({
      id: movieId,
    });

    return res.send_ok('Deleted movie');
  } catch (error) {
    console.error('Error deleting movie:', error);
    return res.send_internalServerError('Internal server error');
  }
};

const getAllMovies = async (req: Request, res: Response) => {
  try {
    const movies = await appDataSource.getRepository(Movie).find({
      relations: ['likedByUsers'],
    });

    return res.send_ok('Success', {
      movies: movies.map((m) => ({
        ...m,
        isLiked: Boolean(
          m.likedByUsers.find((u) => u.id === req.currentUser.id)
        ),
      })),
    });
  } catch (err) {
    console.log(err);
    return res.send_internalServerError('Internal server error');
  }
};

const getMovie = async (req: Request, res: Response) => {
  const movieId = req.params.id;

  try {
    const movie = await appDataSource.getRepository(Movie).findOne({
      where: { id: movieId },
      relations: {
        likedByUsers: true,
        comments: {
          user: true,
        },
      },
    });

    if (!movie) {
      return res.send_notFound('Movie not found');
    }

    // Respond with the updated movie
    return res.send_ok('Requested Movie', {
      ...movie,
      isLiked: Boolean(
        movie.likedByUsers.find((u) => u.id === req.currentUser.id)
      ),
    });
  } catch (error) {
    console.error('Error selecting movie:', error);
    return res.send_internalServerError('Internal server error');
  }
};

MovieController.post('/', validateData(movieFormSchema), createMovie);
MovieController.get('/', getAllMovies);
MovieController.get('/liked', getAllLikedMovies);
MovieController.patch(
  '/:id',
  validateData(movieFormSchema.partial()),
  updateMovie
);
MovieController.get('/:id', getMovie);
MovieController.delete('/:id', deleteMovie);

MovieController.get('/:id', getMovie);
MovieController.post('/:id/like', likeMovie);
MovieController.delete('/:id/like', unlikeMovie);
MovieController.get('/:id/like', getMovieLikes);

export { MovieController };
