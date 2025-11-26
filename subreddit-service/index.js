// index.js
const { getGrpcServer, startGrpcServer } = require("./grpc/grpcServer");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const path = require("path");
const db = require("./config/db");
// const subredditImplementation = require("./grpc/userService");

const PROTO_PATH = path.join(__dirname, "proto/subreddit.proto"); // Note the path change

// 1. Connect to DB
db.connect()
  .then(() => console.log("Connected to database successfully."))
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1); // Exit if DB connection fails
  });

// 2. Load Proto definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  defaults: true,
  oneofs: true,
});
const subreddit_proto = grpc.loadPackageDefinition(packageDefinition).UserService.service; // Get the service definition

// 3. Start gRPC server and add the service
startGrpcServer();
const server = getGrpcServer();
server.addService(subreddit_proto, subredditImplementation);

console.log("gRPC server initialized with UserService.");
