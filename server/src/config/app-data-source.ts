import { join } from 'path';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'sqlite',
  database: join(process.cwd(), 'db', 'database.sqlite'),
  entities: [join(__dirname, '/../entity/*.entity.{js,ts}')],
  logging: true,
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  migrations: [join(__dirname, '/../migrations/*.{js,ts}')],
});
