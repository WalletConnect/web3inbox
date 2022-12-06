import React from "react";
import "./Avatar.scss";

interface AvatarProps {
  src?: string | null;
  width: string | number;
  height: string | number;
}

const Avatar: React.FC<AvatarProps> = ({ src, width, height }) => {
  return (
    <div className="Avatar" style={{ width, height }}>
      {src && <img className="Avatar__icon" src={src} alt="Avatar" />}
    </div>
  );
};

export default Avatar;
