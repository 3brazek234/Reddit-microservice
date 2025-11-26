// src/clients/userClient.js
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const USER_PROTO_PATH = path.resolve(__dirname, "../protos/post.proto");

const packageDefinition = protoLoader.loadSync(USER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "localhost:50050";

const userClient = new userProto(
  USER_SERVICE_URL,
  grpc.credentials.createInsecure()
);

module.exports = userClient;
