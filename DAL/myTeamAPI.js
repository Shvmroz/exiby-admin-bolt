import { invokeApi } from "../utils/invokeApi";


export const _admin_team_list_api = async (data) => {
    const requestObj = {
        path: `api/admin/list_admins`,
        method: "GET",
        postData: data,
    };
    return invokeApi(requestObj);
};