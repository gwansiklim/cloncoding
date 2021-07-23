const postController = require('./constroller/post');
const post = require('../models');
const httpMocks = require('node-mocks-http');

post.create = jest.fn();

describe("post controller create", () => {
    it("should have a createPost function", () => {
        expect(typeof postController.createPost).toBe("function");
    })
    it("should call post.create", () => {
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const next = null;

        req.body = {
            "content": "hi"
        }
        req.file = {
            "image": "123123.jpg"
        }
        res.locals.user = 2;
        console.log(req, res.locals)
        postController.createPost(req, res, next);

        expect(post.create).toBeCalled();
    });


});