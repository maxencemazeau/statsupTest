const profilController = require("../controllers/ProfilController");

function profilRoutes(fastify, options, done) {

    fastify.get("/getProfilInfoAndStats", profilController.GetProfilInfoAndStats);
    fastify.get("/getActivityProfilList", profilController.GetActivityProfilList)
    done();
}

module.exports = profilRoutes;
