import {  Form,  Input,  Button,  Typography,  Card,  message,  Divider,} from "antd";
import {  UserOutlined, MailOutlined,  LockOutlined,  CheckCircleFilled,} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (values) => {
    const { fullname, email, password, confirmPassword } = values;

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        {
          fullname,
          email,
          password,
          confirmPassword,
        }
      );

      message.success("Account created successfully 🎉");
      form.resetFields();
      navigate("/login");
    } catch (err) {
      message.error(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #e0eaff, #f5f7fb 60%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* MAIN CONTAINER */}
      <div
        style={{
          display: "flex",
          width: 900,
          maxWidth: "100%",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
          background: "#fff",
        }}
      >
        {/* LEFT SIDE – LIVE PANEL */}
        <div
          style={{
            flex: 1,
            padding: "48px 40px",
            background:
              "linear-gradient(135deg, #1677ff, #4096ff)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            transition: "all 0.4s ease",
          }}
        >
          <Title level={2} style={{ color: "#fff" }}>
            Welcome to Socially 👋
          </Title>

          <Text style={{ color: "rgba(255,255,255,0.9)", marginBottom: 24 }}>
            Build your online presence, connect with people,
            and share with your friend.
          </Text>

          <div style={{ display: "grid", gap: 14 }}>
            {[
              "Create your public profile",
              "Connect with people",
              "Share posts & thoughts",
              "Real-time messaging",
            ].map((text) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 15,
                }}
              >
                <CheckCircleFilled />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <Text style={{ color: "rgba(255,255,255,0.8)" }}>
              Already have an account?
            </Text>
            <br />
            <Button
              ghost
              style={{ marginTop: 8 }}
              onClick={() => navigate("/login")}
            >
              Sign in instead →
            </Button>
          </div>
        </div>


        <Card
          bordered={false}
          style={{
            flex: 1,
            padding: "32px 24px",
            transition: "all 0.4s ease",
          }}
        >
    
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 4 }}>
              Create Account
            </Title>
            <Text type="secondary">
              Join Socially in seconds
            </Text>
          </div>

          <Divider />


          <Form
            form={form}
            layout="vertical"
            onFinish={registerUser}
            requiredMark={false}
          >
            <Form.Item
              label="Full name"
              name="fullname"
              rules={[
                { required: true, message: "Enter your full name" },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Dhruv Aggarwal"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Enter your email" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="dhruv@example.com"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Enter a password" },
                { min: 6, message: "Minimum 6 characters" },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="••••••••"
              />
            </Form.Item>

            <Form.Item
              label="Confirm password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="••••••••"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{
                  borderRadius: 12,
                  height: 44,
                  fontWeight: 600,
                  boxShadow:
                    "0 8px 20px rgba(22,119,255,0.35)",
                }}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
