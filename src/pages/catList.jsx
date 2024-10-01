import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  const handleDeleteModal = (catId) => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      text: t(
        "Une fois supprimé(e), vous ne pourrez pas récupérer cet élément !"
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui, supprimez-le !"),
      cancelButtonText: t("Non, annuler !"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteC(catId);
        Swal.fire({
          text: "Supprimé(e) ! Votre élément a été supprimé.",
          icon: "success",
          confirmButtonColor: "#b0210e",
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

  const deleteC = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8082/api/categories/delete/${id}`
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
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

  const handleModalSave = () => {
    // Implement save logic for edited category
    setShowModal(false);
  };

  // New function to handle deactivating a category
  const deactivateCategory = async (categoryId) => {
    try {
      const response = await axios.put(
        `http://localhost:8082/api/categories/desactiver/${categoryId}`
      );
      console.log(response.data);
      Swal.fire({
        text: t("La catégorie a été désactivée avec succès !"),
        icon: "success",
        confirmButtonColor: "#b0210e",
      });
    } catch (error) {
      console.error("Error deactivating category:", error);
      Swal.fire({
        text: t("Une erreur s'est produite lors de la désactivation."),
        icon: "error",
        confirmButtonColor: "#b0210e",
      });
    }
  };

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
      });
    } catch (error) {
      console.error("Error activating category:", error);
      Swal.fire({
        text: t("Une erreur s'est produite lors de l' activation."),
        icon: "error",
        confirmButtonColor: "#b0210e",
      });
    }
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
                    onClick={() => handleDeleteModal(cat.id)}
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
                <button
                  onClick={() => activateCategory(cat.id)}
                  className="btn"
                >
                  <i className="fa-solid fa-check"></i>
                </button>
              </td>
              <td>
                <button
                  onClick={() => deactivateCategory(cat.id)}
                  className="btn"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </td>
              <td>
                <i
                  className="fa-solid fa-trash deleteIcon"
                  onClick={() => handleDeleteModal(cat.id)}
                ></i>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">No categories available</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="content-container">
      <h1 className="text-center">{t("Liste des Catégories")}</h1>
      <div className="form-group">
        <label htmlFor="itemsPerPage">{t("Items par page:")}</label>
        <select
          className="form-select"
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
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

      {isMobile ? renderMobileTable() : renderDesktopTable()}

      <ReactPaginate
        previousLabel={"⏮"}
        nextLabel={"⏭"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Modifier Catégorie")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your modal body contents here */}
          <p>{t("Modifier les détails de la catégorie :")}</p>
          <p>{selectedCategory ? selectedCategory.libCategorie : ""}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            {t("Annuler")}
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
