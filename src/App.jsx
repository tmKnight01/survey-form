import React, { useState, useRef } from "react";
import { Upload, message, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { get } from "lodash";
import "./App.less";

function App() {
  const [visible, setVisible] = useState(false);
  const errListRef = useRef([]);

  const extractErrorMessages = (jsonData) => {
    errListRef.current = [];
    const messages = [];
    // 遍历 JSON 数据中的每个对象
    for (const row in jsonData) {
      if (jsonData.hasOwnProperty(row)) {
        const columns = jsonData[row];

        // 遍历当前对象中的每个属性，将最内层的值添加到 messages 数组中
        for (const column in columns) {
          if (columns.hasOwnProperty(column)) {
            // const message = ;
            messages.push(columns[column]);
          }
        }
      }
    }
    errListRef.current = [...messages];
    setVisible(true);
  };

  const props = {
    action: "http://192.168.2.123:8081/subloan/validation",
    className: "survey-upload",
    name: "fileName",
    maxCount: 1,
    multiple: true,
    accept: ".xlsx",
    method: "post",
    onChange: (info) => {
      const { status } = info.file;
      console.log("info", info);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        if (get(info, "file.response.msg", "") == "error") {
          extractErrorMessages(get(info, "file.response.data", ""));
          message.warn(`The uploaded file does not meet the specifications `);
        } else if (get(info, "file.response", "")) {
          message.success(`${info.file.name} file uploaded successfully.`);
          download(info.file.response);
        }

        // console.log(info.file.response, "xxxx");
        // if (get(info, "file.response.msg", "") === "success") {

        // } else {
        // }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const download = async (content) => {
    // const blobContent = await test({fileName:'test'});

    try {
      if (content) {
        const blob = new Blob( [content], {
          type: "text/txt,charset=UTF-8",
        });
        const a = document.createElement("a");
        a.download = `example-excel/${dayjs().format("DD/MM/YYYY")}`;
        let url = URL.createObjectURL(blob);

        // 设置文件路径
        a.href = url;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url); // 销毁
        document.body.removeChild(a);
      } else {
        message.error("download excel file failed, please try agign later.");
        throw new Error();
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <h2 className="desc">Test validation Form1</h2>
      <Upload {...props}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined /> Upload
        </p>
      </Upload>
      <Modal
        title="Error Message"
        open={visible}
        onOk={() => setVisible(false)}
        // onCancel={this.handleCancel}
        maskTransitionName=""
      >
        {errListRef.current.map((content, index) => (
          <p key={index}>{content}</p>
        ))}
      </Modal>
    </>
  );
}

export default App;
