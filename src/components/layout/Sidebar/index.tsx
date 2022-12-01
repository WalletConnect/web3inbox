import React from "react";
import Messages from "../../../assets/Messages.svg";
import Notifications from "../../../assets/Notifications.svg";
import Settings from "../../../assets/Settings.svg";
import Logo from "../../../assets/Logo.svg";
import "./Sidebar.scss";

/* Types */
interface SidebarProps {}

/* Utils */
const SidebarItem: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return <div className="Sidebar__Item">{children}</div>;
};

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <div className="Sidebar">
      <SidebarItem></SidebarItem>
      <SidebarItem>
        <div className="Sidebar__Navigation">
          {[
            [Messages, "messages"],
            [Notifications, "notifications"],
            [Settings, "settings"],
          ].map(([itemSrc, itemName]) => (
            <img key={itemName} alt={itemName} src={itemSrc} />
          ))}
        </div>
      </SidebarItem>
      <SidebarItem>
        <img alt="WC logo" src={Logo} />
      </SidebarItem>
    </div>
  );
};

export default Sidebar;
