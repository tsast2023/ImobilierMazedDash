import React, { useState, useEffect } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProdCreate = () => {
  const [withColor, setWithColor] = useState(null); // null initially, then true for "Yes" and false for "No"
  const [inputs, setInputs] = useState([{ color: "", image: "" }]); // Dynamic inputs
  const [formData, setFormData] = useState({
    libelleProductAr: "",
    libelleProductFr: "",
    libelleProductEn: "",
    reference: "",
    stockInitiale: 1,
    prixPrincipale: 0,
    couleurs: "",
    codeABarre: "",
    qrCode: "",
    typeProduct: false,
    libCategoryfille: "",
    descriptionAr: "",
    descriptionFr: "",
    descriptionEn: "",
    promotion: false,
    valeurPromotion: 25,
    visiteMagasin: false,
    libCategoryparente: "",
    alaUne: false,
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("libelleProductAr", formData.libelleProductAr);
    form.append("libelleProductFr", formData.libelleProductFr);
    form.append("libelleProductEn", formData.libelleProductEn);
    form.append("reference", formData.reference);
    form.append("stockInitiale", formData.stockInitiale);
    form.append("prixPrincipale", formData.prixPrincipale);
    form.append("couleurs", formData.couleurs);
    form.append("codeABarre", formData.codeABarre);
    form.append("qrCode", formData.qrCode);
    form.append("typeProduct", formData.typeProduct);
    form.append("libCategoryfille", formData.libCategoryfille);
    form.append("descriptionAr", formData.descriptionAr);
    form.append("descriptionFr", formData.descriptionFr);
    form.append("descriptionEn", formData.descriptionEn);
    form.append("promotion", formData.promotion);
    form.append("valeurPromotion", formData.valeurPromotion);
    form.append("visiteMagasin", formData.visiteMagasin);
    form.append("libCategoryparente", formData.libCategoryparente);
    form.append("alaUne", formData.alaUne);
    
    // Append images and colors to form data if withColor is true
    if (withColor) {
      inputs.forEach((input, index) => {
        if (input.color) {
          form.append(`galerieWithColor[${index}][0]`, input.image);
          form.append(`galerieWithColor[${index}][1]`, input.color);
        } else {
          form.append(`galerieWithoutColor`, input.image);
        }
      });
    }

    try {
      const response = await fetch("http://localhost:8082/api/products/create", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Product created successfully:", data);
        // Optionally redirect or show success message
      } else {
        console.error("Failed to create product:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
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
              <form className="form form-vertical" onSubmit={handleSubmit}>
                <div className="form-body">
                  <div className="row">
                    {/* Input Fields */}
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="libelleProductAr">{t("Libellé Arabe")}</label>
                        <input
                          type="text"
                          className="form-control"
                          id="libelleProductAr"
                          value={formData.libelleProductAr}
                          onChange={(e) => setFormData({ ...formData, libelleProductAr: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="libelleProductFr">{t("Libellé Français")}</label>
                        <input
                          type="text"
                          className="form-control"
                          id="libelleProductFr"
                          value={formData.libelleProductFr}
                          onChange={(e) => setFormData({ ...formData, libelleProductFr: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="libelleProductEn">{t("Libellé Anglais")}</label>
                        <input
                          type="text"
                          className="form-control"
                          id="libelleProductEn"
                          value={formData.libelleProductEn}
                          onChange={(e) => setFormData({ ...formData, libelleProductEn: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="reference">{t("Référence")}</label>
                        <input
                          type="text"
                          className="form-control"
                          id="reference"
                          value={formData.reference}
                          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="prixPrincipale">{t("Prix Principal")}</label>
                        <input
                          type="number"
                          className="form-control"
                          id="prixPrincipale"
                          value={formData.prixPrincipale}
                          onChange={(e) => setFormData({ ...formData, prixPrincipale: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="stockInitiale">{t("Stock Initial")}</label>
                        <input
                          type="number"
                          className="form-control"
                          id="stockInitiale"
                          value={formData.stockInitiale}
                          onChange={(e) => setFormData({ ...formData, stockInitiale: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="codeABarre">{t("Code à Barres")}</label>
                        <input
                          type="text"
                          className="form-control"
                          id="codeABarre"
                          value={formData.codeABarre}
                          onChange={(e) => setFormData({ ...formData, codeABarre: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="qrCode">{t("QR Code")}</label>
                        <input
                          type="text"
                          className="form-control"
                          id="qrCode"
                          value={formData.qrCode}
                          onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="libCategoryfille">{t("Sous-catégorie")}</label>
                        <input
                          type="text"
                          className="form-control category-choices"
                          id="libCategoryfille"
                          value={formData.libCategoryfille}
                          onChange={(e) => setFormData({ ...formData, libCategoryfille: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="libCategoryparente">{t("Catégorie Parente")}</label>
                        <input
                          type="text"
                          className="form-control"
                          id="libCategoryparente"
                          value={formData.libCategoryparente}
                          onChange={(e) => setFormData({ ...formData, libCategoryparente: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="descriptionAr">{t("Description Arabe")}</label>
                        <textarea
                          className="form-control"
                          id="descriptionAr"
                          value={formData.descriptionAr}
                          onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="descriptionFr">{t("Description Français")}</label>
                        <textarea
                          className="form-control"
                          id="descriptionFr"
                          value={formData.descriptionFr}
                          onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="descriptionEn">{t("Description Anglais")}</label>
                        <textarea
                          className="form-control"
                          id="descriptionEn"
                          value={formData.descriptionEn}
                          onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-12">
                      <label htmlFor="promotion">{t("Promotion")}</label>
                      <input
                        type="checkbox"
                        id="promotion"
                        checked={formData.promotion}
                        onChange={(e) => setFormData({ ...formData, promotion: e.target.checked })}
                      />
                    </div>

                    {formData.promotion && (
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="valeurPromotion">{t("Valeur de la Promotion")}</label>
                          <input
                            type="number"
                            className="form-control"
                            id="valeurPromotion"
                            value={formData.valeurPromotion}
                            onChange={(e) => setFormData({ ...formData, valeurPromotion: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-12">
                      <label htmlFor="visiteMagasin">{t("Visite en Magasin")}</label>
                      <input
                        type="checkbox"
                        id="visiteMagasin"
                        checked={formData.visiteMagasin}
                        onChange={(e) => setFormData({ ...formData, visiteMagasin: e.target.checked })}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="alaUne">{t("À la Une")}</label>
                      <input
                        type="checkbox"
                        id="alaUne"
                        checked={formData.alaUne}
                        onChange={(e) => setFormData({ ...formData, alaUne: e.target.checked })}
                      />
                    </div>

                    {/* Color and Image Inputs */}
                    <div className="col-12">
                      <label>{t("Avez-vous des couleurs pour ce produit ?")}</label>
                      <select onChange={handleWithColorChange}>
                        <option value="no">{t("Non")}</option>
                        <option value="yes">{t("Oui")}</option>
                      </select>
                    </div>

                    {withColor !== null && (
                      <div className="col-12">
                        {inputs.map((input, index) => (
                          <div key={index}>
                            <label>{t("Couleur")}</label>
                            <input
                              type="text"
                              value={input.color}
                              onChange={(e) => handleColorChange(e, index)}
                            />
                            <label>{t("Image")}</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, index)}
                            />
                          </div>
                        ))}
                        <button type="button" onClick={addInput}>
                          {t("Ajouter une couleur")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {t("Créer le produit")}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={goBack}>
                    {t("Annuler")}
                  </button>
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
