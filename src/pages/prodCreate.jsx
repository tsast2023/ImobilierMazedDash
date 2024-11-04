import React, { useState, useEffect, useContext } from "react";
import axios from "axios"; // Import axios for API calls
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import { GlobalState } from "../GlobalState";
import { Link, useNavigate } from "react-router-dom";

const ProdCreate = () => {
  const [withColor, setWithColor] = useState(null);
  const [inputs, setInputs] = useState([{ color: "", image: "" }]);
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentCategoryId, setSelectedParentCategoryId] =
    useState(null);
  const [filteredCategoriesFille, setFilteredCategoriesFille] = useState([]);
  const { t } = useTranslation();
  const state = useContext(GlobalState);
  const [withOptions, setWithOptions] = useState(null);
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
    parentCategoryNames: "",
    selectedCategoriesFille: [],
  });

  // Function to pass data when pressing 'Suivant'
  const handleNextClick = () => {
    // Ensure you have the necessary data in formData and inputs
    console.log("Passing form data:", formData);
    console.log("Passing inputs:", inputs);
  };

  const goBack = () => {
    window.history.back();
  };

  // Fetching parent categories from backend
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8082/api/categories/parents"
        );
        setParentCategories(response.data);
      } catch (error) {
        console.error("Error fetching parent categories:", error);
      }
    };

    fetchParentCategories();
  }, []);

  const handleWithOptionsChange = (e) => {
    const value = e.target.value;
    setWithOptions(value);
  };

  const onParentCategoryChange = (e) => {
    const selectedParentId = e.target.value;
    setSelectedParentCategoryId(selectedParentId);

    const selectedParentCategory = parentCategories.find(
      (category) => category.id === selectedParentId
    );

    if (selectedParentCategory && selectedParentCategory.categoriesFille) {
      setFilteredCategoriesFille(selectedParentCategory.categoriesFille);
    } else {
      setFilteredCategoriesFille([]);
    }

    // Debugging log
    console.log("Selected Parent Category:", selectedParentCategory);
    console.log("Filtered Categories Fille:", filteredCategoriesFille);
  };

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
    const selected = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
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

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("libelle", formData.libelle);
    data.append("libelleAnglais", formData.libelleAnglais);
    data.append("libelleArab", formData.libelleArab);
    data.append("reference", formData.reference);
    data.append("description", formData.description);
    data.append("descriptionAnglais", formData.descriptionAnglais);
    data.append("descriptionArab", formData.descriptionArab);
    data.append("parentCategoryId", formData.parentCategoryId);
    data.append("categoriesFille", formData.selectedCategoriesFille);

    inputs.forEach((input, index) => {
      data.append(`colors[${index}]`, input.color);
      data.append(`images[${index}]`, input.image);
    });

    try {
      const response = await axios.post(
        "http://localhost:8082/api/products/create",
        data
      );
      console.log("Product created successfully:", response.data);
    } catch (error) {
      console.error("Error creating product:", error);
    }
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
                        <label htmlFor="libelleAnglais">
                          {t("Libellé Anglais")}
                        </label>
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
                        <label htmlFor="libelleArab">
                          {t("Libellé Arabe")}
                        </label>
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
                        <label htmlFor="description">{t("Description")}</label>
                        <div className="position-relative">
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="descriptionAnglais">
                          {t("Description Anglaise")}
                        </label>
                        <div className="position-relative">
                          <textarea
                            name="descriptionAnglais"
                            value={formData.descriptionAnglais}
                            onChange={handleFormChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="descriptionArab">
                          {t("Description Arabe")}
                        </label>
                        <div className="position-relative">
                          <textarea
                            name="descriptionArab"
                            value={formData.descriptionArab}
                            onChange={handleFormChange}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="parentCategory">
                          {t("Parent Category")}
                        </label>
                        <select
                          className="form-control"
                          onChange={onParentCategoryChange}
                          id="parentCategory"
                        >
                          <option value="">
                            {t("Select Parent Category")}
                          </option>
                          {parentCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.libCategorie}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Categories Fille (Child Categories) Dropdown */}
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="categoriesFille">
                          {t("Catégorie Fille")}
                        </label>
                        <select
                          className="form-control"
                          onChange={handleCategoryFilleChange}
                          id="categoriesFille"
                        >
                          {/* Display filtered child categories */}
                          {filteredCategoriesFille.length > 0 ? (
                            filteredCategoriesFille.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.libCategorie}
                              </option>
                            ))
                          ) : (
                            <option value="">
                              {t("No child categories found")}
                            </option>
                          )}
                        </select>
                      </div>
                    </div>

                    {/* Handle Color and Options Inputs */}
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label>{t("Avec couleurs ?")}</label>
                          <div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="withColor"
                                id="withColorYes"
                                value="yes"
                                onChange={handleWithColorChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="withColorYes"
                              >
                                {t("Oui")}
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="withColor"
                                id="withColorNo"
                                value="no"
                                onChange={handleWithColorChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="withColorNo"
                              >
                                {t("Non")}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label>{t("Avec options ?")}</label>
                          <div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="withOptions"
                                id="withOptionsYes"
                                value="yes"
                                onChange={handleWithOptionsChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="withOptionsYes"
                              >
                                {t("Oui")}
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="withOptions"
                                id="withOptionsNo"
                                value="no"
                                onChange={handleWithOptionsChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="withOptionsNo"
                              >
                                {t("Non")}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Conditionally Render Inputs Based on States */}
                      {withColor !== null && (
                        <div className="col-12">
                          <div className="form-group row align-items-center">
                            {inputs.map((input, index) => (
                              <div
                                key={index}
                                className="d-flex align-items-center mb-3"
                              >
                                {withColor && (
                                  <div className="me-4 mb-3">
                                    {" "}
                                    {/* Added mb-3 for spacing */}
                                    <label>{t("Couleur")}</label>
                                    <input
                                      type="color"
                                      value={input.color}
                                      onChange={(e) =>
                                        handleColorChange(e, index)
                                      }
                                      className="form-control form-control-color"
                                    />
                                  </div>
                                )}
                                <div className="me-4 mb-3">
                                  {" "}
                                  {/* Added mb-3 for spacing */}
                                  <label>{t("Image")}</label>
                                  <input
                                    type="file"
                                    onChange={(e) =>
                                      handleImageChange(e, index)
                                    }
                                    className="form-control"
                                  />
                                </div>
                                {withOptions === "yes" && ( // Only show if withOptions is "yes"
                                  <>
                                    <div className="me-4 mb-3">
                                      {" "}
                                      {/* Added mb-3 for spacing */}
                                      <label>{t("Prix")}</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                      />
                                    </div>
                                    <div className="mb-3">
                                      {" "}
                                      {/* Added mb-3 for spacing */}
                                      <label>{t("Stock")}</label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        Ensure
                                        you
                                        handle
                                        stock
                                        change
                                        correctly
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={addInput}
                            className="btn btn-secondary mt-3"
                          >
                            {t("Ajouter une couleur ou image")}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Go Back Button */}
                    <Modal.Footer>
                      <div className="col-12 d-flex justify-content-end">
                        <button
                          type="button"
                          onClick={goBack}
                          className="btn btn-secondary me-3"
                        >
                          {t("Retour")}
                        </button>
                        <Link
                          to={{
                            pathname: "/ProdAction",
                            state: { formData, inputs },
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleNextClick}
                          >
                            {t("Suivant")}
                          </button>
                        </Link>
                      </div>
                    </Modal.Footer>
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