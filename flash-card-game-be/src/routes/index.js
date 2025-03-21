const siteRouter = require('./site.routes');
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');

const routes = (app) => {
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/', siteRouter);
};

module.exports = routes;
