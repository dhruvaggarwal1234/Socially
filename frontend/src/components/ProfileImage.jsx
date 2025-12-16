import React, { useState } from "react";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dwy2cyw8q/image/upload/v1765691685/deafult_pic_lgrqpq.jpg";

const ProfileImage = ({ image, className = "" }) => {
  const [imgSrc, setImgSrc] = useState(image || DEFAULT_AVATAR);

  return (
    <img
      src={imgSrc}
      alt="Profile"
      onError={() => setImgSrc(DEFAULT_AVATAR)}
      className={`w-full h-full object-cover rounded-full ${className}`}
    />
  );
};

export default ProfileImage;
