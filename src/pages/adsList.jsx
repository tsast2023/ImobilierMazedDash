import React, { useContext, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import ReactPaginate from "react-paginate";
import { GlobalState } from "../GlobalState";

function AdsList() {
  const state = useContext(GlobalState);
  const { t } = useTranslation();
  const [adsList, setAdsList] = useState([]); // State to hold the fetched ads
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
  const [isMobile, setIsMobile] = useState(false);
  const [editType, setEditType] = useState("");
  const [uploadInputs, setUploadInputs] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default number of items per page
  const [currentPage, setCurrentPage] = useState(0);
  const ads = state.ads || []; // Default to an empty array if state.ads is undefined

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Update current page
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value)); // Update items per page
    setCurrentPage(0); // Reset to first page when items per page changes
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1212);
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch the ads from the API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8082/api/annonce/getAll"
        );
        setAdsList(response.data); // Set the fetched ads list in state
      } catch (error) {
        console.error("Error fetching the ads:", error);
        // Optionally show a notification or error message here
      }
    };

    fetchAds(); // Call the function to fetch ads
  }, []);

  const handleDelete = (id) => {
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
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(id); // Pass the ID of the item to delete
        Swal.fire({
          title: "Supprimé",
          text: "Votre élément a été supprimé :)",
          icon: "success",
          confirmButtonColor: "#b0210e",
        });
      } else {
        Swal.fire({
          title: "Annulé",
          text: "Votre élément est en sécurité :)",
          icon: "error",
          confirmButtonColor: "#b0210e",
        });
      }
    });
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8082/api/annonce/delete/${id}`);
      setAdsList(adsList.filter((ad) => ad.id !== id)); // Remove the deleted ad from the list
    } catch (error) {
      console.error("Error deleting the ad:", error);
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditType(""); // Reset edit type
    setUploadInputs([]); // Clear upload inputs
  };

  const handleEditTypeChange = (event) => {
    const selectedType = event.target.value;
    setEditType(selectedType);
    setUploadInputs([]);
  };

  const handleAddUploadInput = () => {
    setUploadInputs([...uploadInputs, uploadInputs.length + 1]);
  };

  const handleRemoveUploadInput = (index) => {
    const updatedInputs = uploadInputs.filter((_, i) => i !== index);
    setUploadInputs(updatedInputs);
  };

  const handleEditSave = () => {
    // Handle save edit logic
    closeEditModal(); // Example: Close modal after save
  };

  return (
    <div className="content-container">
      <section className="section">
        <div className="card">
          <div
            className="card-header"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <h2 className="new-price">{t("Liste des annonces")}</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <label htmlFor="itemsPerPage" style={{ marginRight: "10px" }}>
                <h6>{t("Items par page:")}</h6>
              </label>
              <select
                className="itemsPerPage"
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
          <div className="card-body">
            {adsList.length > 0 && (
              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={Math.ceil(adsList.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
                className="react-paginate"
              />
            )}
            <div className="table-responsive">
              {isMobile ? (
                <table className="table" id="table1">
                  <tbody>
                    {adsList.map((ad) => (
                      <React.Fragment key={ad.id}>
                        <tr>
                          <td>{t("Date de création")}</td>
                          <td>{ad.creationDate}</td>
                        </tr>
                        <tr>
                          <td>{t("Date de publication")}</td>
                          <td>{ad.publicationDate}</td>
                        </tr>
                        <tr>
                          <td>{t("Type")}</td>
                          <td>{t(ad.type)}</td>
                        </tr>
                        <tr>
                          <td>{t("Voir")}</td>
                          <td>
                            <Button
                              className="btn"
                              onClick={() => setShowImageModal(true)}
                            >
                              <i className="fa-solid fa-eye"></i>
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Nombre des j'aimes")}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>{t("Nombre des dislikes")}</td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>{t("Editer")}</td>
                          <td>
                            <Button className="btn" onClick={openEditModal}>
                              <i className="fa-solid fa-pen-to-square"></i>
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Supprimer")}</td>
                          <td>
                            <i
                              className="fa-solid fa-trash deleteIcon"
                              onClick={() => handleDelete(ad.id)}
                            ></i>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2">
                            <hr />
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="table" id="table1">
                  <thead>
                    <tr>
                      <th>{t("Date de création")}</th>
                      <th>{t("Date de publication")}</th>
                      <th>{t("Type")}</th>
                      <th>{t("Voir")}</th>
                      <th>{t("Nombre des j'aimes")}</th>
                      <th>{t("Nombre des dislike")}</th>
                      <th>{t("Editer")}</th>
                      <th>{t("Supprimer")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adsList.map((ad) => (
                      <tr key={ad.id}>
                        <td>{ad.creationDate}</td>
                        <td>{ad.publicationDate}</td>
                        <td>{t(ad.type)}</td>
                        <td>
                          <Button
                            className="btn"
                            onClick={() => setShowImageModal(true)}
                          >
                            <i className="fa-solid fa-eye"></i>
                          </Button>
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                          <Button className="btn" onClick={openEditModal}>
                            <i className="fa-solid fa-pen-to-square"></i>
                          </Button>
                        </td>
                        <td>
                          <i
                            className="fa-solid fa-trash deleteIcon"
                            onClick={() => handleDelete(ad.id)}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Add pagination controls */}
            {adsList.length > 0 && (
              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={Math.ceil(adsList.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
                className="react-paginate"
              />
            )}
          </div>
        </div>
      </section>

      {/* Modal for editing */}
      <Modal show={showEditModal} onHide={closeEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Edit Type:</label>
          <select value={editType} onChange={handleEditTypeChange}>
            <option value="">Select Type</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="carousel">Carousel</option>
          </select>
          {uploadInputs.map((input, index) => (
            <div key={index} style={{ display: "flex", marginBottom: "10px" }}>
              <input type="file" />
              <button onClick={() => handleRemoveUploadInput(index)}>
                Remove
              </button>
            </div>
          ))}
          <button onClick={handleAddUploadInput}>Add Input</button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdsList;
