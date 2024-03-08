import express from "express";
const router = express.Router();

import multer from "multer";
const upload = multer();

import {
  changeFilePermission,
  deleteFile,
  downloadFile,
  getFileByID,
  getFilesInsideFolder,
  moveFilesInsideFolder,
  getAllFiles,
  uploadFiles,
  getAllFiles2,
} from "../controllers/fileController.js";

router.get("/allFiles", getAllFiles);
// router.get("/allFiles", getAllFiles2);
router.get("/file", getFileByID);
router.get("/:folderId", getFilesInsideFolder);
router.post("/upload", upload.any(), uploadFiles);
router.delete("/delete/:fileId", deleteFile);
router.get("/download/:fileId", downloadFile);
router.patch("/moveFiles", moveFilesInsideFolder);
router.patch("/changeFilePermission", changeFilePermission);

export default router;
