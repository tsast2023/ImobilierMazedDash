import React, { useState, useEffect, useContext } from "react";
import axios from "axios"; // Import axios for API calls
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
const ProdCreate = () => {
  const token = Cookies.get("token");
  const [withColor, setWithColor] = useState(null);
  const [inputs, setInputs] = useState([{ color: "", image: "" }]);
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentCategoryId, setSelectedParentCategoryId] =useState(null);
  const [filteredCategoriesFille, setFilteredCategoriesFille] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [selectedCategoryFille, setSelectedCategoryFille] = useState("");
  const [isPromotionChecked, setIsPromotionChecked] = useState(false);
  const { t } = useTranslation();
  const [withOptions, setWithOptions] = useState(null);
  const [data, setData] = useState({
    libelleProductAr : "",
    libelleProductFr :"", 
    libelleProductEn :"",
    reference : "",
    withColor : false ,
    color : [],
    galerieWithoutColor : [] ,
    galerieWithColor : [],
    prixPrincipale : 0 ,
    stockWithColorWithoutOptions : [] ,
    prixWithColorWithoutOptions : [] ,
    stockWithoutColorWithoutOptions : 0 ,
    prixWithoutColorWithoutOptions : 0 ,
    codeABarre : "",
    qrCode : "" ,
    typeProduct : "",
    visiteMagasin : "", // Store visit
    publicationDate : "" ,// Date of publication
   productType : "",
     libCategoryfille :"",
    libCategoryparente :"",
   alaUne :"",
     descriptionAr :"",
   descriptionFr :"" ,
   descriptionEn : "" ,
   prixMazedOnline : "" ,
  promotion : false ,
  valeurPromotion : "",
  withOptions  : false
  });

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
  const handleCheckboxChange = (event) => {
    const promotionvalue = event.target.value;
    setIsPromotionChecked(event.target.checked);
    setData({ ...data, promotion: promotionvalue });

  };

  const onParentCategoryChange = (e) => {
    const selectedParentId = e.target.value;
    setSelectedParentCategoryId(selectedParentId);
    setData({ ...data, libCategoryparente: selectedParentId });

    const selectedParentCategory = parentCategories.find(
      (category) => category.id === selectedParentId
    );

    if (selectedParentCategory && selectedParentCategory.categoriesFille) {
      setFilteredCategoriesFille(selectedParentCategory.categoriesFille);
    } else {
      setFilteredCategoriesFille([]);
    }
  };
  const onFilleCategoryChange = (e) => {
    const selectedParentId = e.target.value;
    setData({ ...data, libCategoryfille: selectedParentId });
  }
  const addInput = () => {
    setInputs([...inputs, { color: "", image: "" }]); // Add a new set of inputs
  };
  
  const handleWithColorChange = (e) => {
    const value = e.target.value; // Convert "yes" to true and "no" to false
    setWithColor(value);
    setInputs([{ color: "", image: "" }]); // Reset inputs when changing the option
  };
  const handleColorChange = (e, index) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].color = e.target.value;
    setInputs(updatedInputs);
  };
  
  const handleImageChange = (e, index) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].image = e.target.files[0];
    setInputs(updatedInputs);
  };
  
