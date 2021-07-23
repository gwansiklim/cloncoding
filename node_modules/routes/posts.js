const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require("../middleware/authmiddleware");
const { post, sequelize, Sequelize } = require('../models');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
    }
});

var upload = multer({ storage: storage});

router.get('/', authMiddleware, async (req, res, next) => {
    try {
        const sql = "SELECT p.id, p.content, p.createdAt, p.img, p.user_id, u.name FROM posts AS p JOIN users AS u on p.user_id = u.id ORDER BY p.createdAt DESC";
        const posts = await sequelize.query(sql, {type: Sequelize.QueryTypes.SELECT});

        res.send({posts});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/post', authMiddleware, upload.single("image"), async (req, res, next) => {
   try {
       const {content} = req.body;
       const img = `/images/${req.file.filename}`;

       const post = await post.create({content: content, img: img, user_id: res.locals.user});

       res.send({post: post, result: "success"});
   } catch(err) {
       console.error(err);
       next(err);
   }
});

router.put('/:postId', authMiddleware, upload.single("image"), async (req, res, next) => {
    try {
        const {content} = req.body;
        const {postId} = req.params;
        const img = `/images/${req.file.filename}`;

        const isExist = await post.findOne({
            where: {id: postId, user_id: res.locals.user}
        });

        if (isExist) {
            isExist.content = content;
            isExist.img = img;
            await isExist.save();
        } else {
            await post.create({content: content, img: img, user_id: res.locals.user});
        }
        res.send({result: "success"});
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:postId', authMiddleware, async (req, res) => {
   const { postId } = req.params;
   const { user_Id } = res.locals.user;
   console.log(user_Id)
   const isExist = await post.findOne({
       where: {id: postId, user_id: res.locals.user}
   });
   if(isExist) {
       await isExist.destroy();
   }

   res.send({postId: postId, result: "success" })
});

module.exports = router;