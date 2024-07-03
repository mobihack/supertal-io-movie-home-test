/* eslint-disable quotes */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1720018080561 implements MigrationInterface {
  name = 'Init1720018080561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar NOT NULL, "movieId" varchar NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "movie" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "coverImageUrl" varchar, "releaseDate" datetime NOT NULL, "duration" integer NOT NULL, "userId" varchar NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "roles" varchar)`
    );
    await queryRunner.query(
      `CREATE TABLE "user_liked_movies_movie" ("userId" varchar NOT NULL, "movieId" varchar NOT NULL, PRIMARY KEY ("userId", "movieId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bc3a33713de6afdb5341a6b7ed" ON "user_liked_movies_movie" ("userId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e9e044f0c163523168bbcf399" ON "user_liked_movies_movie" ("movieId") `
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_comment" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar NOT NULL, "movieId" varchar NOT NULL, CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_aea4918c888422550a85e257894" FOREIGN KEY ("movieId") REFERENCES "movie" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_comment"("id", "text", "userId", "movieId") SELECT "id", "text", "userId", "movieId" FROM "comment"`
    );
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_comment" RENAME TO "comment"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_movie" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "coverImageUrl" varchar, "releaseDate" datetime NOT NULL, "duration" integer NOT NULL, "userId" varchar NOT NULL, CONSTRAINT "FK_ec7ed42b2e89092919129bdf990" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_movie"("id", "title", "description", "coverImageUrl", "releaseDate", "duration", "userId") SELECT "id", "title", "description", "coverImageUrl", "releaseDate", "duration", "userId" FROM "movie"`
    );
    await queryRunner.query(`DROP TABLE "movie"`);
    await queryRunner.query(`ALTER TABLE "temporary_movie" RENAME TO "movie"`);
    await queryRunner.query(`DROP INDEX "IDX_bc3a33713de6afdb5341a6b7ed"`);
    await queryRunner.query(`DROP INDEX "IDX_7e9e044f0c163523168bbcf399"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_user_liked_movies_movie" ("userId" varchar NOT NULL, "movieId" varchar NOT NULL, CONSTRAINT "FK_bc3a33713de6afdb5341a6b7ed5" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_7e9e044f0c163523168bbcf3993" FOREIGN KEY ("movieId") REFERENCES "movie" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "movieId"))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user_liked_movies_movie"("userId", "movieId") SELECT "userId", "movieId" FROM "user_liked_movies_movie"`
    );
    await queryRunner.query(`DROP TABLE "user_liked_movies_movie"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_user_liked_movies_movie" RENAME TO "user_liked_movies_movie"`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bc3a33713de6afdb5341a6b7ed" ON "user_liked_movies_movie" ("userId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e9e044f0c163523168bbcf399" ON "user_liked_movies_movie" ("movieId") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_7e9e044f0c163523168bbcf399"`);
    await queryRunner.query(`DROP INDEX "IDX_bc3a33713de6afdb5341a6b7ed"`);
    await queryRunner.query(
      `ALTER TABLE "user_liked_movies_movie" RENAME TO "temporary_user_liked_movies_movie"`
    );
    await queryRunner.query(
      `CREATE TABLE "user_liked_movies_movie" ("userId" varchar NOT NULL, "movieId" varchar NOT NULL, PRIMARY KEY ("userId", "movieId"))`
    );
    await queryRunner.query(
      `INSERT INTO "user_liked_movies_movie"("userId", "movieId") SELECT "userId", "movieId" FROM "temporary_user_liked_movies_movie"`
    );
    await queryRunner.query(`DROP TABLE "temporary_user_liked_movies_movie"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_7e9e044f0c163523168bbcf399" ON "user_liked_movies_movie" ("movieId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bc3a33713de6afdb5341a6b7ed" ON "user_liked_movies_movie" ("userId") `
    );
    await queryRunner.query(`ALTER TABLE "movie" RENAME TO "temporary_movie"`);
    await queryRunner.query(
      `CREATE TABLE "movie" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "coverImageUrl" varchar, "releaseDate" datetime NOT NULL, "duration" integer NOT NULL, "userId" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "movie"("id", "title", "description", "coverImageUrl", "releaseDate", "duration", "userId") SELECT "id", "title", "description", "coverImageUrl", "releaseDate", "duration", "userId" FROM "temporary_movie"`
    );
    await queryRunner.query(`DROP TABLE "temporary_movie"`);
    await queryRunner.query(
      `ALTER TABLE "comment" RENAME TO "temporary_comment"`
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" varchar PRIMARY KEY NOT NULL, "text" varchar NOT NULL, "userId" varchar NOT NULL, "movieId" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "comment"("id", "text", "userId", "movieId") SELECT "id", "text", "userId", "movieId" FROM "temporary_comment"`
    );
    await queryRunner.query(`DROP TABLE "temporary_comment"`);
    await queryRunner.query(`DROP INDEX "IDX_7e9e044f0c163523168bbcf399"`);
    await queryRunner.query(`DROP INDEX "IDX_bc3a33713de6afdb5341a6b7ed"`);
    await queryRunner.query(`DROP TABLE "user_liked_movies_movie"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "movie"`);
    await queryRunner.query(`DROP TABLE "comment"`);
  }
}
