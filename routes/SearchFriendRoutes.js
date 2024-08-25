const searchFriendController = require("../controllers/SearchFriendController");

function searchFriendRoutes(fastify, options, done) {

    fastify.get("/getSearchUser", searchFriendController.GetUserSearch);
    fastify.post("/followUser", searchFriendController.FollowUser)
    fastify.delete("/unFollowUser", searchFriendController.UnFollowUser)
    done();
}

module.exports = searchFriendRoutes;
