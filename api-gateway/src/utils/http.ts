import axios from 'axios';

export const forwardRequest = async (
  url: string,
  method: string,
  data?: any,
  headers = {},
) => {
  return axios({
    url,
    method,
    data,
    headers,
  });
};
