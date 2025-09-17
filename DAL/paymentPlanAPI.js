import { invokeApi } from "../utils/invokeApi";

;export const _payment_plans_list_api = async (page, limit, search , filters) => {
    const requestObj = {
        path: `api/payment_plan/admin/payment_plans`,
        // ?page=${page}&limit=${limit}&search=${search}&status=${filters.status}&created_from=${filters.created_from}&created_to=${filters.created_to}`,
        method: "GET",
        headers: {
            "x-sh-auth": localStorage.getItem("authToken"),
        },
    };
    return invokeApi(requestObj);
};
