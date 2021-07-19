const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const { Op } = require("sequelize");

const userSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  birth: Joi.number(),
  gender: Joi.string(),
});

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { email, name, password, birth, gender } =
      await userSchema.validateAsync(req.body);

    if (!(email && name && password)) {
      res.status(401).send({
        errorMessage: "가입에 필요한 형식이 올바르지 않습니다.",
      });
      return;
    }
    const existUsers = await Users.findAll({
      where: {
        [Op.or]: [{ email }, { name }],
      },
    });
    if (existUsers.length) {
      res.status(401).send({
        errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
      });
      return;
    }
    if (!birth) {
      res.status(401).send({
        errorMessage: "생일에 대한 형식이 올바르지 않습니다.",
      });
    }
    if (!gender) {
      res.status(401).send({
        errorMessage: "성별을 정확히 기입해 주세요.",
      });
    }
    await Users.create({ email, name, password, birth, gender });
    res.send({});
  } catch (err) {
    console.log(err);
    res.status(401).send({
      errorMessage: "가입시 필요한 정보가 올바르지 않습니다.",
    });
  }
});
module.exports = router;
