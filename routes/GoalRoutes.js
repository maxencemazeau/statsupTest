const goalController = require('../controllers/GoalController')


function goalRoutes(fastify, options, done) {

    fastify.get('/userGoal', goalController.userGoal)
    fastify.post('/addGoal', goalController.addGoal)
    fastify.get("/CheckGoalDuplicate", goalController.CheckDuplicate);
    fastify.put("/deleteGoal", goalController.DeleteGoal)
    fastify.get("/getAllUserGoal", goalController.GetAllUserGoal)
    fastify.put("/updateGoal", goalController.UpdateGoal)
    fastify.get("/getUserGoalByID", goalController.GetUserGoalByID)
    fastify.get("/getLinkedActivityToGoal", goalController.GetLinkedActivityToGoal)
    fastify.get("/getAllActivityGoalStats", goalController.GetAllActivityStatsForGoal)
    done()
}

module.exports = goalRoutes