import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import axios from 'axios';
import Cookies from 'js-cookie'
function Profile() {
  const token = Cookies.get('token')
  const { t } = useTranslation();
  const state = useContext(GlobalState);
  
  const myAccount = state.Me;

  const [formData, setFormData] = useState({
    name: myAccount?.nomFamille || "",
    prenom: myAccount?.prenom || "",
    photo: null, // Set to null initially
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Directly set the file from the input
      setFormData((prevState) => ({
        ...prevState,
        photo: file, // Store the file directly
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToUpdate = new FormData();
    formDataToUpdate.append("nomFamille", formData.name);
    formDataToUpdate.append("prenom", formData.prenom);
    
    // Append the photo if it exists
    if (formData.photo) {
      formDataToUpdate.append("img", formData.photo); // Append the file directly
    }

    try {
      const res = await axios.put(`http://localhost:8082/admin/updateUser`, formDataToUpdate, {
        headers: {
          "Content-Type": "multipart/form-data", // Axios generally handles this automatically
          Authorization: `Bearer ${token}` // Replace with your actual token
        }
      });
      console.log('User details updated successfully', res.data);
    } catch (error) {
      console.error('Error updating details:', error);
    }
  };

  const handlePasswordChangeSubmit = async (event) => {
    event.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.error("Passwords do not match!");
      return; // Optionally alert the user
    }

    const passwordUpdateRequest = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    };

    try {
      const res = await axios.put('http://localhost:8082/admin/updatePassword', passwordUpdateRequest, {
        headers: {
          Authorization: `Bearer ${token}` // Replace with your actual token
        }
      });
      console.log('Password updated successfully' , res.data);
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <div className="content-container">
      <section className="section">
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-center align-items-center flex-column">
                  <div className="avatar avatar-xl">
                    <img
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "5px",
                      }}
                      src={formData.photo ? URL.createObjectURL(formData.photo) : myAccount?.photoDeProfil} // Use URL.createObjectURL for the new image
                      alt="Avatar"
                    />
                  </div>
                  <h3 className="mt-3">{formData.name} {formData.prenom}</h3> 
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="photo" className="form-label">
                        {t("Mettre à jour la photo de profil")}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        id="photo"
                        onChange={handlePhotoChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        {t("Nom")}
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prenom" className="form-label">
                        {t("Prénom")}
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        id="prenom"
                        className="form-control"
                        placeholder="Your Prénom"
                        value={formData.prenom}
                        onChange={handleChange}
                      />
                    </div>
                   
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary">
                        {t("Enregister")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="new-price">{t("Changer le mot de passe")}</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handlePasswordChangeSubmit}>
                  <div className="form-group my-2">
                    <label htmlFor="current_password" className="form-label">
                      {t("Mot de passe actuel")}
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="current_password"
                      className="form-control"
                      placeholder="Enter your current password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="newPassword" className="form-label">
                      {t("Nouveau mot de passe")}
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      className="form-control"
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="form-group my-2">
                    <label htmlFor="confirmPassword" className="form-label">
                      {t("Confirmer le mot de passe")}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="form-control"
                      placeholder="Enter confirm password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <div className="form-group my-2 d-flex justify-content-start">
                    <button type="submit" className="btn btn-primary">
                      {t("Enregister")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
