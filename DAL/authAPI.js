// import { invokeApi } from "../utils/invokeApi";

// export const _login_api = async (data) => {
//     const requestObj = {
//         path: `/api/app_api/login`,
//         method: "POST",
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };
// export const _logout_api = async (data) => {
//     const requestObj = {
//         path: `/api/app_api/logout`,
//         method: "GET",
//         headers: {
//             "x-sh-auth": localStorage.getItem("token"),
//         },
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };
// export const _change_password_api = async (data) => {
//     const requestObj = {
//         path: `/api/app_api/change_password`,
//         method: "PUT",
//         headers: {
//             "x-sh-auth": localStorage.getItem("token"),
//         },
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };
// export const _update_company_profile_api = async (data) => {
//     const requestObj = {
//         path: `/api/company/update_company_app`,
//         method: "PUT",
//         headers: {
//             "x-sh-auth": localStorage.getItem("token"),
//         },
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };

// export const _email_verification_api = async (data) => {
//     const requestObj = {
//         path: `/api/app_api/email_verification`,
//         method: "POST",
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };

// export const _code_verification_api = async (data) => {
//     const requestObj = {
//         path: `/api/app_api/code_verification`,
//         method: "POST",
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };

// export const _reset_password_api = async (data) => {
//     const requestObj = {
//         path: `/api/app_api/reset_password`,
//         method: "POST",
//         postData: data,
//     };
//     return invokeApi(requestObj);
// };

