import React, { useState, useEffect } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProdCreate = () => {
  const [withColor, setWithColor] = useState(null); // null initially, then true for "Yes" and false for "No"
  const [inputs, setInputs] = useState([{ color: "", image: "" }]); // Dynamic inputs
  const { t } = useTranslation();

  const goBack = () => {
    window.history.back(); // Simulate a browser back button
  };

  useEffect(() => {
    // Apply Choices.js only to select elements
    const categoryChoices = new Choices(".category-choices", {
      removeItemButton: true,
      maxItemCount: 5, // Maximum number of items allowed to select
    });

    const subCategoryChoices = new Choices(".sub-category-choices", {
      removeItemButton: true,
      maxItemCount: 5, // Maximum number of items allowed to select
    });

    // Cleanup function
    return () => {
      categoryChoices.destroy();
      subCategoryChoices.destroy();
    };
  }, []);

  const handleImageChange = (e, index) => {
    const files = e.target.files;
    const newInputs = [...inputs];
    newInputs[index].image = files[0]; // Assign the uploaded image to the corresponding index
    setInputs(newInputs);
  };

  const handleColorChange = (e, index) => {
    const newInputs = [...inputs];
    newInputs[index].color = e.target.value; // Assign the selected color to the corresponding index
    setInputs(newInputs);
  };

  const addInput = () => {
    setInputs([...inputs, { color: "", image: "" }]); // Add a new set of inputs
  };

  const handleWithColorChange = (e) => {
    const value = e.target.value === "yes"; // Convert "yes" to true and "no" to false
    setWithColor(value);
    setInputs([{ color: "", image: "" }]); // Reset inputs when changing the option
  };

  return (
    <div id="main">
      <header className="mb-3">
        <a href="#" className="burger-btn d-block d-xl-none">
          <i className="bi bi-justify fs-3"></i>
        </a>
      </header>
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h2 className="new-price">{t("Ajouter un nouveau produit")}</h2>
          </div>
          <div className="card-content">
            <div className="card-body">
              <form className="form form-vertical">
                <div className="form-body">
                  <div className="row">
                    {/* Original Inputs */}
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="first-name-icon">{t("Libellé")}</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            id="first-name-icon"
                            maxLength="25"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="first-name-anglais-icon">
                          {t("Libellé Anglais")}
                        </label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            id="first-name-anglais-icon"
                            maxLength="25"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="first-name-arab-icon">
                          {t("Libellé Arab")}
                        </label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            id="first-name-arab-icon"
                            maxLength="25"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="prix-id-icon">{t("Prix")}</label>
                        <div className="position-relative">
                          <input
                            type="number"
                            className="form-control"
                            id="prix-id-icon"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category and Sub-Category Selects */}
                    <div className="col-12">
                      <label>{t("Catégories")}</label>
                      <div className="form-group">
                        <select
                          className="choices category-choices form-select multiple-remove"
                          multiple="multiple"
                        >
                          <optgroup label="Figures">
                            <option value="romboid">Romboid</option>
                            <option value="trapeze" selected>
                              Trapeze
                            </option>
                            <option value="triangle">Triangle</option>
                            <option value="polygon">Polygon</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    <div className="col-12">
                      <label>{t("Sous Catégories")}</label>
                      <div className="form-group">
                        <select
                          className="choices sub-category-choices form-select multiple-remove"
                          multiple="multiple"
                        >
                          <optgroup label="Figures">
                            <option value="romboid">Romboid</option>
                            <option value="trapeze" selected>
                              Trapeze
                            </option>
                            <option value="triangle">Triangle</option>
                            <option value="polygon">Polygon</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    {/* Existing Inputs */}
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="stock-id-icon">{t("Stock")}</label>
                        <div className="position-relative">
                          <input
                            type="number"
                            className="form-control"
                            id="stock-id-icon"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label
                          htmlFor="exampleFormControlTextarea1"
                          className="form-label"
                        >
                          {t("Description")}
                        </label>
                        <textarea
                          className="form-control"
                          id="exampleFormControlTextarea1"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label
                          htmlFor="exampleFormControlTextarea1-anglais"
                          className="form-label"
                        >
                          {t("Description Anglais")}
                        </label>
                        <textarea
                          className="form-control"
                          id="exampleFormControlTextarea1-anglais"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label
                          htmlFor="exampleFormControlTextarea1-arab"
                          className="form-label"
                        >
                          {t("Description Arab")}
                        </label>
                        <textarea
                          className="form-control"
                          id="exampleFormControlTextarea1-arab"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>

                    {/* Radio Buttons for Yes/No (Color Selection) */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>{t("Avec Couleur ?")}</label>
                        <div className="d-flex align-items-center">
                          <input
                            type="radio"
                            name="with-color"
                            value="yes"
                            id="yes-option"
                            checked={withColor === true}
                            onChange={handleWithColorChange}
                          />
                          <label htmlFor="yes-option" className="ms-2">
                            {t("Oui")}
                          </label>

                          <input
                            type="radio"
                            name="with-color"
                            value="no"
                            id="no-option"
                            className="ms-4"
                            checked={withColor === false}
                            onChange={handleWithColorChange}
                          />
                          <label htmlFor="no-option" className="ms-2">
                            {t("Non")}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Input Fields */}
                    {inputs.map((input, index) => (
                      <div key={index} className="col-12">
                        {withColor && (
                          <div className="form-group">
                            <label htmlFor={`color-picker-${index}`}>
                              {t("Couleur")}
                            </label>
                            <input
                              type="color"
                              className="form-control"
                              id={`color-picker-${index}`}
                              value={input.color}
                              onChange={(e) => handleColorChange(e, index)}
                            />
                          </div>
                        )}

                        {withColor !== null && (
                          <div className="form-group">
                            <label>{t("Image")}</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, index)}
                              className="form-control"
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add More Inputs Button */}
                    <div className="col-12">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={addInput}
                        disabled={withColor === null} // Disable if no option is selected
                      >
                        +
                      </button>
                    </div>

                    {/* Form Footer */}
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-light-secondary me-2"
                        data-bs-dismiss="modal"
                      >
                        <i className="bx bx-x d-block d-sm-none"></i>
                        <span
                          className="d-none d-sm-block btn btn-secondary me-3"
                          onClick={goBack}
                        >
                          {t("Annuler")}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        id="suivantBtn"
                      >
                        <Link
                          to="/ProdAction"
                          className="btn-link text-white text-decoration-none"
                          style={{ textDecoration: "none" }}
                        >
                          {t("Suivant")}
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdCreate;
