import axios from "@/config/axiosConfig";
import { BASE_URL } from "@/constant/commonConstant";

// #################### 文件相关接口 #################### //

/**
 * 上传文件
 *
 * @param data 包含文件的FormData对象
 * @returns {Promise<AxiosResponse<any>>}
 */
export const uploadFile = (data) => {
  return axios.post(BASE_URL + "/api-file/file/uploadFile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
