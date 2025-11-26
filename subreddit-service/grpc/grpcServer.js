const grpc = require("@grpc/grpc-js");
const server = new grpc.Server();

exports.startGrpcServer = function () {
  server.bindAsync(
    "127.0.0.1:50052",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error("Failed to bind gRPC server:", error);
      } else {
        console.log(`gRPC server running at http://127.0.0.1:${port}`);
        server.start();
      }
    }
  );
};

exports.getGrpcServer = function () {
  return server;
};
