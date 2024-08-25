const profilController = require("../controllers/ProfilController");

function profilRoutes(fastify, options, done) {

    fastify.get("/getProfilInfoAndStats", profilController.GetProfilInfoAndStats);
    done();
}

module.exports = profilRoutes;
