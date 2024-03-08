import { googleDrive } from "../index.js";
import fs from "fs";
import { uploadFile } from "../utils/uploadFile.js";

// files fetching upto 1000 limit
export const getAllFiles = async (req, res) => {
  try {
    const response = await googleDrive.files.list({
      pageSize: 1000, // Maximum number of files to return per page
      q: `trashed=false and mimeType!='application/vnd.google-apps.folder'`,
      fields: "nextPageToken, files(id, name, parents)", // Fields to include in the response
    });
    const files = response.data.files;
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// fetch all files - no limit
export const getAllFiles2 = async (req, res) => {
  let allFiles = [];
  let nextPageToken = null;
  try {
    do {
      const params = {
        pageSize: 1000,
        q: "mimeType!='application/vnd.google-apps.folder' and trashed=false",
        fields: "nextPageToken, files(id, name, parents)",
        pageToken: nextPageToken,
      };

      let response = await googleDrive.files.list(params);
      nextPageToken = response.data.nextPageToken;
      const files = response.data.files;

      allFiles = allFiles.concat(files);
    } while (nextPageToken);
    res.status(200).json(allFiles);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get particular file details by Id
export const getFileByID = async (req, res) => {
  try {
    const { fileId } = req.body;
    const response = await googleDrive.files.get({
      fileId: fileId,
      fields: "id, name",
    });
    res.status(200).json(`File name is: ${response.data}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all files inside a folder
export const getFilesInsideFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const response = await googleDrive.files.list({
      pageSize: 10,
      q: `'${folderId}' in parents and trashed=false and mimeType!=\'application/vnd.google-apps.folder\'`,
      fields: "nextPageToken, files(id, name, parents)",
    });
    const files = response.data.files;
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// upload multiple files inside a folder
export const uploadFiles = async (req, res) => {
  try {
    const { files } = req;
    const { folderId } = req.body;
    for (let f = 0; f < files.length; f += 1) {
      await uploadFile(files[f], folderId);
    }
    res.status(200).send("Files uploaded");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete a file
export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.body;
    await googleDrive.files.delete({
      fileId: fileId,
    });
    res.status(200).json({ message: "File Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//web content link for downloading
/*
const result = await drive.files.get({
  fileId: fileId,
  fields: 'webViewLink, webContentLink',
});
*/

// download a file
export const downloadFile = async (req, res) => {
  try {
    // check extension of file - currently using for pdf files only
    const { fileId } = req.params;
    var dest = fs.createWriteStream(`${fileId}.pdf`); // Set the destination of the saved file.
    const response = await googleDrive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" }
    );
    response.data
      .on("end", () => {
        console.log("Done");
      })
      .on("error", (err) => {
        console.log("Error", err);
      })
      .pipe(dest);
    res.status(200).json({ message: "File downloaded" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const moveFilesInsideFolder = async (req, res) => {
  try {
    const { filesId, folderId } = req.body;

    // Retrieve the existing parents to remove
    filesId.map(async (fileId, key) => {
      let file = await googleDrive.files.get({
        fileId: fileId,
        fields: "parents",
      });

      if (file.data.parents[0] != folderId) {
        // Move the file to the new folder
        const previousParents = file.data.parents.join(",");
        const movefiles = await googleDrive.files.update({
          fileId: fileId,
          addParents: folderId,
          removeParents: previousParents,
          fields: "id, parents",
        });
      }
    });

    res.status(200).json({ message: "Files moved into folder" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// changing file permission
export const changeFilePermission = async (req, res) => {
  try {
    const { fileId } = req.body;

    /******* set reader permission */
    await googleDrive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    /***** set onwer permission */
    let requestBody = {
      type: "user",
      role: "owner",
      emailAddress: "<Enter email here>",
    };
    await googleDrive.permissions.create({
      fileId,
      resource: requestBody,
      fields: "id",
      transferOwnership: true,
    });

    /***** list all file permission ******/
    // const response = await googleDrive.permissions.list(
    //   { fileId },
    //   {
    //     fields: "permissions",
    //   }
    // );
    res.status(200).json({ message: "File permission changed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
