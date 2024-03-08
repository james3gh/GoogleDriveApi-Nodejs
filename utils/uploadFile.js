import { googleDrive } from "../index.js";
import stream from "stream";

export const uploadFile = async (fileObject, folderId) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await googleDrive.files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: [folderId],
    },
    fields: "id, name, webContentLink",
  });
  // console.log(`Uploaded file name: ${data.name} and id: ${data.id}`);
  return data;
};
