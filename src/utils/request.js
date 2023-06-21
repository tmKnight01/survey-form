import axios  from "axios";
import { message } from "antd";
// baseURl & 超时时间

const intance = axios.create({
  baseURL: "http://192.168.43.202:8082",
  timeout: 4000,
});

intance.interceptors.request.use(
  (config) => {
    // 在请求之前可以做些什么
    // 可以在这里添加token
    // const { user} = store.state
    // if (user && user.token) {
    //   config.headers.Authorization = `Bearer ${store.state.user.token}`
    // }

    return config;
  },
  (err) => {
    message.error("Interface request failed, please try again later!");
    console.log("err:", err);
    throw new Error(err);
  }
);

// 响应过滤器
intance.interceptors.response.use(
  (res) => {


    const { data } = res;
    console.log('request-res',res);
    return data;
  },
  (err) => {
    message.error("err:", err.message);
    console.log("err：", err);
    throw new Error(err);
  }
);




export default intance;
