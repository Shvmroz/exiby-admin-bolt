import { invokeApi } from "../utils/invokeApi";

export const _get_team_members_api = async (data) => {
    const requestObj = {
        path: `api/admin/team/list`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};

export const _create_team_member_api = async (data) => {
    const requestObj = {
        path: `api/admin/team/create`,
        method: "POST",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};

export const _update_team_member_api = async (memberId, data) => {
    const requestObj = {
        path: `api/admin/team/update/${memberId}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};

export const _delete_team_member_api = async (memberId) => {
    const requestObj = {
        path: `api/admin/team/delete/${memberId}`,
        method: "DELETE",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};

export const _restore_team_member_api = async (memberId) => {
    const requestObj = {
        path: `api/admin/team/restore/${memberId}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};

export const _permanent_delete_team_member_api = async (memberId) => {
    const requestObj = {
        path: `api/admin/team/permanent-delete/${memberId}`,
        method: "DELETE",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};

export const _change_team_member_password_api = async (memberId, data) => {
    const requestObj = {
        path: `api/admin/team/change-password/${memberId}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};