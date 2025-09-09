// import { invokeApi } from "../utils/invokeApi";

// export const _get_drivers_list_api = async (page, rows, data) => {
//     const requestObj = {
//         path: `/api/driver/list_driver?page=${page}&limit=${rows}`,
//         method: "POST",
//         headers: {
//             "x-sh-auth": localStorage.getItem("token"),
//         },
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };
// export const _add_driver_api = async (data) => {
//     const requestObj = {
//         path: `/api/driver/add_driver`,
//         method: "POST",
//         headers: {
//             "x-sh-auth": localStorage.getItem("token"),
//         },
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };

// export const _edit_driver_api = async (rowID, data) => {
//     const requestObj = {
//         path: `/api/driver/update_driver/${rowID}`,
//         method: "PUT",
//         headers: {
//             "x-sh-auth": localStorage.getItem("token"),
//         },
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };
// export const _delete_driver_api = async (rowID, data) => {
//     const requestObj = {
//         path: `/api/driver/delete_driver/${rowID}`,
//         method: "DELETE",
//         headers: {
//             "x-sh-auth": localStorage.getItem("token"),
//         },
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };
// export const _reste_driver_password_api = async (data) => {
//     const requestObj = {
//         path: `/api/app_api/change_user_password`,
//         method: "POST",
//         headers: {
//             "x-sh-auth": localStorage.getItem("token"),
//         },
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };
