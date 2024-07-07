const goalController = require('../controllers/GoalController')


function goalRoutes (fastify, options, done){

    fastify.get('/userGoal', goalController.userGoal)
    fastify.post('/addGoal', goalController.addGoal)
    fastify.get("/CheckGoalDuplicate", goalController.CheckDuplicate);

    done()
}

module.exports = goalRoutes