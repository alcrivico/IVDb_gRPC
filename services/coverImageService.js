const fs = require("fs");
const grpc = require("@grpc/grpc-js");
const path = require("path");

function downloadCoverImage(call, callback) {
  const baseDir = path.join(__dirname, "../static/covers");
  const filePath = path.join(baseDir, call.request.path);
  fs.readFile(filePath, "base64", (err, data) => {
    if (err) {
      console.error("No se encontró la imagen: ", err);
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Image not found",
      });
    } else {
      console.log("Imagen encontrada en: ", filePath);
      callback(null, { imageData: data });
    }
  });
}

function uploadCoverImage(call, callback) {
  const { fileName, imageData } = call.request;
  const filePath = path.join(__dirname, "../static/covers", fileName);
  const buffer = Buffer.from(imageData, "base64");

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error al guardar la imagen: ", err);
      callback({
        code: grpc.status.INTERNAL,
        message: "Failed to save image",
      });
    } else {
      console.log("Imagen guardada en: ", filePath);
      callback(null, {
        message: "Image uploaded successfully",
        imageRoute: fileName,
      });
    }
  });
}

function deleteCoverImage(call, callback) {
  const baseDir = path.join(__dirname, "../static/covers");
  const filePath = path.join(baseDir, call.request.path);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("No se encontró la imagen: ", err);
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Image not found",
      });
    } else {
      console.log("Imagen eliminada en: ", filePath);
      callback(null, { message: "Image deleted successfully" });
    }
  });
}

module.exports = {
  downloadCoverImage,
  uploadCoverImage,
  deleteCoverImage,
};
