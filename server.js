require("dotenv").config();
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Cargar el archivo .proto
const PROTO_PATH = path.join(__dirname, "./proto/fileServices.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const fileServicesProto =
  grpc.loadPackageDefinition(packageDefinition).fileServices;

// Importar servicios
const profileImageService = require("./services/profileImageService");
const coverImageService = require("./services/coverImageService");

// Configuración y lanzamiento del servidor
function main() {
  const server = new grpc.Server();

  server.addService(
    fileServicesProto.ProfileImageService.service,
    profileImageService
  );
  server.addService(
    fileServicesProto.CoverImageService.service,
    coverImageService
  );

  port = process.env.PORT;

  server.bindAsync(
    port,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error(`Error al iniciar el servidor: ${error.message}`);
        return;
      }
      console.log(`Servidor gRPC escuchando en el puerto: ${process.env.PORT}`);
    }
  );
}

main();
