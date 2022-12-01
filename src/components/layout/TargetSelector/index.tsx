import React from "react";
import Input from "../../general/Input";
import Search from "../../../assets/Search.svg";
import "./TargetSelector.scss";

interface TargetSelectorProps {}

const TargetSelector: React.FC<TargetSelectorProps> = (props) => {
  return (
    <div className="TargetSelector">
      <Input placeholder="Search" icon={Search} />
      <div>
        <span>TargetSelector</span>
      </div>
      <div>
        <span>TargetSelector</span>
      </div>
      <div>
        <span>TargetSelector</span>
      </div>
    </div>
  );
};

export default TargetSelector;
