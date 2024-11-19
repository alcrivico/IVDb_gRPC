const fs = require("fs");
const grpc = require("@grpc/grpc-js");

function getProfileImage(call, callback) {
  const filePath = call.request.path;
  fs.readFile(filePath, "base64", (err, data) => {
    if (err) {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Image not found",
      });
    } else {
      callback(null, { imageData: data });
    }
  });
}

function uploadProfileImage(call, callback) {
  const { fileName, imageData } = call.request;
  const filePath = path.join(__dirname, "../static/profiles", fileName);
  const buffer = Buffer.from(imageData, "base64");

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      callback({
        code: grpc.status.INTERNAL,
        message: "Failed to save image",
      });
    } else {
      callback(null, { message: "Image uploaded successfully", filePath });
    }
  });
}

module.exports = {
  getProfileImage,
  uploadProfileImage,
};
