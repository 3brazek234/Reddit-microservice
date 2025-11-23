// index.js
const { getGrpcServer, startGrpcServer } = require("./grpc/grpcServer");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const path = require("path");
const postServices = require("./grpc/postServices");

const PROTO_PATH = path.join(__dirname, "protos/post.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});
const post_proto = grpc.loadPackageDefinition(packageDefinition);

startGrpcServer();
const server = getGrpcServer();

server.addService(post_proto.PostService.service, postServices);
