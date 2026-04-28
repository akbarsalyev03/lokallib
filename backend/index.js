import express from 'express';
import booksRouter from './books.js';
import genresRouter from './genres.js';
import usersRouter from './users.js';
import soldRouter from './sold.js';
import authRouter from './auth.js';

const apiRouter = express.Router();

// Parse json inside the router
apiRouter.use(express.json());

// Mount the components
apiRouter.use('/books.php', booksRouter);
apiRouter.use('/genres.php', genresRouter);
apiRouter.use('/users.php', usersRouter);
apiRouter.use('/sold.php', soldRouter);
apiRouter.use('/', authRouter); // handles /login.php and /register.php

export default apiRouter;
