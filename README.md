## Google Drive Api using Nodejs, Service Account, Google-cloud-platform
### How to Setup

**1. Clone the repository**
```bash
git clone https://github.com/james3gh/GoogleDriveApi-Nodejs.git
```
**2. Create credentials in your Google Cloud**

In the Google Cloud console, go to Menu `>` APIs & Services `>` **Credentials**.

Click Here `->` [Access Credentials Menu](https://console.cloud.google.com/apis/credentials)

1. Click **Create Credentials** `->` **Service Account**.
2. Give service account name in the field Service **Account Details**
3. Click **Done**. The newly created credential appears under **Service Accounts `>` Key**.
4. Save the downloaded JSON file as credentials.json, and move the file to **root** folder in your project.
5. Install all the dependencies using **npm i**
6. Run the app using **npm run start or npm run dev**.

## In your credentials.json file, you will find a `client_email`. Give permission to this email to the folder in your google drive which you want access to. (Right click the folder -> share options -> add email). This is your root folder now.

### Explore APIs

#### Files API
| Method | Url                                       | Description                                    | 
|--------|-------------------------------------------|------------------------------------------------|
| GET    | /api/v1/files/allFiles                    | Get all files from google drive root folder    | 
| GET    | /api/v1/files/file                        | Get files details by Id                        | 
| GET    | /api/v1/files/{folderId}                  | Get all files inside folder                    |
| GET    | /api/v1/files/download/{fileId}           | Download file                                  |
| POST   | /api/v1/files/upload                      | Upload files                                   |
| PATCH  | /api/v1/files/moveFiles                   | Move files to a specific folder                | 
| PATCH  | /api/v1/files/changePermission            | Change file permission                         |
| DELETE | /api/v1/files/delete/{fileId}             | Delete file                                    |


#### Folders API
| Method | Url                                       | Description                                      
|--------|-------------------------------------------|------------------------------------------------|
| GET    | /api/v1/folders                           | Get all folders from google drive root folder  |
| GET    | /api/v1/folders/{folderId}                | Get all folders inside a specific folder       |
| POST   | /api/v1/folders/create                    | Create new folder                              |         
| DELETE | /api/v1/folders/delete/{folderId}         | Delete folder                                  |             
| PATCH  | /api/v1/folders/copyFile                  | Copy file to destination folder                |                           
| PATCH  | /api/v1/folders/copyFolder                | Copy folder to destination folder              |                           
| PATCH  | /api/v1/folders/moveFile                  | Move file to destination folder                |                           
| PATCH  | /api/v1/folders/moveFolder                | Move folder to destination folder              |                           

