import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { GlobalState } from "../GlobalState";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";

function CategoryList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const state = useContext(GlobalState);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]); // New state for filtered categories
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [starClickedMap, setStarClickedMap] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default number of items per page
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState({ parentCategoryId: "" });
  const [parentCategories, setParentCategories] = useState([]);
  const [confirmationInput, setConfirmationInput] = useState("");

  // Filter states
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterEtat, setFilterEtat] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1212);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8082/api/categories/getAll"
        );
        setCategories(response.data);
        setFilteredCategories(response.data); // Initialize filtered categories
        setPageCount(Math.ceil(response.data.length / itemsPerPage)); // Set total page count
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [itemsPerPage]);

  useEffect(() => {
    // Update the filtered categories whenever filters change
    const filtered = categories.filter((cat) => {
      const matchesType = filterType ? cat.type === filterType : true;
      const matchesStatus = filterStatus ? cat.status === filterStatus : true;
      const matchesEtat = filterEtat ? cat.etat === filterEtat : true;
      return matchesType && matchesStatus && matchesEtat;
    });
    setFilteredCategories(filtered);
    setPageCount(Math.ceil(filtered.length / itemsPerPage)); // Update page count
    setCurrentPage(0); // Reset to first page on filter change
  }, [filterType, filterStatus, filterEtat, categories, itemsPerPage]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Update current page
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value)); // Update items per page
    setCurrentPage(0); // Reset to first page when items per page changes
  };

  const currentItems = filteredCategories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleDeleteModal = (cat) => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      text: t(
        "Une fois supprimé(e), vous ne pourrez pas récupérer cet élément !"
      ),
      input: "text",
      inputPlaceholder: t("Entrez le nom de la catégorie pour confirmer"),
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui, supprimez-le !"),
      cancelButtonText: t("Non, annuler !"),
      preConfirm: (inputValue) => {
        if (inputValue.trim() === "") {
          Swal.showValidationMessage("Le nom ne peut pas être vide.");
        } else if (inputValue !== cat.libCategorie) {
          Swal.showValidationMessage(
            "Le nom entré ne correspond pas à la catégorie."
          );
        }
        return inputValue; // Return inputValue for further processing
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteC(cat.id); // Await the deletion function
        Swal.fire({
          text: "Supprimé(e) ! Votre élément a été supprimé.",
          icon: "success",
          confirmButtonColor: "#b0210e",
        }).then(() => {
          window.location.reload(); // Reload the page on confirmation
        });
      } else {
        Swal.fire({
          text: "Annulé, Votre élément est en sécurité :)",
          icon: "error",
          confirmButtonColor: "#b0210e",
        });
      }
    });
  };

  // Define the deleteC function
  const deleteC = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8082/api/categories/${categoryId}`);
      console.log("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Une erreur est survenue lors de la suppression de la catégorie!",
      });
    }
  };

  const handleEdit = (cat) => {
    setSelectedCategory(cat);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedCategory(null);
    setShowModal(false);
  };

  const handleModalSave = async () => {
    const formData = new FormData();
    formData.append("id", selectedCategory.id);
    formData.append("libCategorie", selectedCategory.libCategorie);
    formData.append("libCategorieAR", selectedCategory.libCategorieAR);
    formData.append("libCategorieEN", selectedCategory.libCategorieEN);
    formData.append("icon", selectedCategory.icon);
    formData.append(
      "parentCategoryNames",
      selectedCategory.parentCategoryNames
    );
    formData.append("criteresNames", selectedCategory.criteresNames);
    formData.append("criteresNamesEn", selectedCategory.criteresNamesEn);
    formData.append("criteresNamesAr", selectedCategory.criteresNamesAr);

    try {
      const response = await axios.put(
        "http://localhost:8082/api/categories/update",
        formData
      );
      // Handle successful update
      setShowModal(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // New function to handle deactivating a category
  const handleDeactivate = (cat) => {
    Swal.fire({
      title: "Désactiver la catégorie",
      text: "Veuillez entrer le nom exact de la catégorie pour la désactiver :",
      input: "text", // Input type
      inputPlaceholder: "Nom de la catégorie",
      showCancelButton: true,
      confirmButtonText: "Désactiver",
      cancelButtonText: "Annuler",
      preConfirm: (inputValue) => {
        // Validate the input against the category name
        if (inputValue.trim() === "") {
          Swal.showValidationMessage("Le nom ne peut pas être vide.");
        } else if (inputValue !== cat.libCategorie) {
          Swal.showValidationMessage(
            "Le nom entré ne correspond pas à la catégorie."
          );
        }
        return inputValue; // Return inputValue for further processing
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Proceed to deactivate the category if confirmed
        await deactivateCategory(cat.id);
      }
    });
  };

  const deactivateCategory = async (categoryId) => {
    try {
      const response = await axios.put(
        `http://localhost:8082/api/categories/desactiver/${categoryId}`
      );
      console.log(response.data);
      Swal.fire({
        text: "La catégorie a été désactivée avec succès !",
        icon: "success",
        confirmButtonColor: "#b0210e",
      }).then(() => {
        window.location.reload(); // Reload the page on confirmation
      });
    } catch (error) {
      console.error("Error deactivating category:", error);
      Swal.fire({
        text: "Une erreur s'est produite lors de la désactivation.",
        icon: "error",
        confirmButtonColor: "#b0210e",
      });
    }
  };

  // Modify the deactivate icon click handler in the renderDesktopTable and renderMobileTable functions
  // Replace the deactivate icon click with this

  const activateCategory = async (categoryId) => {
    try {
      const response = await axios.put(
        `http://localhost:8082/api/categories/Activer/${categoryId}`
      );
      console.log(response.data);
      Swal.fire({
        text: t("La catégorie a été activée avec succès !"),
        icon: "success",
        confirmButtonColor: "#b0210e",
      }).then(() => {
        window.location.reload(); // Reload the page on confirmation
      });
    } catch (error) {
      console.error("Error activating category:", error);
      Swal.fire({
        text: t("Une erreur s'est produite lors de l'activation."),
        icon: "error",
        confirmButtonColor: "#b0210e",
      });
    }
  };

  useEffect(() => {
    // Fetch parent categories from the API
    axios
      .get("http://localhost:8082/api/categories/parents")
      .then((response) => {
        setParentCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleSelectChange = (event) => {
    setData({ ...data, parentCategoryId: event.target.value });
  };

  const renderMobileTable = () => (
    <table className="table" style={{ width: "100%", textAlign: "center" }}>
      <tbody>
        {currentItems.length > 0 ? (
          currentItems.map((cat, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{t("Libellé")}</td>
                <td>{cat.libCategorie}</td>
              </tr>
              <tr>
                <td>{t("Détail")}</td>
                <td>
                  <a
                    onClick={() =>
                      navigate(`/catdetail/${cat.id}`, { state: { cat } })
                    }
                  >
                    <i className="fa-solid fa-eye"></i>
                  </a>
                </td>
              </tr>
              <tr>
                <td>{t("Modifier")}</td>
                <td>
                  <button className="btn" onClick={() => handleEdit(cat)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>{t("Supprimer")}</td>
                <td>
                  <i
                    className="fa-solid fa-trash deleteIcon"
                    onClick={() => handleDeleteModal(cat)} // Pass the entire category object
                  ></i>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <hr />
                </td>
              </tr>
            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan="2">No categories available</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const renderDesktopTable = () => (
    <table className="table">
      <thead>
        <tr>
          <th>{t("Libellé")}</th>
          <th>{t("Status")}</th>
          <th>{t("Détail")}</th>
          <th>{t("Modifier")}</th>
          <th>{t("Activer")}</th>
          <th>{t("Désactiver")}</th>
          <th>{t("Supprimer")}</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.length > 0 ? (
          currentItems.map((cat, index) => (
            <tr key={index}>
              <td className="text-bold-500">{cat.libCategorie}</td>
              <td className="text-bold-500">{cat.status}</td>
              <td>
                <a
                  onClick={() =>
                    navigate(`/catdetail/${cat.id}`, { state: { cat } })
                  }
                >
                  <i className="fa-solid fa-eye"></i>
                </a>
              </td>
              <td>
                <button className="btn" onClick={() => handleEdit(cat)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </td>
              <td>
                <i
                  className="fa-solid fa-circle-check"
                  style={{ color: "green" }}
                  onClick={() => activateCategory(cat.id)}
                ></i>
              </td>

              <td>
                <i
                  className="fa-solid fa-ban"
                  onClick={() => handleDeactivate(cat)} // Call handleDeactivate on click
                ></i>
              </td>
              <td>
                <i
                  className="fa-solid fa-trash deleteIcon"
                  onClick={() => handleDeleteModal(cat)} // Pass the entire category object
                ></i>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No categories available</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="content-container">
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3"></i>
          </a>
        </header>
        <section className="section">
          <div className="row" id="table-head">
            <div className="col-12">
              <div className="card">
                <div className="card-header" style={{display:'flex', justifyContent:'space-between'}}>
                  <h2 className="new-price">{t("Liste de catégories")}</h2>
                  <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",

                  }}
                >
                  <label htmlFor="itemsPerPage" style={{ marginRight: "10px" }}>
                    <h6>{t("Items par page:")}</h6>
                  </label>
                  <select className="itemsPerPage"
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>
                </div>
                <div className="row" style={{ padding: "0 20px" }}>
                  <div className="col-md-4 mb-4">
                    <h6>{t("Type")}</h6>
                    <fieldset className="form-group">
                      <select
                        className="form-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="">{t("Choisissez le type")}</option>
                        <option value="CATEGORYPARENTE">{t("Parente")}</option>
                        <option value="CATEGORYFILLE">{t("Fille")}</option>
                      </select>
                    </fieldset>
                  </div>
                  <div className="col-md-4 mb-4">
                    <h6>{t("Statut")}</h6>
                    <fieldset className="form-group">
                      <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="">{t("Choisissez le statut")}</option>
                        <option value="ACTIVER">{t("Activer")}</option>
                        <option value="DESACTIVER">{t("Desactiver")}</option>
                      </select>
                    </fieldset>
                  </div>
                  <div className="col-md-4 mb-4">
                    <h6>{t("Etat")}</h6>
                    <fieldset className="form-group">
                      <select
                        className="form-select"
                        value={filterEtat}
                        onChange={(e) => setFilterEtat(e.target.value)}
                      >
                        <option value="">{t("Choisissez le Etat")}</option>
                        <option value="PUBLIER">{t("Publier")}</option>
                        <option value="BROUILLON">{t("Brouillon")}</option>
                      </select>
                    </fieldset>
                  </div>
                </div>
                <div className="row" style={{ padding: "0 20px" }}>
                  <div style={{ textAlign: "center" }}>
                    {isMobile ? renderMobileTable() : renderDesktopTable()}
                  </div>
                </div>

                <ReactPaginate
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                  className="react-paginate"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Modifier la catégorie")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>{t("Libellé (FR)")}</label>
            <input
              type="text"
              className="form-control"
              value={selectedCategory ? selectedCategory.libCategorie : ""}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  libCategorie: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>{t("Libellé (AR)")}</label>
            <input
              type="text"
              className="form-control"
              value={selectedCategory ? selectedCategory.libCategorieAR : ""}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  libCategorieAR: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>{t("Libellé (EN)")}</label>
            <input
              type="text"
              className="form-control"
              value={selectedCategory ? selectedCategory.libCategorieEN : ""}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  libCategorieEN: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>{t("Icon")}</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  icon: e.target.files[0],
                })
              }
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

          <div className="form-group">
            <label>{t("Criteres (FR)")}</label>
            <input
              type="text"
              className="form-control"
              value={selectedCategory ? selectedCategory.criteresNames : ""}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  criteresNames: e.target.value.split(","),
                })
              }
            />
          </div>

          <div className="form-group">
            <label>{t("Criteres (EN)")}</label>
            <input
              type="text"
              className="form-control"
              value={selectedCategory ? selectedCategory.criteresNamesEn : ""}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  criteresNamesEn: e.target.value.split(","),
                })
              }
            />
          </div>

          <div className="form-group">
            <label>{t("Criteres (AR)")}</label>
            <input
              type="text"
              className="form-control"
              value={selectedCategory ? selectedCategory.criteresNamesAr : ""}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  criteresNamesAr: e.target.value.split(","),
                })
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            {t("Fermer")}
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            {t("Sauvegarder")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CategoryList;
