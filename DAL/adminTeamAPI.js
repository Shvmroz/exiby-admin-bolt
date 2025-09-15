import { invokeApi } from "../utils/invokeApi";


export const _admin_team_list_api = async (page, limit, search , filters) => {
    const requestObj = {
        path: `api/admin/list_admins?page=${page}&limit=${limit}&search=${search}&status=${filters.status}&created_from=${filters.created_from}&created_to=${filters.created_to}`,
        method: "GET",
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

export const _edit_team_member_api = async (rowID, data) => {
    const requestObj = {
        path: `api/admin/update_admin_team/${rowID}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};
export const _delete_team_member_api = async (rowID) => {
    const requestObj = {
        path: `api/admin/delete_admin_team/${rowID}`,
        method: "DELETE",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};
export const _change_team_member_password_api = async (rowID, data) => {
    const requestObj = {
        path: `api/admin/change_password/${rowID}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};


