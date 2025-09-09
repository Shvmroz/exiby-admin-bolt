// import { invokeApi } from "../utils/invokeApi";

// export const _uplaod_single_image_on_s3 = async (data) => {
//     const requestObj = {
//       path: `/api/app_api/uplaod_image_s3`,
//       method: "POST",
//       headers: {
//         "x-sh-auth": localStorage.getItem("token"),
//         "Content-Type": "multipart/form-data",
//       },
//       postData: data,
//     };
//     return invokeApi(requestObj);
//   };

// export const _delete_single_file_from_s3 = async (data) => {
//     const requestObj = {
//       path: `/api/app_api/delete_files_from_s3`,
//       method: "POST",
//       headers: {
//         "x-sh-auth": localStorage.getItem("token"),
//         // "Content-Type": "multipart/form-data",
//       },
//       postData: data,
//     };
//     return invokeApi(requestObj);
//   };
