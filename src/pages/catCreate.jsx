import React, { useContext, useEffect, useState } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.css";
import { GlobalState } from "../GlobalState";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Swal from 'sweetalert2';

const CatCreate = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [data, setData] = useState({
    libCategorie: "",
    libCategorieEN: "",
    libCategorieAR: "",
    parentCategoryNames: [],
    criteres: [],
  });

  const [inputs, setInputs] = useState([]);
  const [icon, setIcon] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const state = useContext(GlobalState);
  const categoriess = state.Categories;
  const { t } = useTranslation();

  const goBack = () => {
    window.history.back();
  };

  // Fetch parent categories
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/categories/parents");
        setParentCategories(response.data);
      } catch (error) {
        console.error("Error fetching parent categories:", error);
      }
    };

    fetchParentCategories();
  }, []);

  // Initialize Choices.js for category selects
  useEffect(() => {
    const categorySelect = new Choices("#category-select", {
      removeItemButton: true,
      placeholder: true,
      placeholderValue: "Select an option",
      shouldSort: false,
    });

    const handleSelectChange = () => {
      const hasSelection = categorySelect.getValue().length > 0;
      setIsEnabled(hasSelection);
      if (!hasSelection) {
        setInputs([]);
      }
    };

    // Event listener for select changes
    categorySelect.passedElement.element.addEventListener("change", handleSelectChange);

    return () => {
      categorySelect.passedElement.element.removeEventListener("change", handleSelectChange);
      categorySelect.destroy();
    };
  }, [categoriess]);

  const handleAddInput = () => {
    const newInput = {
      criteresNames: "",
      criteresNamesEn: "",
      criteresNamesAr: "",
    };
    setInputs([...inputs, newInput]);
  };

  const submitCat = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append the basic data
    formData.append("libCategorie", data.libCategorie);
    formData.append("libCategorieAR", data.libCategorieAR);
    formData.append("libCategorieEN", data.libCategorieEN);
    formData.append("parentCategoryNames", data.parentCategoryNames.join(","));

    // Append criteria data
    inputs.forEach((item) => {
      formData.append("criteresNames", item.criteresNames);
      formData.append("criteresNamesEn", item.criteresNamesEn);
      formData.append("criteresNamesAr", item.criteresNamesAr);
    });

    // Append the icon file if it's selected
    if (icon) {
      formData.append("icon", icon);
    }

    try {
      const res = await axios.post(
        "http://localhost:8082/api/categories/create",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Category created successfully!',
      });
      console.log("Response data:", res.data);
    } catch (error) {
      if (error.response) {
        console.log("Error data:", error.response.data);
        console.log("Error status:", error.response.status);
      } else if (error.request) {
        console.log("Error request:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
      console.log("Config:", error.config);
    }
  };

  const handleIconChange = (e) => {
    setIcon(e.target.files[0]);
  };

  return (
    <div className="content-container">
      <form onSubmit={submitCat} className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">{t("Créer une catégorie")}</h2>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddInput}
            disabled={!isEnabled}
            style={{ backgroundColor: !isEnabled ? "#b0210e" : "" }}
          >
            +
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="basicInput">{t("Libellé")}</label>
                <input
                  onChange={(e) => {
                    setData({ ...data, libCategorie: e.target.value });
                  }}
                  type="text"
                  className="form-control"
                  id="basicInput"
                />
              </div>
              <div className="form-group">
                <label htmlFor="libelleEng">{t("Libellé en Anglais")}</label>
                <input
                  onChange={(e) => {
                    setData({ ...data, libCategorieEN: e.target.value });
                  }}
                  type="text"
                  className="form-control"
                  id="libelleEng"
                />
              </div>
              <div className="form-group">
                <label htmlFor="libelleArab">{t("Libellé en Arabe")}</label>
                <input
                  onChange={(e) => {
                    setData({ ...data, libCategorieAR: e.target.value });
                  }}
                  type="text"
                  className="form-control"
                  id="libelleArab"
                />
              </div>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label htmlFor="category-select">{t("Catégories")}</label>
                <select
                  id="category-select"
                  className="choices form-select multiple-remove"
                  multiple
                >
                  <optgroup>
                    {categoriess ? (
                      categoriess.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.libCategorie}
                        </option>
                      ))
                    ) : (
                      <option>loading</option>
                    )}
                  </optgroup>
                </select>
              </div>

              {inputs.map((input, index) => (
                <div key={index} className="form-group" style={{ marginTop: "15px" }}>
                  <label htmlFor={`criteresNames-${index}`}>{t("Critère en Français")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={input.criteresNames}
                    onChange={(e) => {
                      const newInputs = [...inputs];
                      newInputs[index].criteresNames = e.target.value;
                      setInputs(newInputs);
                    }}
                    style={{ marginTop: "10px" }}
                  />
                  <label htmlFor={`criteresNamesEn-${index}`}>{t("Critère en Anglais")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={input.criteresNamesEn}
                    onChange={(e) => {
                      const newInputs = [...inputs];
                      newInputs[index].criteresNamesEn = e.target.value;
                      setInputs(newInputs);
                    }}
                    style={{ marginTop: "10px" }}
                  />
                  <label htmlFor={`criteresNamesAr-${index}`}>{t("Critère en Arabe")}</label>
                  <input
                    type="text"
                    className="form-control"
                    value={input.criteresNamesAr}
                    onChange={(e) => {
                      const newInputs = [...inputs];
                      newInputs[index].criteresNamesAr = e.target.value;
                      setInputs(newInputs);
                    }}
                    style={{ marginTop: "10px" }}
                  />
                </div>
              ))}
              <div className="form-group" style={{ marginTop: "15px" }}>
                <label htmlFor="iconInput">{t("Icon")}</label>
                <input
                  type="file"
                  className="form-control"
                  id="iconInput"
                  onChange={handleIconChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end">
          <button type="button" className="btn btn-secondary me-3" onClick={goBack}>
            {t("Annuler")}
          </button>
          <button type="submit" className="btn btn-primary">
            {t("Enregistrer")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CatCreate;
