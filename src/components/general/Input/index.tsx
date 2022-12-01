import React from "react";
import "./Input.scss";

interface InputProps {
  type?: "text";
  placeholder?: string;
  icon?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ onChange, icon, placeholder }) => {
  return (
    <div className="Input">
      <img src={icon} alt="Input Icon" />
      <input
        className="Input__input"
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
