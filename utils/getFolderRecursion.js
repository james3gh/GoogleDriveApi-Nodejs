import { googleDrive } from "../index.js";

export async function getAllFoldersRecursion(allFoldersArray, folderId) {
  let folderDetails = await getFileDetails(folderId);
  allFoldersArray.push(folderDetails);

  // Find all sub-folders
  const folders = (
    await googleDrive.files.list({
      q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      pageSize: 1000,
      fields: "nextPageToken, files(id, name)",
    })
  ).data.files;

  // Recursion
  for (const folder of folders) {
    await getAllFoldersRecursion(allFoldersArray, folder.id);
  }
}
