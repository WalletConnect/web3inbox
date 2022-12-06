import React, { forwardRef, MutableRefObject, useState } from "react";
import "./Input.scss";

interface InputProps {
  type?: "text";
  placeholder?: string;
  icon?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, value, icon, placeholder }, ref) => {
    return (
      <div className="Input">
        {icon && <img src={icon} alt="Input Icon" />}
        <input
          ref={ref}
          value={value}
          className="Input__input"
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  }
);

export default Input;
