const FriendController = require('../controllers/FriendController')


function friendRoutes(fastify, options, done) {

    fastify.get('/getFriendList', FriendController.GetFriendList)
    done()
}

module.exports = friendRoutes