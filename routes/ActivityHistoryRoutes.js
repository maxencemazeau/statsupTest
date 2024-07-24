const activityHistoryController = require("../controllers/ActivityHistoryController");

function ActivityHistoryRoutes(fastify, options, done) {
    fastify.post("/addActivityHistory", activityHistoryController.addActivityHistory);
    fastify.delete("/deleteActivityHistory", activityHistoryController.DeleteActivityHistory)
    //fastify.put("/updateCompletedActivity", activityController.UpdateCompletedActivity)

    done();
}

module.exports = ActivityHistoryRoutes;
