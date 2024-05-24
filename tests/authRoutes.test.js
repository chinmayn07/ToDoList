const { expect } = require("chai");
const sinon = require("sinon");
const request = require("supertest");
const app = require("../app");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

describe("Authentication Routes", () => {
  let server;
  let registerStub;
  let loginStub;
  let bcryptCompareStub;

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
    await User.deleteMany({});
    registerStub = sinon.stub(User, "create");
    loginStub = sinon.stub(User, "findOne");
    bcryptCompareStub = sinon.stub(bcrypt, "compare");
  });

  afterEach(() => {
    registerStub.restore();
    loginStub.restore();
    bcryptCompareStub.restore();
  });

  it("should register a new user", async () => {
    registerStub.resolves({ username: "newuser" });

    const res = await request(app)
      .post("/auth/register")
      .send({ username: "newuser", password: "newpassword" });

    expect(res.status).to.equal(201);
    expect(res.body)
      .to.have.property("message")
      .equal("User registered successfully");
  });

  it("should log in an existing user", async () => {
    loginStub.resolves({ username: "testuser", password: "hashedpassword" });
    bcryptCompareStub.resolves(true);

    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "testpassword" });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });
});
