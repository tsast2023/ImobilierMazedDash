import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests

function AdsList() {
  const { t } = useTranslation();
  const [adsList, setAdsList] = useState([]); // State to hold the fetched ads
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
  const [isMobile, setIsMobile] = useState(false);
  const [editType, setEditType] = useState('');
  const [uploadInputs, setUploadInputs] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default number of items per page
  const [currentPage, setCurrentPage] = useState(0);

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
        const response = await axios.get('http://localhost:8082/api/annonce/getAll');
        setAdsList(response.data); // Set the fetched ads list in state
      } catch (error) {
        console.error('Error fetching the ads:', error);
        // Optionally show a notification or error message here
      }
    };

    fetchAds(); // Call the function to fetch ads
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      text: t("Une fois supprimé(e), vous ne pourrez pas récupérer cet élément !"),
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
      console.error('Error deleting the ad:', error);
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditType(''); // Reset edit type
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
          <div className="card-header">
            <h2 className="new-price">{t("Liste des annonces")}</h2>
          </div>
          <div className="card-body">
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
                            <Button className="btn" onClick={() => setShowImageModal(true)}>
                              <i className="fa-solid fa-eye"></i>
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Nombre des j'aimes")}</td>
                          <td>
                            
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Voir")}</td>
                          <td>

                          </td>
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
                            <i className="fa-solid fa-trash deleteIcon" onClick={() => handleDelete(ad.id)}></i>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2"><hr /></td>
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
                          <Button className="btn" onClick={() => setShowImageModal(true)}>
                            <i className="fa-solid fa-eye"></i>
                          </Button>
                        </td>
                        <td>
                          <Button className="btn" onClick={openEditModal}>
                            <i className="fa-solid fa-pen-to-square"></i>
                          </Button>
                        </td>
                        <td>
                          <i className="fa-solid fa-trash deleteIcon" onClick={() => handleDelete(ad.id)}></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={closeEditModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{t("Modification d’une annonce")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mb-3">
              <label htmlFor="edit-type">{t("Type de l'annonce")}</label>
              <select
                className="form-control"
                id="edit-type"
                onChange={handleEditTypeChange}
                value={editType}
              >
                <option value="">{t("Sélectionner le type d'annonce")}</option>
                <option value="image">{t("Image")}</option>
                <option value="video">{t("Vidéo")}</option>
                <option value="carousel">{t("Carousel")}</option>
              </select>
            </div>
            {editType && (
              <div className="form-group mb-3">
                <label>{t("Ajouter un fichier")}</label>
                <Button variant="secondary" onClick={handleAddUploadInput}>{t("Ajouter")}</Button>
                {uploadInputs.map((_, index) => (
                  <div key={index} className="mt-2">
                    <div className="custom-file">
                      <input type="file" className="custom-file-input" />
                      <label className="custom-file-label" htmlFor="customFile">
                        {t("Choisir un fichier")}
                      </label>
                      <Button
                        variant="link"
                        className="ml-2"
                        onClick={() => handleRemoveUploadInput(index)}
                      >
                        {t("Supprimer")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEditModal}>
              {t("Annuler")}
            </Button>
            <Button variant="primary" onClick={handleEditSave}>
              {t("Enregistrer")}
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </div>
  );
}

export default AdsList;
