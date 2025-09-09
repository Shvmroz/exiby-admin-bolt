
// import { enqueueSnackbar } from "notistack";
// import { _delete_files_from_s3, _uplaod_image_on_s3, _uplaod_multiple_files_on_s3 } from "../DAL/uploadFilesAPIs";

// export const uploadSingleImage = async (imageFile) => {
//   if (!imageFile) return null;
//   if (typeof imageFile === "string") return imageFile;

//   const req_data = new FormData();
//   req_data.append("image", imageFile);
//   console.log(...req_data, "upload image");

//   const uploadResponse = await _uplaod_image_on_s3(req_data);
//   if (uploadResponse.code === 200) {
//     console.log(uploadResponse, "Image Uploaded");
//     return uploadResponse.path;
//   } else {
//     enqueueSnackbar(uploadResponse.message, { variant: "error" });
//     console.log(uploadResponse.message);
//     return null;
//   }

// };
// // ====================================================================================
// export const uploadFiles = async (files) => {
//   if (!files || (Array.isArray(files) && files.length === 0)) return [];

//   const filesToUpload = Array.isArray(files) ? files : [files];

//   // Separate real files and already-uploaded string paths
//   const actualFiles = [];
//   const alreadyUploadedPaths = [];

//   filesToUpload.forEach((fileItem) => {
//     const isFile = fileItem instanceof File || fileItem?.file instanceof File;

//     if (isFile) {
//       const actualFile = fileItem.file || fileItem;
//       if (actualFile) {
//         actualFiles.push(actualFile);
//       }
//     } else if (typeof fileItem === "string") {
//       alreadyUploadedPaths.push(fileItem);
//     }
//   });

//   //  If there are no files to upload, return the already uploaded ones
//   if (actualFiles.length === 0) {
//     return alreadyUploadedPaths;
//   }

//   // Otherwise, upload files
//   const formData = new FormData();
//   actualFiles.forEach((file) => {
//     formData.append("file", file);
//   });

//   const response = await _uplaod_multiple_files_on_s3(formData);

//   if (response.code === 200) {
//     const uploadedPaths = response?.path || [];
//     return [...alreadyUploadedPaths, ...uploadedPaths];
//   } else {
//     enqueueSnackbar(response.message, { variant: "error" });
//     return alreadyUploadedPaths; // or return [] if you want to discard all
//   }
// };
// // ===========================================================================================
// export const deleteFiles = async (filesToRemove) => {
//   if (!filesToRemove || filesToRemove.length === 0) {
//     console.log("No files to remove");
//     return;
//   }

//   const payload = {
//     path: filesToRemove.map(file => ({ Key: file })),
//   };

//   console.log("payload ", payload)
//   const response = await _delete_files_from_s3(payload);
//   if (response.code === 200) {
//     console.log("Files removed successfully");
//     return response;
//   } else {
//     console.error("Failed to remove files", response.message);
//     enqueueSnackbar(response.message, { variant: "error" });
//     return response;
//   }

// };
