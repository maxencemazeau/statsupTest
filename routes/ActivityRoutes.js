const activityController = require("../controllers/ActivityController");

function activityRoutes(fastify, options, done) {
  fastify.get("/userActivity", activityController.userActivity);
  fastify.post("/addActivity", activityController.addActivity);
  fastify.get("/activityWithNoGoal", activityController.ActivityWithoutGoal);
  fastify.get("/CheckActivityDuplicate", activityController.CheckDuplicate);
  fastify.delete("/deleteActivity", activityController.DeleteActivity)
  //fastify.put("/updateCompletedActivity", activityController.UpdateCompletedActivity)

  done();
}

module.exports = activityRoutes;
