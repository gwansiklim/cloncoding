const post = require('../../models')

const createPost = async (req, res) => {
    const { userId } = res.locals.user;
    const { content } = req.body;
    const img = `/images/${req.file.filename}`;

    await post.create({ content, img, userId });

    res.send({ result: "success" });
}

module.exports = { createPost }