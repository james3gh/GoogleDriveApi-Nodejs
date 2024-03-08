import { googleDrive } from "../index.js";
import { getFileDetails } from "../utils/IdToNameUtil.js";
import { cloneFolderRecursion } from "../utils/copyFolderRecursion.js";
import { getAllFoldersRecursion } from "../utils/getFolderRecursion.js";

// get all folders - limit 1000
export const getAllFolders = async (req, res) => {
  try {
    const response = await googleDrive.files.list({
      pageSize: 1000, // Maximum number of files to return per page
      q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "nextPageToken, files(id, name, parents)", // Fields to include in the response
    });
    const folders = response.data.files;
    res.status(200).json(folders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all folders by recursion limit upto 1000
export const getAllFolders2 = async (req, res) => {
  try {
    const { folderId } = req.params;
    let allFoldersArray = [];
    await getAllFoldersRecursion(allFoldersArray, folderId);
    res.status(200).json(allFoldersArray);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all folders - no limit
export const getAllFolders3 = async (req, res) => {
  let allFolders = [];
  let nextPageToken = null;
  do {
    const params = {
      pageSize: 1000,
      q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "nextPageToken, files(id, name, parents)",
      pageToken: nextPageToken,
    };

    let response = await googleDrive.files.list(params);
    nextPageToken = response.data.nextPageToken;
    const folders = response.data.files;

    allFolders = allFolders.concat(folders);
  } while (nextPageToken);
  res.status(200).json(allFolders);
};

// get all sub folders
export const getAllSubFolders = async (req, res) => {
  try {
    const { folderId } = req.params;
    const response = await googleDrive.files.list({
      pageSize: 50,
      q: `'${folderId}' in parents and trashed=false and mimeType = "application/vnd.google-apps.folder"`,
      fields: "nextPageToken, files(id, name, parents)",
    });
    const folders = response.data.files;
    res.status(200).json(folders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// create a new folder
export const createFolder = async (req, res) => {
  try {
    const { folderName, parentFolderId } = req.body;
    const fileMetaData = {
      name: folderName,
      parents: [parentFolderId],
      mimeType: "application/vnd.google-apps.folder",
    };
    const newFolder = await googleDrive.files.create({
      fields: "id",
      resource: fileMetaData,
    });
    res.status(200).json(newFolder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete folder
export const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    /******** check trash functionality once in docs */
    //  const body_value = {
    //   trashed: true,
    // };
    // const response = await googleDrive.files.update({
    //   fileId: folderId,
    //   requestBody: body_value,
    // });

    //check folder access first, if service account is not owner, then no deletion
    const response = await googleDrive.files.delete({
      fileId: folderId,
    });
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// copy file from source Folder to destination Folder
export const copyFileToFolder = async (req, res) => {
  try {
    const { fileId, folderId } = req.body;
    const name = (await getFileDetails(fileId)).name;
    let copyRequest = {
      name: `Copy of ${name}`,
      parents: [folderId],
    };
    const cloned = await googleDrive.files.copy({
      fileId: fileId,
      requestBody: copyRequest, // not neccesary
    });
    res.json({ message: "File copied", cloned });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// move file from a source folder to destination folder
export const moveFileToFolder = async (req, res) => {
  try {
    const { fileId, newFolderId } = req.body;
    const oldFolderId = (await getFileDetails(fileId)).parents[0];

    const movedFile = await googleDrive.files.update({
      fileId: fileId,
      addParents: newFolderId,
      removeParents: oldFolderId,
      fields: "id, name,parents",
    });
    const response = movedFile.result.files;
    res.json({ message: "File moved", response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// move folder from a source folder to destination folder
export const moveFolderToFolder = async (req, res) => {
  try {
    const { folderIdFrom, folderIdTo } = req.body;
    const folderFromName = (await getFileDetails(folderIdFrom)).name;
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
        q: `'${folderIdFrom}' in parents and mimeType =  'application/vnd.google-apps.folder' and trashed = false`,
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
      // Move to new folder
      await googleDrive.files.update({
        fileId: file.id,
        addParents: newFolder.id,
        removeParents: folderIdFrom,
        fields: "id, parents",
      });
    });

    res.json({ message: "Folder moved" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// copy folder from a source folder to destination folder using recursion
export const copyFolderInsideFolder = async (req, res) => {
  try {
    const { folderIdFrom, folderIdTo } = req.body;
    const response = await cloneFolderRecursion(folderIdFrom, folderIdTo);
    res.status(200).json({ message: "Folder copied", response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
