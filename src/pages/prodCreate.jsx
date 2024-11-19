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
  // const handleCheckboxChange = (event) => {
  //   const promotionvalue = event.target.value;
  //   setIsPromotionChecked(event.target.checked);
  //   setData({ ...data, promotion: promotionvalue });

  // };

  // const onParentCategoryChange = (e) => {
  //   const selectedParentId = e.target.value;
  //   setSelectedParentCategoryId(selectedParentId);
  //   setData({ ...data, libCategoryparente: selectedParentId });

  //   const selectedParentCategory = parentCategories.find(
  //     (category) => category.id === selectedParentId
  //   );

  //   if (selectedParentCategory && selectedParentCategory.categoriesFille) {
  //     setFilteredCategoriesFille(selectedParentCategory.categoriesFille);
  //   } else {
  //     setFilteredCategoriesFille([]);
  //   }
  // };

  const addInput = () => {
    setInputs([...inputs, { color: "", image: "" }]); // Add a new set of inputs
  };
  
  const handleWithColorChange = (e) => {
    const value = e.target.value; // Convert "yes" to true and "no" to false
    setWithColor(value);
    setInputs([{ color: "", image: "" }]); // Reset inputs when changing the option
  };

  
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    console.log("data", data);
  
    const formData = new FormData();
  
    // Append all product data
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  
    // Handle color and options if applicable
    inputs.forEach((input, index) => {
      if (data.withColor) {
        formData.append(`color[${index}]`, input.color);
        formData.append(`galerieWithColor[${index}]`, input.image);
      }
      if (!data.withColor) {
        formData.append(`galerieWithoutColor[${index}]`, input.image);
      }
      if (!data.withOptions) {
        formData.append(`prixWithColorWithoutOptions[${index}]`, input.price);
        formData.append(`stockWithColorWithoutOptions[${index}]`, input.stock);
      }
    });
  
    try {
      const res = await axios.post("http://localhost:8082/api/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response ========== ", res.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product created successfully!",
      });
  
      if (res.status === 201) {
        alert("Product Created: " + res.data);
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response.data.message || "An error occurred while creating the product.",
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
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };
  
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value === "true",
    }));
  };
  
  // Handle color input change
  const handleColorChange = (e, index) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].color = e.target.value;
    setInputs(updatedInputs);
  };
  
  // Handle image input change
  const handleImageChange = (e, index) => {
    const updatedInputs = [...inputs];
    updatedInputs[index].image = e.target.files[0];
    setInputs(updatedInputs);
  };
  
  // Handling dynamic category options
  const onParentCategoryChange = (e) => {
    setData({
      ...data,
      libCategoryparente: e.target.value,
    });
  };
  
  const onFilleCategoryChange = (e) => {
    setData({
      ...data,
      libCategoryfille: e.target.value,
    });
  };
  
  return (
    <div id="main">
      <form onSubmit={handleSubmitProduct} className="card">
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
              <div className="form-body">
                <div className="row">
                  {/* Product input fields */}
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="libelleProductFr">{t("Libellé")}</label>
                      <input
                        type="text"
                        name="libelleProductFr"
                        value={data.libelleProductFr}
                        onChange={handleFormChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  {/* Add other input fields here similarly */}
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="promotion">{t("Promotion")}</label>
                      <input
                        type="checkbox"
                        name="promotion"
                        checked={data.promotion}
                        onChange={handleCheckboxChange}
                      />
                    </div>
                  </div>
  
                  {data.promotion && (
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="valeurPromotion">{t("Valeur Promotion")}</label>
                        <input
                          type="text"
                          name="valeurPromotion"
                          value={data.valeurPromotion}
                          onChange={handleFormChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}
  
                  <div className="col-12">
                    <div className="form-group">
                      <label>{t("Avec couleurs ?")}</label>
                      <div>
                        <input
                          type="radio"
                          value="true"
                          name="withColor"
                          checked={data.withColor}
                          onChange={handleRadioChange}
                        />
                        {t("Oui")}
                        <input
                          type="radio"
                          value="false"
                          name="withColor"
                          checked={!data.withColor}
                          onChange={handleRadioChange}
                        />
                        {t("Non")}
                      </div>
                    </div>
                  </div>
  
                  <div className="col-12">
                    <div className="form-group">
                      <label>{t("Avec options ?")}</label>
                      <div>
                        <input
                          type="radio"
                          value="true"
                          name="withOptions"
                          checked={data.withOptions}
                          onChange={handleRadioChange}
                        />
                        {t("Oui")}
                        <input
                          type="radio"
                          value="false"
                          name="withOptions"
                          checked={!data.withOptions}
                          onChange={handleRadioChange}
                        />
                        {t("Non")}
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Color & image inputs */}
                {data.withColor && (
                  <div className="col-12">
                    <div className="form-group">
                      <label>{t("Color and Images")}</label>
                      {/* Color & image input logic here */}
                    </div>
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary">
                {t("Submit")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
  
};

export default ProdCreate;
