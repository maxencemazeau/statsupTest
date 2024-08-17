const activityHistoryController = require("../controllers/ActivityHistoryController");

function ActivityHistoryRoutes(fastify, options, done) {
    fastify.post("/addActivityHistory", activityHistoryController.addActivityHistory);
    fastify.delete("/deleteActivityHistory", activityHistoryController.DeleteActivityHistory);
    fastify.get("/getTotalActivityCompleted", activityHistoryController.GetTotalActivityCount)
    fastify.get("/getBestActivityStreak", activityHistoryController.GetBestActivityStreak)
    fastify.get("/getActivityHistory", activityHistoryController.GetActivityHistory)
    //fastify.put("/updateCompletedActivity", activityController.UpdateCompletedActivity)

    done();
}

module.exports = ActivityHistoryRoutes;
