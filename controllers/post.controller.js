const { response } = require("express");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");

module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data: " + err);
  }).sort({ createdAt: -1 });
};

module.exports.createPost = async (req, res) => {
  let fileName;
  if (req.file != null) {
    try {
      if (
        req.file.mimetype != "image/jpg" &&
        req.file.mimetype != "image/png" &&
        req.file.mimetype != "image/jpeg"
      )
        throw Error("INVALID file");

      if (req.file.size > 500000) throw Error("max size");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(400).json({ errors });
    }
    fileName = req.body.posterId + Date.now() + ".jpg";

    // save l'image
    fs.writeFile(
      `${__dirname}/../client/public/uploads/posts/${fileName}`,
      req.file.buffer,
      (err) => {
        if (err) throw Error("Erreur lors de l'upload de l'image");
      }
    );
  }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file != null ? "./uploads/posts/" + fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.send.status(400).send(err);
  }
};

module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Post not found : " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: updatedRecord,
    },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Pb update post : " + err);
    }
  );
};

module.exports.deletePost = (req, res) => {
  // Si id pas connu dans la base
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Post not found : " + req.params.id);

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Pb delete post : " + err);
  });
};

module.exports.likePost = async (req, res) => {
  // Si id pas connu dans la base
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Post not found : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likers: req.body.id } },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );

    await UserModel.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.params.id } },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.send.status(400).send(err);
  }
};

module.exports.unlikePost = async (req, res) => {
  // Si id pas connu dans la base
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Post not found : " + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.id } },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );

    await UserModel.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.params.id } },
      (err, docs) => {
        if (!err) res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.send.status(400).send(err);
  }
};

module.exports.commentPost = (req, res) => {
  // Si id pas connu dans la base
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Post not found : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, doc) => {
        if (!err) return res.send(doc);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.editCommentPost = (req, res) => {
  // Si id pas connu dans la base
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Post not found : " + req.params.id);

  try {
    return PostModel.findById(req.params.id, (err, docs) => {
      const theComment = docs.comments.find((comment) =>
        comment._id.equals(req.body.commentId)
      );
      if (!theComment) return res.status(404).send("comment Not found");
      theComment.text = req.body.text;

      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deleteCommentPost = (req, res) => {
  // Si id pas connu dans la base
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("Post not found : " + req.params.id);

  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.status(200).send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
