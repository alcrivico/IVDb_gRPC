const fs = require("fs");
const grpc = require("@grpc/grpc-js");

function getCoverImage(call, callback) {
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

module.exports = {
  getCoverImage,
};
