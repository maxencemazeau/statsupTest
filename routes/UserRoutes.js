const userController = require('../controllers/UserController');

function userRoutes(fastify, options, done) {
   fastify.post('/userLogin', userController.userLogin);
   fastify.get('/getAllUsers', userController.getAllUsers);
   fastify.get('/user', userController.user)
   fastify.post('/userSignUp', {
      schema: {
         body: {
            type: 'object',
            required: ['email', 'firstName', 'lastName', 'password'],
            properties: {
               email: { type: 'string', format: 'email' },
               firstName: { type: 'string' },
               lastName: { type: 'string' },
               password: { type: 'string' }
            }
         }
      }
   }, userController.userSignUp);

   done();
}

module.exports = userRoutes;
