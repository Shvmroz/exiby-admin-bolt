import axios from "axios";
// import { baseUrl, secretKey } from "../config/config";

axios.defaults.headers.post["Content-Type"] = "application/json";

export async function invokeApi({
  path,
  method = "GET",
  headers = {},
  queryParams = {},
  postData = {},
}) {
  const reqObj = {
    method,
    url: baseUrl + path,
    headers: {
      "x-sh-key": secretKey,
      ...headers,
    },
  };

  reqObj.params = queryParams;

  if (method === "POST") {
    reqObj.data = postData;
  }
  if (method === "PUT") {
    reqObj.data = postData;
  }
  if (method === "DELETE") {
    reqObj.data = postData;
  }
  if (method === "GET") {
    reqObj.data = postData;
  }

  let results;

  console.log("<===REQUEST-OBJECT===>", reqObj);

  try {
    results = await axios(reqObj);
    console.log("<===Api-Success-Result===>", results);

    return results.data;
  } catch (error) {
    console.log("<===Api-Error===>", error.response.data);

    if (error.response.status === 401) {
      localStorage.clear();
      // window.location.reload();
    }

    return error.response.data;
  }
}
