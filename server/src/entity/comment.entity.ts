import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Movie } from './movie.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  movieId: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user)
  user: User;

  @JoinColumn({ name: 'movieId' })
  @ManyToOne(() => Movie, (movie) => movie)
  movie: Movie;
}
