import React from "react";
import Header from "@/components/common/Header";
import { get } from "lodash";
import { getExcelFile } from "@/service/index";
import {
  Form,
  Button,
  Upload,
  Input,
  message,
  DatePicker,
  Icon,
  Modal,
} from "antd";
import "./index.less";
import dayjs from "dayjs";

class SurveyForm extends React.Component {
  constructor() {
    super();
    this.state = {
      fileList: [],
      visible: false,
      errList: [],
    };
  }
  textAreaTest = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+\r?\n?([\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+\r?\n?){0,9}$/;
  _handleSubmit = (e) => {
    e.preventDefault();
    this.props?.form.validateFields((err, values) => {
      if (!err) {
        console.log("Recived values of form", values);
      }
    });
  };

  _textAreaValidator = (rule, value, callback) => {
    try {
      if (!this.textAreaTest.test(value)) {
        callback("请按照规范进行输入");
      }
      callback();
    } catch (err) {
      callback(err);
    }
  };

  _download = async (fileName) => {
    // const blobContent = await test({fileName:'test'});
    const blobContent = await getExcelFile({ fileName: "test" });
    try {
      if (blobContent) {
        const blob = new Blob([blobContent], {
          type: "application/vnd.ms-excel.sheet.macroEnabled.12",
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

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      // errList: [],
    });
  };

  extractErrorMessages(jsonData) {
    this.setState({ errList: [] });
    const messages = [];
    // 遍历 JSON 数据中的每个对象
    for (const row in jsonData) {
      if (jsonData.hasOwnProperty(row)) {
        const columns = jsonData[row];

        // 遍历当前对象中的每个属性，将最内层的值添加到 messages 数组中
        for (const column in columns) {
          if (columns.hasOwnProperty(column)) {
            const message = columns[column];
            messages.push(message);
          }
        }
      }
    }

    this.setState({ errList: [...messages], visible: true });
  }
  // showModal = () => {
  //   this.setState(
  //     {
  //       errList: Array(10)
  //         .fill("")
  //         .map((item, Index) => Index),
  //       visible: true,
  //     },
  //     () => {}
  //   );
  // };
  render() {
    const cls = "survey";
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 12 },
    };
    return (
      <>
        <Header title="WINGS Survey Hub" />
        <div className={`${cls}`}>
          <div className={`${cls}-form`}>
            <Form onSubmit={this._handleSubmit} formlayout="horizontal">
              <Form.Item
                label="Name"
                style={{ marginTop: 25 }}
                {...formItemLayout}
              >
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your Name!",
                    },
                  ],
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Desctiption" {...formItemLayout}>
                {getFieldDecorator(
                  "description",
                  {}
                )(<TextArea autosize style={{ minHeight: 100 }} />)}
              </Form.Item>
              <Form.Item label="Contract Info" {...formItemLayout}>
                {getFieldDecorator("contractInfo", {
                  rules: [
                    {
                      validator: this._textAreaValidator.bind(this),
                    },
                  ],
                })(<TextArea autosize style={{ minHeight: 100 }} />)}
              </Form.Item>
              <Form.Item
                label="Due Date"
                {...formItemLayout}
                wrapperCol={{ span: 5 }}
              >
                {getFieldDecorator(
                  "date",
                  {}
                )(<DatePicker placeholder="" allowClear={false} />)}
              </Form.Item>
              {/* <p className="survey-desc">Please Upload Survey sample form.</p>
              <Form.Item>
                {getFieldDecorator("file", {
                  valuePropName: "file",
                  getValueFromEvent: this.normFile,
                })(
                  <Upload
                    ref={this.uploadRef}
                    className={"upload-btn survey-upload"}
                    name="fileName"
                    accept=".xlsm"
                    method="post"
                    fileList={this.state.fileList}
                    multiple
                    style={{ cursor: "pointer" }}
                    action="http://192.168.43.202:8082/validation"
                    onChange={(info) => {
                      const { status } = info.file;
                      console.log("info", info);
                      if (status !== "uploading") {
                        console.log(info.file, info.fileList);
                      }
                      if (status === "done") {
                        console.log(info.file.response);
                        if (get(info, "file.response.data.fileName", "")) {
                          message.success(
                            `${info.file.name} file uploaded successfully.`
                          );
                          this._download(
                            get(info, "file.response.data.fileName", "")
                          );
                        } else {
                          message.warn(
                            `
                          The uploaded file does not meet the specifications `
                          );
                        }
                      } else if (status === "error") {
                        message.error(`${info.file.name} file upload failed.`);
                      }
                      this.setState({ fileList: [...info.fileList] });
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="upload" /> Upload
                    </p>
                  </Upload>
                )}
              </Form.Item> */}

              <p className="survey-desc">Test validation Form1</p>
              <Form.Item>
                {getFieldDecorator("file", {
                  valuePropName: "file",
                  getValueFromEvent: this.normFile,
                })(
                  <Upload
                    ref={this.uploadRef}
                    className={"upload-btn survey-upload"}
                    name="fileName"
                    accept=".xlsx"
                    method="post"
                    fileList={this.state.fileList}
                    multiple
                    style={{ cursor: "pointer" }}
                    action="http://192.168.186.202:8081/subloan/validation"
                    onChange={(info) => {
                      const { status } = info.file;
                      console.log("info", info);
                      if (status !== "uploading") {
                        console.log(info.file, info.fileList);
                      }
                      if (status === "done") {
                        console.log(info.file.response, "xxxx");
                        if (get(info, "file.response.msg", "")==='success') {
                          message.success(
                            `${info.file.name} file uploaded successfully.`
                          );
                          // this._download(
                          //   get(info, "file.response.data.fileName", "")
                          // );
                        } else {
                          if (get(info, "file.response.msg", "") == "error") {
                            this.extractErrorMessages(get(info, "file.response.data", ""))
                          }
                          message.warn(
                            `
                          The uploaded file does not meet the specifications `
                          );
                        }
                      } else if (status === "error") {
                        message.error(`${info.file.name} file upload failed.`);
                      }
                      this.setState({ fileList: [...info.fileList] });
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="upload" /> Upload
                    </p>
                  </Upload>
                )}
              </Form.Item>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </div>
            </Form>
{/* 
            <Button type="primary" onClick={this.showModal}>
              Open Modal
            </Button> */}
          </div>
        </div>
        <Modal
          title="Error Message"
          visible={this.state.visible}
          onOk={() => this.setState({ visible: false })}
          onCancel={this.handleCancel}
          maskTransitionName=""
        >
          {this.state.errList.map((content, index) => (
            <p>{content}</p>
          ))}
        </Modal>
      </>
    );
  }
}

export default Form.create({ name: "survey_form" })(SurveyForm);
