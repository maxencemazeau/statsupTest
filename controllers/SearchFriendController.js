
const searchFriendServices = require("../services/SearchFriendServices")
const { ConvertPhotoToUri } = require("../utils/convertPhotoToUri");

const GetUserSearch = async (req, res) => {
    const { UserID, search } = req.query
    const userList = await searchFriendServices.GetUserSearch(UserID, search)
    if (userList.length > 0) {
        for (i = 0; i < userList.length; i++) {
            if (userList[i].Photo !== null) {
                userList[i].Photo = ConvertPhotoToUri(userList[i].Photo)
            }
        }
    }
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