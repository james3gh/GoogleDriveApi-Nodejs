import { googleDrive } from "../index.js";

export async function convert_ID_To_Name() {
  const foldersRes = await googleDrive.files.list({
    q: "mimeType = 'application/vnd.google-apps.folder' and trashed=false",
  });
  const foldersIdToName = new Object(
    foldersRes.data.files.reduce((obj, o) => ((obj[o.id] = o.name), obj), {})
  );
  return foldersIdToName;
}

export async function getFileDetails(fileId) {
  const response = await googleDrive.files.get({
    fileId: fileId,
    fields: "id, name, parents",
  });
  return response.data;
}
