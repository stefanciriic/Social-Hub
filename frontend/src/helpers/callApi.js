import axios from "axios";

const methods = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

export const callApi = async (path, method, token, payload) => {
  const url = `http://localhost:8080/${path}`;
  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  try {
    const httpMethod = methods[method];
    if (httpMethod) {
      let responseData;
      if (payload) {
        responseData = await httpMethod(url, payload, config);
      } else {
        responseData = await httpMethod(url, config);
      }
      const { data } = responseData;
      return data;
    }
  } catch (err) {
    console.log(err);
  }
};
