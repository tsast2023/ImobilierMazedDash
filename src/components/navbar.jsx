import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../css/navbar.css";
import i18n from "../i18n";
import { GlobalState } from "../GlobalState";
import Cookies from 'js-cookie'
import axios from "axios";
const Navbar = ({ username }) => {
  const token = Cookies.get('token')
  const state = useContext(GlobalState);
  const notifications = state.notifications;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleNotificationToggle = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    setIsLangMenuOpen(false);
    setIsSettingsMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleLanguageToggle = () => {
    setIsLangMenuOpen(!isLangMenuOpen);
    setIsMenuOpen(false);
    setIsSettingsMenuOpen(false);
    setIsNotificationMenuOpen(false);
  };

  const handleSettingsToggle = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen);
    setIsMenuOpen(false);
    setIsLangMenuOpen(false);
    setIsNotificationMenuOpen(false);
  };

  const changeLanguage = async(lng) => {
    i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
    try {
      const res = await axios.put(`http://localhost:8081/admin/language?newLanguage=${lng.toUpperCase()}` , {} , { headers: { Authorization: `Bearer ${token}` } });
      console.log(res.data)
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  };
  const getLogo = () => {
    return i18n.language === "ar" ? "./log-mazed-ar.png" : "./log-mazed.png";
  };
  

  useEffect(() => {
    const direction = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
  }, [i18n.language]);

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="icons-right">
          {/* <div className="settings-icon" onClick={handleSettingsToggle}>
            <i className="fas fa-cog"></i>
          </div> */}
                    <div className="settings-icon" onClick={handleLanguageToggle}>
            <i className="fas fa-globe me-2"></i> 
          </div>
          <div className="notification-icon" onClick={handleNotificationToggle}>
            <i className="fas fa-bell"></i>
          </div>
          <div className="profile-icon">
            <Link to="/Profile">
              <img src="./user.png" alt="Profile" className="profile-image" />
            </Link>
          </div>
        </div>
      </div>

      {/* Notification menu */}
      <div
        className={`notification-menu ${isNotificationMenuOpen ? "open" : ""}`}
        style={{
          position: "absolute",
          right: i18n.language === "ar" ? "auto" : 0,
          left: i18n.language === "ar" ? 0 : "auto",
          top: "50px",
        }}
      >
        <div className="notification-content">
          {notifications &&
            notifications.slice(-5).reverse().map((item, index) => (
              <div className="notification-item" key={index}>
                <div className="icon-circle">
                  <i className="fa-solid fa-money-bill"></i>
                </div>
                {item.title}
              </div>
            ))}
        </div>
        <div className="close-button" onClick={handleNotificationToggle}>
          <i className="fas fa-times"></i>
        </div>
      </div>

      {/* Language menu */}
      <div
        className={`notification-menu ${isLangMenuOpen ? "open" : ""}`}
        style={{
          position: "absolute",
          right: i18n.language === "ar" ? "auto" : 0,
          left: i18n.language === "ar" ? 0 : "auto",
          top: "50px",
        }}
      >
        <div className="notification-content">
          <div
            className="notification-item"
            onClick={() => changeLanguage("en")}
          >
            English
          </div>
          <div
            className="notification-item"
            onClick={() => changeLanguage("fr")}
          >
            Français
          </div>
          <div
            className="notification-item"
            onClick={() => changeLanguage("ar")}
          >
            العربية
          </div>
        </div>
        <div className="close-button" onClick={handleLanguageToggle}>
          <i className="fas fa-times"></i>
        </div>
      </div>

      {/* Settings menu */}
      <div
        className={`notification-menu ${isSettingsMenuOpen ? "open" : ""}`}
        style={{
          position: "absolute",
          right: i18n.language === "ar" ? "auto" : 0,
          left: i18n.language === "ar" ? 0 : "auto",
          top: "50px",
        }}
      >
        <div className="notification-content">
          <div className="notification-item">
            {/* <Link to="/Profile">
              <i className="fas fa-user-circle me-2"></i> {t("Profile")}
            </Link> */}
          </div>

          {/* <div className="notification-item">
            <i className="fas fa-sign-out-alt me-2"></i> {t("Déconnexion")}
          </div> */}
        </div>
        <div className="close-button" onClick={handleSettingsToggle}>
          <i className="fas fa-times"></i>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
