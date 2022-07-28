const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

// find All
module.exports.getUser = (req, res) => {
  // Si id pas connu dans la base
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("User not found : " + req.params.id);

  // findById
  UserModel.findById(req.params.id, (err, user) => {
    if (!err) res.send(user);
    else res.status(400).send("User not found : " + req.params.id);
  }).select("-password");
};

// Update
module.exports.updateUser = async (req, res) => {
  // Si id pas connu dans la base
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("User not found : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
      (err, user) => {
        if (!err) return res.send(user);
        else return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

//delete
module.exports.deleteUser = async (req, res) => {
  // Si id pas connu dans la base
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("User not found : " + req.params.id);

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "User removed successfully" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

// FOLLOW
module.exports.follow = async (req, res) => {
  // Si id pas connu dans la base
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("User not found : " + req.params.id);

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send({ message: err });
      }
    );

    //add to the following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, doc) => {
        if (err) return doc.status(400).send({ message: err });
      }
    );
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

// UNFOLLOW
module.exports.unfollow = async (req, res) => {
  // Si id pas connu dans la base
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("User not found : " + req.params.id);

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send({ message: err });
      }
    );

    //add to the following list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, doc) => {
        if (err) return doc.status(400).send({ message: err });
      }
    );
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
