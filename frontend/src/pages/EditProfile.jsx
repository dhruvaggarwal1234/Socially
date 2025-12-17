import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Upload,
  Button,
  Input,
  message,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/user-slice";

const { TextArea } = Input;
const MAX_BIO_LENGTH = 150;

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, accessToken } = useSelector(
    (state) => state.user
  );

  const [fullname, setFullname] = useState(
    currentUser?.fullname || ""
  );
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState(
    currentUser?.profilePhoto
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= IMAGE UPLOAD =================
  const handleAvatarChange = (file) => {
    setAvatarFile(file);
    setRemoveAvatar(false);
    setAvatarPreview(URL.createObjectURL(file));
    return false; // prevent auto upload
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setRemoveAvatar(true);
    setAvatarPreview(null);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      setLoading(true);
      let updatedUser = { ...currentUser };

      // 1️⃣ Update avatar
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const avatarRes = await axios.patch(
          `${import.meta.env.VITE_API_URL}/users/avatar`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        updatedUser = avatarRes.data.user;
      }

      // 2️⃣ Update name & bio
      const profileRes = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${currentUser._id}`,
        { fullname, bio },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      updatedUser = {
        ...updatedUser,
        ...profileRes.data.editUser,
      };

      dispatch(userActions.changeCurrentUser(updatedUser));

      message.success("Profile updated");
      navigate("/users/me");
    } catch (err) {
      console.error(err);
      message.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border p-8 space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          />
          <h2 className="text-2xl font-semibold">
            Edit Profile
          </h2>
        </div>

        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar
              size={120}
              src={avatarPreview}
              className="border shadow"
            />

            {avatarPreview && (
              <Tooltip title="Remove photo">
                <Button
                  danger
                  shape="circle"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={handleRemoveAvatar}
                  className="absolute -bottom-2 -right-2"
                />
              </Tooltip>
            )}
          </div>

          <Upload
            beforeUpload={handleAvatarChange}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>
              Change profile photo
            </Button>
          </Upload>
        </div>

        {/* FULL NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <Input
            value={fullname}
            onChange={(e) =>
              setFullname(e.target.value)
            }
            size="large"
            placeholder="Enter your name"
          />
        </div>

        {/* BIO */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Bio
          </label>
          <TextArea
            rows={4}
            maxLength={MAX_BIO_LENGTH}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {bio.length}/{MAX_BIO_LENGTH}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSave}
            className="px-6"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
