import React, { createContext, useContext, useEffect, useState } from "react";
import { GlobalState } from "../GlobalState";
import axios from "axios";
import Swal from "sweetalert2";

const CatCreate = () => {
  const [data, setData] = useState({
    libCategorie: "",
    libCategorieEN: "",
    libCategorieAR: "",
    parentCategoryId: "",
  });

  const [inputs, setInputs] = useState([
    { criteresNames: "", criteresNamesEn: "", criteresNamesAr: "" },
  ]);
  const [icon, setIcon] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const state = useContext(GlobalState);

  // Fetch parent categories on component mount
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

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setData({ ...data, parentCategoryId: selectedValue });

    // Reset criteria inputs if a category is selected
    if (selectedValue) {
      setInputs([
        { criteresNames: "", criteresNamesEn: "", criteresNamesAr: "" },
      ]);
    } else {
      setInputs([]); // Clear inputs if no category is selected
    }
  };

  const submitCat = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append the basic data
    formData.append("libCategorie", data.libCategorie);
    formData.append("libCategorieAR", data.libCategorieAR);
    formData.append("libCategorieEN", data.libCategorieEN);

    if (data.parentCategoryId) {
      // If a parent category is selected, create a child category
      formData.append("parentCategoryId", data.parentCategoryId);

      // Check if at least one criterion is filled, since it's a child category
      const isCriteriaFilled = inputs.some(
        (item) =>
          item.criteresNames || item.criteresNamesEn || item.criteresNamesAr
      );

      if (!isCriteriaFilled) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Please provide at least one criterion to create a child category.",
        });
        return;
      }

      // Append criteria inputs
      inputs.forEach((item) => {
        formData.append("criteresNames[]", item.criteresNames);
        formData.append("criteresNamesEn[]", item.criteresNamesEn);
        formData.append("criteresNamesAr[]", item.criteresNamesAr);
      });
    } else {
      // If no parent category is selected, create a parent category
      formData.append("type", "CATEGORYPARENTE"); // Assuming your API uses this to identify parent categories
    }

    // Append the icon file if it's selected
    if (icon) {
      formData.append("icon", icon);
    }

    // Debugging output
    console.log("Submitting form data:", {
      libCategorie: data.libCategorie,
      libCategorieAR: data.libCategorieAR,
      libCategorieEN: data.libCategorieEN,
      parentCategoryId: data.parentCategoryId,
      criteres: inputs,
      icon,
    });

    try {
      const res = await axios.post(
        "http://localhost:8082/api/categories/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Category created successfully!",
      });
      console.log("Response data:", res.data);
    } catch (error) {
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
      } else if (error.request) {
        console.log("Error request:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
    }
  };

  const handleIconChange = (e) => {
    setIcon(e.target.files[0]);
  };

  return (
    <div className="content-container">
      <form onSubmit={submitCat} className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="card-title">Créer une catégorie</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="basicInput">Libellé</label>
                <input
                  onChange={(e) => {
                    setData({ ...data, libCategorie: e.target.value });
                  }}
                  type="text"
                  className="form-control"
                  id="basicInput"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="libelleEng">Libellé en Anglais</label>
                <input
                  onChange={(e) => {
                    setData({ ...data, libCategorieEN: e.target.value });
                  }}
                  type="text"
                  className="form-control"
                  id="libelleEng"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="libelleArab">Libellé en Arabe</label>
                <input
                  onChange={(e) => {
                    setData({ ...data, libCategorieAR: e.target.value });
                  }}
                  type="text"
                  className="form-control"
                  id="libelleArab"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label htmlFor="category-select">Catégories</label>
                <select
                  id="category-select"
                  className="form-select"
                  value={data.parentCategoryId}
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

              {data.parentCategoryId && (
                <div>
                  {inputs.map((input, index) => (
                    <div
                      key={index}
                      className="form-group"
                      style={{ marginTop: "15px" }}
                    >
                      <label htmlFor={`criteresNames-${index}`}>
                        Critère en Français
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={input.criteresNames}
                        onChange={(e) => {
                          const newInputs = [...inputs];
                          newInputs[index].criteresNames = e.target.value;
                          setInputs(newInputs);
                        }}
                        required
                      />
                      <label htmlFor={`criteresNamesEn-${index}`}>
                        Critère en Anglais
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={input.criteresNamesEn}
                        onChange={(e) => {
                          const newInputs = [...inputs];
                          newInputs[index].criteresNamesEn = e.target.value;
                          setInputs(newInputs);
                        }}
                        required
                      />
                      <label htmlFor={`criteresNamesAr-${index}`}>
                        Critère en Arabe
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={input.criteresNamesAr}
                        onChange={(e) => {
                          const newInputs = [...inputs];
                          newInputs[index].criteresNamesAr = e.target.value;
                          setInputs(newInputs);
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="form-group" style={{ marginTop: "15px" }}>
                <label htmlFor="iconInput">Icon</label>
                <input
                  type="file"
                  className="form-control"
                  id="iconInput"
                  onChange={handleIconChange}
                />
              </div>
            </div>
          </div>
          <div
            className="d-flex justify-content-end"
            style={{ marginTop: "20px" }}
          >
            <button type="submit" className="btn btn-primary">
              Créer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CatCreate;
