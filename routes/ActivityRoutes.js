const activityController = require("../controllers/ActivityController");

function activityRoutes(fastify, options, done) {
  fastify.get("/userActivity", activityController.userActivity);

  fastify.post("/addActivity", activityController.addActivity);

  fastify.get("/activityWithNoGoal", activityController.ActivityWithoutGoal);

  fastify.get("/CheckActivityDuplicate", activityController.CheckDuplicate);

  try {
    fastify.delete("/deleteActivity", activityController.DeleteActivity)
  } catch (err) {
    console.log(err)
  }

  done();
}

module.exports = activityRoutes;
