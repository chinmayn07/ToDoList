const { expect } = require("chai");
const sinon = require("sinon");
const request = require("supertest");
const app = require("../app");
const Todo = require("../models/to-do");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

describe("Todo Routes", () => {
  let server;
  let authToken;
  let userId;

  before((done) => {
    server = app.listen(4000, () => {
      console.log("Test server running on port 4000");
      done();
    });
  });

  after((done) => {
    server.close(done);
  });

  beforeEach(async () => {
    await Todo.deleteMany({});
    await User.deleteMany({});

    // Register a user and get the authToken
    const hashedPassword = await bcrypt.hash("testpassword", 10);
    const user = await User.create({
      username: "testuser",
      password: hashedPassword,
    });
    userId = user._id;
    authToken = jwt.sign({ userId: user._id }, "secret_key_encoder", {
      expiresIn: "1h",
    });
  });

  it("should create a new todo item", async () => {
    const res = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        userId,
        title: "New Todo",
        description: "This is a new todo item",
      });

    expect(res.status).to.equal(201);
    expect(res.body)
      .to.have.property("message")
      .equal("Todo created successfully");
  });

  it("should fetch all todo items", async () => {
    await Todo.create({
      userId,
      title: "Todo 1",
      description: "Description 1",
    });
    await Todo.create({
      userId,
      title: "Todo 2",
      description: "Description 2",
    });

    const res = await request(app)
      .get("/todos")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.has.lengthOf(2);
  });

  it("should update a todo item", async () => {
    const todo = await Todo.create({
      userId,
      title: "Todo 1",
      description: "Description 1",
    });

    const res = await request(app)
      .put(`/todos/${todo._id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        userId,
        title: "Updated Todo",
        description: "This is an updated todo item",
      });

    expect(res.status).to.equal(200);
    expect(res.body)
      .to.have.property("message")
      .equal("Todo updated successfully");
  });

  it("should delete a todo item", async () => {
    const todo = await Todo.create({
      userId,
      title: "Todo 1",
      description: "Description 1",
    });

    const res = await request(app)
      .delete(`/todos/${todo._id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).to.equal(200);
    expect(res.body)
      .to.have.property("message")
      .equal("Todo deleted successfully");
  });
});
