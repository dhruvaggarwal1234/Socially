import { useState } from "react";
import { Card, Avatar, Input, Button, Upload, message } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const CreatePost = ({ onCreatePost, error }) => {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const profilePhoto = useSelector(
    (state) => state?.user?.currentUser?.profilePhoto
  );

  const beforeUpload = (file) => {
    const isValidType = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ].includes(file.type);

    if (!isValidType) {
      message.error("Only JPG, PNG, JPEG, WEBP images are allowed");
      return Upload.LIST_IGNORE;
    }

    const isLt3MB = file.size / 1024 / 1024 < 3;
    if (!isLt3MB) {
      message.error("Image must be smaller than 3MB");
      return Upload.LIST_IGNORE;
    }

    setImage(file);
    return false; // prevent auto upload
  };

  const handleSubmit = async () => {
    if (!body.trim() && !image) {
      message.warning("Post cannot be empty");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("body", body);
    if (image) formData.append("image", image);

    await onCreatePost(formData);

    setBody("");
    setImage(null);
    setLoading(false);
  };

  return (
    <Card
      bordered
      style={{
        borderRadius: 12,
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
      }}
    >
      {/* TOP */}
      <div style={{ display: "flex", gap: 12 }}>
        <Avatar
          size={48}
          src={profilePhoto}
        />

        <TextArea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          autoSize={{ minRows: 3, maxRows: 6 }}
          bordered={false}
          style={{
            background: "#f5f7fa",
            borderRadius: 10,
            padding: 12,
          }}
        />
      </div>

      {/* ERROR */}
      {error && (
        <div style={{ color: "red", marginTop: 8, fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Upload
          beforeUpload={beforeUpload}
          showUploadList={false}
        >
          <Button icon={<PictureOutlined />}>Add Image</Button>
        </Upload>

        <Button
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          style={{ borderRadius: 8 }}
        >
          Post
        </Button>
      </div>
    </Card>
  );
};

export default CreatePost;
