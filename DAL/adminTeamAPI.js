import { invokeApi } from "../utils/invokeApi";


export const _admin_team_list_api = async (page , limit) => {
    const requestObj = {
        path: `api/admin/list_admins?page=${page}&limit=${limit}`,
        method: "GET",
        // postData: data,
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};
export const _add_admin_team_api = async (data) => {
    const requestObj = {
        path: `api/admin/add_admin_team`,
        method: "POST",
        postData: data,
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};