import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProdCreate = () => {
  const [withColor, setWithColor] = useState(null); // null initially, then true for "Yes" and false for "No"
  const [inputs, setInputs] = useState([{ color: "", image: "" }]); // Dynamic inputs
  const [categories, setCategories] = useState([]); // State to store categories
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    libelle: "",
    libelleAnglais: "",
    libelleArab: "",
    reference: "",
    prix: "",
    stock: "",
    description: "",
    descriptionAnglais: "",
    descriptionArab: "",
    selectedCategories: []
  });

  const goBack = () => {
    window.history.back(); // Simulate a browser back button
  };

  useEffect(() => {
    // Fetch categories from the backend API
    axios.get("http://localhost:8082/api/categories/getAll")
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });

    // Apply Choices.js only to select elements
    const categoryChoices = new Choices(".category-choices", {
      removeItemButton: true,
      maxItemCount: 5, // Maximum number of items allowed to select
    });

    // Cleanup function
    return () => {
      categoryChoices.destroy();
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

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      selectedCategories: selected,
    });
  };

  const handleSubmit = () => {
    const data = new FormData();
    data.append("libelle", formData.libelle);
    data.append("libelleAnglais", formData.libelleAnglais);
    data.append("libelleArab", formData.libelleArab);
    data.append("reference", formData.reference);
    data.append("prix", formData.prix);
    data.append("stock", formData.stock);
    data.append("description", formData.description);
    data.append("descriptionAnglais", formData.descriptionAnglais);
    data.append("descriptionArab", formData.descriptionArab);
    data.append("categories", formData.selectedCategories);

    // Append dynamic inputs (colors and images)
    inputs.forEach((input, index) => {
      data.append(`colors[${index}]`, input.color);
      data.append(`images[${index}]`, input.image);
    });

    axios.post("http://localhost:8082/api/products/create", data)
      .then(response => {
        console.log("Product created successfully:", response.data);
      })
      .catch(error => {
        console.error("Error creating product:", error);
      });
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
                            name="libelle"
                            value={formData.libelle}
                            onChange={handleFormChange}
                            className="form-control"
                            id="first-name-icon"
                            maxLength="25"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Other Inputs ... */}
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="libelleAnglais">{t("Libellé Anglais")}</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            name="libelleAnglais"
                            value={formData.libelleAnglais}
                            onChange={handleFormChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="libelleArab">{t("Libellé Arabe")}</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            name="libelleArab"
                            value={formData.libelleArab}
                            onChange={handleFormChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="reference">{t("Référence")}</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            name="reference"
                            value={formData.reference}
                            onChange={handleFormChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="prix">{t("Prix")}</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            name="prix"
                            value={formData.prix}
                            onChange={handleFormChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="stock">{t("Stock")}</label>
                        <div className="position-relative">
                          <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleFormChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="description">{t("Description")}</label>
                        <div className="position-relative">
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            className="form-control"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="descriptionAnglais">{t("Description Anglais")}</label>
                        <div className="position-relative">
                          <textarea
                            name="descriptionAnglais"
                            value={formData.descriptionAnglais}
                            onChange={handleFormChange}
                            className="form-control"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="descriptionArab">{t("Description Arabe")}</label>
                        <div className="position-relative">
                          <textarea
                            name="descriptionArab"
                            value={formData.descriptionArab}
                            onChange={handleFormChange}
                            className="form-control"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="col-12">
                      <label>{t("Catégories")}</label>
                      <div className="form-group">
                        <select
                          name="categories"
                          className="choices category-choices form-select multiple-remove"
                          multiple="multiple"
                          value={formData.selectedCategories}
                          onChange={handleCategoryChange}
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* With Color Selection */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>{t("Avec Couleur ?")}</label>
                        <select
                          name="withColor"
                          className="form-select"
                          value={withColor === true ? "yes" : withColor === false ? "no" : ""}
                          onChange={handleWithColorChange}
                        >
                          <option value="">{t("Sélectionnez une option")}</option>
                          <option value="yes">{t("Oui")}</option>
                          <option value="no">{t("Non")}</option>
                        </select>
                      </div>
                    </div>

                    {/* Dynamic Inputs (Color and Image) */}
                    {withColor &&
                      inputs.map((input, index) => (
                        <div className="row" key={index}>
                          <div className="col-6">
                            <label>{t("Couleur")}</label>
                            <input
                              type="text"
                              value={input.color}
                              onChange={(e) => handleColorChange(e, index)}
                              className="form-control"
                            />
                          </div>
                          <div className="col-6">
                            <label>{t("Image")}</label>
                            <input
                              type="file"
                              onChange={(e) => handleImageChange(e, index)}
                              className="form-control"
                            />
                          </div>
                        </div>
                      ))}

                    {/* Add More Inputs Button */}
                    {withColor && (
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={addInput}
                        >
                          +
                        </button>
                      </div>
                    )}

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
                        onClick={handleSubmit}
                      >
                        {t("Suivant")}
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
