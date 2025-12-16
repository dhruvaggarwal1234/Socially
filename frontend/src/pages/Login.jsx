import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  message,
  Divider,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (values) => {
    const { email, password } = values;

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        { email, password }
      );

      // 👉 If backend returns token/user later, handle here
      // localStorage.setItem("token", res.data.token);

      message.success("Logged in successfully 🎉");
      form.resetFields();

      navigate("/"); // or /home /dashboard
    } catch (err) {
      message.error(
        err.response?.data?.message || "Invalid email or password"
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
          }}
        >
          <Title level={2} style={{ color: "#fff" }}>
            Welcome back 👋
          </Title>

          <Text style={{ color: "rgba(255,255,255,0.9)", marginBottom: 24 }}>
            Log in to continue exploring Socially.
          </Text>

          <div style={{ display: "grid", gap: 14 }}>
            {[
              "Access your feed",
              "Continue conversations",
              "Post & engage instantly",
              "Stay connected in real-time",
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
              New here?
            </Text>
            <br />
            <Button
              ghost
              style={{ marginTop: 8 }}
              onClick={() => navigate("/register")}
            >
              Create an account →
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE – FORM */}
        <Card
          bordered={false}
          style={{
            flex: 1,
            padding: "32px 24px",
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 4 }}>
              Sign In
            </Title>
            <Text type="secondary">
              Enter your credentials
            </Text>
          </div>

          <Divider />

          {/* FORM */}
          <Form
            form={form}
            layout="vertical"
            onFinish={loginUser}
            requiredMark={false}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="you@example.com"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Password is required" },
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
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
