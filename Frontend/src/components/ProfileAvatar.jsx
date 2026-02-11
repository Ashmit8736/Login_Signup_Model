import React from "react";
import "../styles/ProfileAvatar.css";

const ProfileAvatar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.name) return null;

  const nameParts = user.name.trim().split(" ");
  const firstLetter = nameParts[0]?.charAt(0).toUpperCase();
  const lastLetter = nameParts[1]?.charAt(0).toUpperCase() || "";

  const initials = firstLetter + lastLetter;

  return (
    <div className="profile-avatar">
      {initials}
    </div>
  );
};

export default ProfileAvatar;
