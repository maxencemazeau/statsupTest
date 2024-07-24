const goalController = require('../controllers/GoalController')


function goalRoutes(fastify, options, done) {

    fastify.get('/userGoal', goalController.userGoal)
    fastify.post('/addGoal', goalController.addGoal)
    fastify.get("/CheckGoalDuplicate", goalController.CheckDuplicate);
    fastify.delete("/deleteGoal", goalController.DeleteGoal)
    fastify.get("/getAllUserGoal", goalController.GetAllUserGoal)
    done()
}

module.exports = goalRoutes