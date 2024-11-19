const fs = require("fs");
const grpc = require("@grpc/grpc-js");
const coverImageService = require("../services/coverImageService");

jest.mock("fs");

describe("CoverImageService", () => {
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

    coverImageService.getCoverImage(call, callback);
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

    coverImageService.getCoverImage(call, callback);
  });
});
