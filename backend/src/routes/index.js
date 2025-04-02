const siteRouter = require('./site.routes');
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const subjectRouter = require('./subject.routes');
const questionRouter = require('./question.routes');

const routes = (app) => {
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/subject', subjectRouter);
  app.use('/question', questionRouter);
  app.use('/', siteRouter);
};

module.exports = routes;
