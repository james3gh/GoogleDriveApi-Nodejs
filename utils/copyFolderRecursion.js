import { googleDrive } from "../index.js";
import { getFileDetails } from "./IdToNameUtil.js";

export async function cloneFolderRecursion(folderIdFrom, folderIdTo) {
  let folderFromName = await getFileDetails(folderIdFrom).name;
  const newFolder = (
    await googleDrive.files.create({
      resource: {
        name: folderFromName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [folderIdTo],
      },
    })
  ).data;

  // Find all sub-folders
  const folders = (
    await googleDrive.files.list({
      q: `'${folderIdFrom}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      pageSize: 50,
      fields: "nextPageToken, files(id, name)",
    })
  ).data.files;

  // Find all files
  const files = (
    await googleDrive.files.list({
      q: `'${folderIdFrom}' in parents and mimeType !=   'application/vnd.google-apps.folder' and trashed = false`,
      pageSize: 50,
      fields: "nextPageToken, files(id, name)",
    })
  ).data.files;

  files.forEach(async (file) => {
    // Create Copy of File
    const cloned = (
      await googleDrive.files.copy({
        fileId: file.id,
      })
    ).data;

    // Move copy to new folder
    await googleDrive.files.update({
      fileId: cloned.id,
      addParents: newFolder.id,
      removeParents: folderIdFrom,
      resource: { name: file.name },
      fields: "id, parents",
    });
  });

  // Recursion
  folders.forEach((folder) =>
    cloneFolderRecursion(folder.id, newFolder.id, false)
  );
}
