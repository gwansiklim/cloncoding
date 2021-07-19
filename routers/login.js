const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/login", async (req, res) => {
  const { email, password } = await loginSchema.validateAsync(req.body);
  const user = await Users.findOne({ where: { email, password } });

  if (!user) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
    });
    return;
  }

  const token = jwt.sign({ userId: user.userId }, "my-secret-key");
  res.send({
    token,
  });
});

module.exports = router;
