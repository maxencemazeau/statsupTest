const goalController = require('../controllers/GoalController')


function goalRoutes (fastify, options, done){

    fastify.get('/userGoal', goalController.userGoal)
    fastify.post('/addGoal', goalController.addGoal)

    done()
}

module.exports = goalRoutes