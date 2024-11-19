const fs = require("fs");
const path = require("path");
const grpc = require("@grpc/grpc-js");
const profileImageService = require("../services/profileImageService");

jest.mock("fs");

describe("ProfileImageService", () => {
  test("should return image data if file exists", (done) => {
    const call = {
      request: {
        path: "test.jpg",
      },
    };

    const callback = (error, response) => {
      expect(error).toBeNull();
      expect(response).toEqual({ imageData: "fakeImageData" });
      done();
    };

    fs.readFile.mockImplementation((filePath, encoding, cb) => {
      cb(null, "fakeImageData");
    });

    profileImageService.getProfileImage(call, callback);
  });

  test("should return error if file does not exist", (done) => {
    const call = {
      request: {
        path: "nonexistent.jpg",
      },
    };

    const callback = (error, response) => {
      expect(error).toEqual({
        code: grpc.status.NOT_FOUND,
        message: "Image not found",
      });
      expect(response).toBeUndefined();
      done();
    };

    fs.readFile.mockImplementation((filePath, encoding, cb) => {
      cb(new Error("File not found"));
    });

    profileImageService.getProfileImage(call, callback);
  });

  test("should upload image successfully", (done) => {
    const call = {
      request: {
        fileName: "test.jpg",
        imageData: "fakeImageData",
      },
    };

    const callback = (error, response) => {
      expect(error).toBeNull();
      expect(response).toEqual({
        message: "Image uploaded successfully",
        imageRoute: path.join(__dirname, "../static/profiles/test.jpg"),
      });
      done();
    };

    fs.writeFile.mockImplementation((filePath, buffer, cb) => {
      cb(null);
    });

    profileImageService.uploadProfileImage(call, callback);
  });

  test("should return error if failed to save image", (done) => {
    const call = {
      request: {
        fileName: "test.jpg",
        imageData: "fakeImageData",
      },
    };

    const callback = (error, response) => {
      expect(error).toEqual({
        code: grpc.status.INTERNAL,
        message: "Failed to save image",
      });
      expect(response).toBeUndefined();
      done();
    };

    fs.writeFile.mockImplementation((filePath, buffer, cb) => {
      cb(new Error("Failed to save image"));
    });

    profileImageService.uploadProfileImage(call, callback);
  });
});
