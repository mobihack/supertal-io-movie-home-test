import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: null, nullable: true })
  coverImageUrl: string;

  @Column('datetime')
  releaseDate: string;

  @Column()
  duration: number;

  @Column({ type: 'uuid' })
  userId: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @JoinTable()
  @OneToMany(() => Comment, (comment) => comment.movie, {
    cascade: true,
  })
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.likedMovies, {
    cascade: true,
  })
  likedByUsers: User[];
}
