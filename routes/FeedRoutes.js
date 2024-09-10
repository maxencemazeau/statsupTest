const feedController = require("../controllers/FeedController")

function feedRoutes(fastify, options, done) {

    fastify.get("/getFeed", feedController.GetFeed)

    done()
}

module.exports = feedRoutes