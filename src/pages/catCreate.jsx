import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { GlobalState } from "../GlobalState";

const CatCreate = () => {
  const [data, setData] = useState({
    libCategorie: "",
    libCategorieEN: "",
    libCategorieAR: "",
    parentCategoryId: "",
  });

  const [inputs, setInputs] = useState([{ criteresNames: "", criteresNamesEn: "", criteresNamesAr: "" }]);
  const [icon, setIcon] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const state = useContext(GlobalState);

  // Fetch parent categories on component mount
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

  // Handle parent category selection
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setData({ ...data, parentCategoryId: selectedValue });
  };

  const submitCat = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(data);
    // Append basic category data
    formData.append("libCategorie", data.libCategorie);
    formData.append("libCategorieAR", data.libCategorieAR);
    formData.append("libCategorieEN", data.libCategorieEN);

    // If a parent category is selected, it’s a child category
    if (data.parentCategoryId && data.parentCategoryId !== "") {
      formData.append("parentCategoryNames", data.parentCategoryId);
      formData.append("type", "CATEGORYFILLE"); // Child category

      // Append criteria inputs for child category
      inputs.forEach((item, index) => {
        formData.append(`criteresNames[${index}]`, item.criteresNames);
        formData.append(`criteresNamesEn[${index}]`, item.criteresNamesEn);
        formData.append(`criteresNamesAr[${index}]`, item.criteresNamesAr);
      });
    } else {
      formData.append("type", "CATEGORYPARENTE"); // Parent category
    }
    // Append icon file if selected
    if (icon) {
      formData.append("icon", icon);
    }

    try {
      const res = await axios.post("http://localhost:8082/api/categories/create", formData, {
        headers: {
        "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data)
      // Success alert
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Category created successfully!",
      });
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

  // Handle icon change
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
                  onChange={(e) => setData({ ...data, libCategorie: e.target.value })}
                  type="text"
                  className="form-control"
                  id="basicInput"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="libelleEng">Libellé en Anglais</label>
                <input
                  onChange={(e) => setData({ ...data, libCategorieEN: e.target.value })}
                  type="text"
                  className="form-control"
                  id="libelleEng"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="libelleArab">Libellé en Arabe</label>
                <input
                  onChange={(e) => setData({ ...data, libCategorieAR: e.target.value })}
                  type="text"
                  className="form-control"
                  id="libelleArab"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label htmlFor="category-select">Parent Catégorie</label>
                <select
                  id="category-select"
                  className="form-select"
                  value={data.parentCategoryId}
                  onChange={handleSelectChange}
                >
                  <option value="">Select a parent category</option>
                  {parentCategories.length > 0 ? (
                    parentCategories.map((item) => (
                      <option key={item.id} value={item.libCategorie}>
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
                  <h5>Criteria for Child Category</h5>
                  {inputs.map((input, index) => (
                    <div key={index} className="form-group" style={{ marginTop: "15px" }}>
                      <label htmlFor={`criteresNames-${index}`}>Critère en Français</label>
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
                      <label htmlFor={`criteresNamesEn-${index}`}>Critère en Anglais</label>
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
                      <label htmlFor={`criteresNamesAr-${index}`}>Critère en Arabe</label>
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
        </div>
        <div className="card-footer">
          <button type="submit" className="btn btn-primary">
            Create Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default CatCreate;
