// src/grpcClient.js
const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
require("dotenv").config();

const PROTO_PATH = path.join(__dirname, "../protos/user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;


const userClient = new userProto(
  process.env.USER_SERVICE_URL,
  grpc.credentials.createInsecure()
);

console.log(`gRPC Client connected to ${process.env.USER_SERVICE_URL}`);

module.exports = userClient;