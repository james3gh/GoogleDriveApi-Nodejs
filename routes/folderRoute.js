import express from "express";
const router = express.Router();

import {
  createFolder,
  getAllFolders,
  deleteFolder,
  copyFolderInsideFolder,
  copyFileToFolder,
  moveFileToFolder,
  moveFolderToFolder,
  getAllFolders2,
  getAllFolders3,
} from "../controllers/folderController.js";

router.get("/", getAllFolders);
// router.get("/", getAllFolders2);
// router.get("/", getAllFolders3);
router.get("/:folderId", getAllFolders2);
router.post("/create", createFolder);
router.delete("/delete/:folderId", deleteFolder);
router.patch("/copyFile", copyFileToFolder);
router.patch("/copyFolder", copyFolderInsideFolder);
router.patch("/moveFile", moveFileToFolder);
router.patch("/moveFolder", moveFolderToFolder);

export default router;
