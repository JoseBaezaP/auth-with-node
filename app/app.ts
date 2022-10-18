import express, { Request, Response } from 'express';
import morgan from 'morgan';
import { routes } from './routes';

const app = express();

app.use(express.json());

app.use(morgan('dev'));
routes(app);

export default app;