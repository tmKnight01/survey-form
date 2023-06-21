import fetch from "../utils/request";

// 获取excel文件数据
export const getExcelFile = async (params) =>
  await fetch(
    {
      url: "/getExcelFile",
      method: "get",
      responseType: "blob",
      params
    },

  );

  export default {}