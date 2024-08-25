
const searchFriendServices = require("../services/SearchFriendServices")


const GetUserSearch = async (req, res) => {
    const { UserID, search } = req.query
    const userList = await searchFriendServices.GetUserSearch(UserID, search)
    res.send(userList)
}

const FollowUser = async (req, res) => {
    const { FollowingId, FollowerId } = req.body.params
    const hasBeenFollow = await searchFriendServices.FollowUser(FollowingId, FollowerId)

    if (hasBeenFollow) {
        res.send("SUCCESS")
    } else {
        res.send("ERROR")
    }
}

const UnFollowUser = async (req, res) => {
    const { FollowingId, FollowerId } = req.query
    const hasBeenUnFollow = await searchFriendServices.UnFollowUser(FollowingId, FollowerId)

    if (hasBeenUnFollow) {
        res.send("SUCCESS")
    } else {
        res.send("ERROR")
    }
}

module.exports = {
    GetUserSearch,
    FollowUser,
    UnFollowUser
};