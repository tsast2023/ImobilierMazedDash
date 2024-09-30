import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";

function ProdAction() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  
  // State for color options
  const [withColor, setWithColor] = useState(null); // null | true (with color) | false (without color)
  const [colorInputs, setColorInputs] = useState([{ color: "", imageFiles: null }]); // Manage color and image inputs

  const goBack = () => {
    window.history.back();
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Handle checkbox change
  const handleWithColorChange = (value) => {
    setWithColor(value);
    // Reset inputs when changing the option
    setColorInputs([{ color: "", imageFiles: null }]);
  };

  // Add color and image inputs
  const addInput = () => {
    setColorInputs([...colorInputs, { color: "", imageFiles: null }]);
  };

  // Handle color input change
  const handleColorChange = (e, index) => {
    const newColorInputs = [...colorInputs];
    newColorInputs[index].color = e.target.value;
    setColorInputs(newColorInputs);
  };

  // Handle image input change
  const handleImageChange = (e, index) => {
    const newColorInputs = [...colorInputs];
    newColorInputs[index].imageFiles = e.target.files[0]; // Only take the first file
    setColorInputs(newColorInputs);
  };

  // Function to handle saving data
  const handleSave = async () => {
    const payload = withColor
      ? colorInputs.map(input => ({
          color: input.color,
          imageFiles: input.imageFiles
        }))
      : colorInputs.map(input => ({
          imageFiles: input.imageFiles
        }));

    // Prepare the form data to send to the backend
    const formData = new FormData();
    payload.forEach((item, index) => {
      if (withColor) {
        formData.append(`colors[${index}][color]`, item.color);
      }
      formData.append(`images[${index}]`, item.imageFiles);
    });

    // Example API call using Axios
    try {
      const response = await axios.post('', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert("Data saved successfully!");
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving data.");
    }
  };

  return (
    <div className="content-container">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h4 className="new-price">{t("Actions")}</h4>
          </div>
          <div className="card-content">
            <div className="card-body">
              <form className="form form-vertical">
                <div className="form-body">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <div className="form-group">
                        <label htmlFor="first-name-vertical">
                          {t("Libellé")}
                        </label>
                        <input
                          type="text"
                          id="first-name-vertical"
                          className="form-control"
                          name="fname"
                          maxLength="25"
                        />
                      </div>
                    </div>

                    {/* Checkbox for color options */}
                    <div className="col-12 mb-3">
                      <label>{t("Couleur")}</label>
                      <div className="d-flex flex-column">
                        <label className="mb-2">
                          <input
                            type="radio"
                            name="colorOption"
                            value="yes"
                            onChange={() => handleWithColorChange(true)}
                          />
                          {t("Oui")}
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="colorOption"
                            value="no"
                            onChange={() => handleWithColorChange(false)}
                          />
                          {t("Non")}
                        </label>
                      </div>
                    </div>

                    {/* Dynamic color and image inputs */}
                    {withColor !== null && (
                      <>
                        {colorInputs.map((input, index) => (
                          <div className="col-12 mb-3" key={index}>
                            <div className="form-group">
                              <label>{t("Couleur")}</label>
                              {withColor && (
                                <input
                                  type="color"
                                  value={input.color}
                                  onChange={(e) => handleColorChange(e, index)}
                                  className="form-control"
                                />
                              )}
                            </div>
                            <div className="form-group">
                              <label>{t("Image")}</label>
                              {withColor !== null && (
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageChange(e, index)}
                                  className="form-control"
                                />
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Add More Inputs Button */}
                        <div className="col-12 mb-3">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={addInput}
                            disabled={withColor === null} // Disable if no option is selected
                          >
                            +
                          </button>
                        </div>
                      </>
                    )}

                    <div className="col-12 mb-3">
                      <Button
                        variant="secondary"
                        className="me-2"
                        onClick={goBack}
                      >
                        {t("Retour")}
                      </Button>
                      <Button
                        variant="success"
                        className="me-2"
                        onClick={handleSave} // Call handleSave on click
                      >
                        {t("Enregistrer")}
                      </Button>
                      <Button
                        variant="primary"
                        className="me-2"
                        onClick={handleOpenModal}
                      >
                        {t("Planifier")}
                      </Button>
                      <Button variant="primary">
                        {t("Publier immédiatement")}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t("Planifier")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="dateInput" className="form-label">
                {t("Date")}
              </label>
              <input type="date" className="form-control" id="dateInput" />
            </div>
            <div className="mb-3">
              <label htmlFor="timeInput" className="form-label">
                {t("Heure")}
              </label>
              <input type="time" className="form-control" id="timeInput" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              {t("Fermer")}
            </Button>
            <Button variant="primary">{t("Planifier")}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default ProdAction;
