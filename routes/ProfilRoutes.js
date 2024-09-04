const profilController = require("../controllers/ProfilController");

function profilRoutes(fastify, options, done) {

    fastify.get("/getProfilInfoAndStats", profilController.GetProfilInfoAndStats);
    fastify.get("/getActivityProfilList", profilController.GetActivityProfilList);
    fastify.get("/getBestGoalStreak", profilController.GetBestGoalStreak)
    fastify.put("/changeProfilPhoto", profilController.ChangeProfilPhoto)
    done();
}

module.exports = profilRoutes;
