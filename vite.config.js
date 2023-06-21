import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import 'antd/dist/antd.less'

export default defineConfig({
  plugins: [react()],
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
        // 重写 less 变量，定制样式
        modifyVars: {
          "@primary-color": "#26707b",
        },
      },
    },
  },
});
