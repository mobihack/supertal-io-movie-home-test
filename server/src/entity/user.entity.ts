import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { bcryptService } from '../services';
import { Movie } from './movie.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    default: null,
    nullable: true,
  })
  roles: string;

  @JoinTable()
  @OneToMany(() => Movie, (movie) => movie.user, {
    cascade: true,
  })
  movies: Movie[];

  @ManyToMany(() => Movie, (movie) => movie.likedByUsers)
  @JoinTable({
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'movieId',
      referencedColumnName: 'id',
    },
  })
  likedMovies: Movie[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = bcryptService().password({ password: this.password });
    }
  }
}