const handleSubmitProduct = async (e) => {
  e.preventDefault();  
   console.log("data" , data)
  const formData = new FormData();
  formData.append('libelleProductFr', data.libelleProductFr);
  formData.append('libelleProductEn', data.libelleProductEn);
  formData.append('libelleProductAr', data.libelleProductAr);
  formData.append('reference', data.reference);
  formData.append('descriptionFr', data.descriptionFr);
  formData.append('descriptionEn', data.descriptionEn);
  formData.append('descriptionAr', data.descriptionAr);
  formData.append('libCategoryparente', data.libCategoryparente);
  formData.append('libCategoryfille', data.libCategoryfille);  
  formData.append('withColor', data.withColor); 
  formData.append('withOptions', data.withOptions); 
  formData.append('valeurPromotion', data.valeurPromotion); 
  formData.append('promotion', data.promotion); 
  console.log("withColor ===" , withColor);
  console.log("withOptions ===" , withOptions);
  inputs.forEach((input, index) => {
    if (withColor) {
      formData.append(`color[${index}]`, input.color);
      formData.append(`galerieWithColor[${index}]`, input.image);
    }
    if (withColor === false) {
      formData.append(`galerieWithoutColor[${index}]`, input.image);
    }
    if (withOptions === 'false') {
      formData.append(`prixWithColorWithoutOptions[${index}]`, input.price);
      formData.append(`stockWithColorWithoutOptions[${index}]`, input.stock);
    }
  });
  
  try {
    const response = await axios.post("http://localhost:8082/api/products/create",formData, {
      headers: {
      "Content-Type": "multipart/form-data",
      },
    });
    console.log("response ========== " , response.data);
    
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Category created successfully!",
    });

    if (response.status === 201) {
      alert("Product Created: " + response.data);
    }
  } catch (error) {
    // Handle errors
    if (error.response) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response.data.message || "An error occurred while creating the category.",
      });
    } else {
      console.error("Error:", error.message);
    }
  }
};
const handleFormChange = (e) => {
  const { name, value } = e.target;
  setData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};


  return (
    <div id="main">
  <form  onSubmit={handleSubmitProduct} className="card">
      <header className="mb-3">
        <a href="#" className="burger-btn d-block d-xl-none">
          <i className="bi bi-justify fs-3"></i>
        </a>
      </header>

  <div className="col-md-12">
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
                      name="libelleProductFr"
                      onChange={handleFormChange}
                      className="form-control"
                      id="first-name-icon"
                      maxLength="25"
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="libelleAnglais">{t("Libellé Anglais")}</label>
                  <div className="position-relative">
                    <input
                      type="text"
                      name="libelleProductEn"
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
                      name="libelleProductAr"
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
                      name="descriptionFr"
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="descriptionEn">{t("Description Anglaise")}</label>
                  <div className="position-relative">
                    <textarea
                      name="descriptionEn"
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="descriptionArab">{t("Description Arabe")}</label>
                  <div className="position-relative">
                    <textarea
                      name="descriptionAr"
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="parentCategory">{t("Parent Category")}</label>
                  <select
                    className="form-control"
                    onChange={onParentCategoryChange}
                    id="parentCategory"
                  >
                    <option value="">{t("Select Parent Category")}</option>
                    {parentCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.libCategorie}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="categoriesFille">{t("Catégorie Fille")}</label>
                  <select
                    className="form-control"
                    onChange={onFilleCategoryChange}
                    id="categoriesFille"
                  >
                    {filteredCategoriesFille.length > 0 ? (
                      filteredCategoriesFille.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.libCategorie}
                        </option>
                      ))
                    ) : (
                      <option value="">{t("No child categories found")}</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="libelleAnglais">{t("Promotion")}</label>
                  <div className="position-relative">
                    <input
                      type="checkbox"
                      name="promtotion"
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </div>
              </div>

              {isPromotionChecked && (
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="valeurPromotion">{t("Valeur Promotion")}</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="valeurPromotion"
                        className="form-control"
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </div>
              )}

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
                          value="true"
                          onChange={handleWithColorChange}
                        />
                        <label className="form-check-label" htmlFor="withColorYes">
                          {t("Oui")}
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="withColor"
                          id="withColorNo"
                          value="false"
                          onChange={handleWithColorChange}
                        />
                        <label className="form-check-label" htmlFor="withColorNo">
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
                          value="true"
                          onChange={handleWithOptionsChange}
                        />
                        <label className="form-check-label" htmlFor="withOptionsYes">
                          {t("Oui")}
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="withOptions"
                          id="withOptionsNo"
                          value="false"
                          onChange={handleWithOptionsChange}
                        />
                        <label className="form-check-label" htmlFor="withOptionsNo">
                          {t("Non")}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* {withColor !== null && (
                  <div className="col-12">
                    <div className="form-group row align-items-center">
                      {inputs.map((input, index) => (
                        <div key={index} className="d-flex align-items-center mb-3">
                          {withColor && (
                            <div className="me-4 mb-3">
                              <label>{t("Couleur")}</label>
                              <input
                                type="color"
                                value={input.color}
                                onChange={(e) => handleColorChange(e, index)}
                                className="form-control form-control-color"
                              />
                            </div>
                          )}
                          <div className="me-4 mb-3">
                            <label>{t("Image")}</label>
                            <input
                              type="file"
                              onChange={(e) => handleImageChange(e, index)}
                              className="form-control"
                            />
                          </div>

                          {withOptions === "false" && (
                            <>
                              <div className="me-4 mb-3">
                                <label>{t("Prix")}</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="price"
                                />
                              </div>
                              <div className="mb-3">
                                <label>{t("Stock")}</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="stock"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>

          <div className="card-footer d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {t("Ajouter Produit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</form>

      </div>
 
  );
};

export default ProdCreate;
