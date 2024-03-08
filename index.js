import express from "express";
import dotenv from "dotenv";
import fileRoute from "./routes/fileRoute.js";
import folderRoute from "./routes/folderRoute.js";
import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "30mb", extented: false }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Using service account
const KEYFILEPATH = "credentials.json";
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});
export const googleDrive = google.drive({ version: "v3", auth });

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

// Define route handler
app.get("/", (req, res) => {
  res.send("Welcome, but sorry move to another /api/v1 route");
});
app.get("/api/v1", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.use("/api/v1/files", fileRoute);
app.use("/api/v1/folders", folderRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
