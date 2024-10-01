import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProdCreate = () => {
  const [withColor, setWithColor] = useState(null); // null initially, then true for "Yes" and false for "No"
  const [inputs, setInputs] = useState([{ color: "", image: "" }]); // Dynamic inputs
  const [parentCategories, setParentCategories] = useState([]); // State to store parent categories
  const [categoriesFille, setCategoriesFille] = useState([]); // State to store child categories
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
    parentCategoryId: "", // For the selected parent category
    selectedCategoriesFille: [],
  });

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    // Fetch parent categories from the backend API
    axios.get("http://localhost:8082/api/categories/parents")
      .then(response => {
        setParentCategories(response.data);
      })
      .catch(error => {
        console.error("Error fetching parent categories:", error);
      });

    // Fetch all categories for child categories
    axios.get("http://localhost:8082/api/categories/getAll")
      .then(response => {
        setCategoriesFille(response.data);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
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

  const handleCategoryFilleChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({
      ...formData,
      selectedCategoriesFille: selected,
    });
  };

  const handleSelectChange = (e) => {
    setFormData({
      ...formData,
      parentCategoryId: e.target.value, // Set the selected parent category ID
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
    data.append("parentCategoryId", formData.parentCategoryId);
    data.append("categoriesFille", formData.selectedCategoriesFille);

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

                    {/* Parent Category Selection */}
                    <div className="col-12">
                      <div className="form-group" style={{ marginBottom: "15px" }}>
                        <label htmlFor="category-select">{t("Catégorie Parent")}</label>
                        <select
                          id="category-select"
                          className="form-select"
                          value={formData.parentCategoryId}
                          onChange={handleSelectChange}
                          required
                        >
                          <option value="">Select a parent category</option>
                          {parentCategories.length > 0 ? (
                            parentCategories.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.libCategorie}
                              </option>
                            ))
                          ) : (
                            <option>Loading...</option>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Child Category Selection */}
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="categoriesFille">{t("Catégorie Fille")}</label>
                        <select
                          multiple
                          className="form-control"
                          onChange={handleCategoryFilleChange}
                          id="categoriesFille"
                        >
                          {categoriesFille.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.libelle}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Handle Color Inputs */}
                    <div className="col-12">
                      <div className="form-group">
                        <label>{t("Utiliser des couleurs ?")}</label>
                        <div>
                          <select onChange={handleWithColorChange} className="form-control">
                            <option value="no">{t("Non")}</option>
                            <option value="yes">{t("Oui")}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {withColor !== null && (
                      <div className="col-12">
                        <div className="form-group">
                          <label>{t("Couleurs")}</label>
                          {inputs.map((input, index) => (
                            <div key={index} className="row">
                              <div className="col-6">
                                <input
                                  type="text"
                                  placeholder={t("Couleur")}
                                  value={input.color}
                                  onChange={(e) => handleColorChange(e, index)}
                                  className="form-control"
                                />
                              </div>
                              <div className="col-6">
                                <input
                                  type="file"
                                  onChange={(e) => handleImageChange(e, index)}
                                  className="form-control"
                                />
                              </div>
                            </div>
                          ))}
                          <button type="button" onClick={addInput} className="btn btn-secondary">
                            {t("Ajouter une couleur")}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="col-12 d-flex justify-content-end">
                      <button type="button" onClick={handleSubmit} className="btn btn-primary">
                        {t("Créer le produit")}
                      </button>
                    </div>

                    {/* Go Back Button */}
                    <div className="col-12 d-flex justify-content-start">
                      <button type="button" onClick={goBack} className="btn btn-danger">
                        {t("Retour")}
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
