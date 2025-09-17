import { invokeApi } from "../utils/invokeApi";

export const _payment_plans_list_api = async (page, limit, search, filters) => {
    const requestObj = {
        path: `api/payment_plan/admin/payment_plans?page=${page}&limit=${limit}&search=${search}&status=${filters.status}&created_from=${filters.created_from}&created_to=${filters.created_to}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};

export const _add_payment_plan_api = async (data) => {
    const requestObj = {
        path: `api/payment_plan/admin/payment_plans`,
        method: "POST",
        postData: data,
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};

export const _edit_payment_plan_api = async (planId, data) => {
    const requestObj = {
        path: `api/payment_plan/admin/payment_plans/${planId}`,
        method: "PUT",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
        postData: data,
    };
    return invokeApi(requestObj);
};

export const _delete_payment_plan_api = async (planId) => {
    const requestObj = {
        path: `api/payment_plan/admin/payment_plans/${planId}`,
        method: "DELETE",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};
