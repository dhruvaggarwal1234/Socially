import { Tooltip, message } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";

const ShareButton = ({ postId }) => {
  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${postId}`;

    try {
      await navigator.clipboard.writeText(url);
      message.success("Post link copied!");
    } catch {
      message.error("Failed to copy link");
    }
  };

  return (
    <Tooltip title="Share">
      <span
        onClick={handleShare}
        className="cursor-pointer"
      >
        <ShareAltOutlined style={{ fontSize: 18 }} />
      </span>
    </Tooltip>
  );
};

export default ShareButton;
