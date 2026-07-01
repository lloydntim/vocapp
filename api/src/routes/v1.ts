import { Router } from 'express';
import authRoutes from '../features/auth/auth.routes.js';
import languageRoutes from '../features/languages/language.routes.js';
import listRoutes from '../features/lists/list.routes.js';
import userRoutes from '../features/users/user.routes.js';

const v1Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/lists', listRoutes);
v1Router.use('/languages', languageRoutes);

export default v1Router;
