import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import axios from "axios";
import Cookies from "js-cookie"
import ReactPaginate from 'react-paginate';

function DemandeAds() {
  const token = Cookies.get('token')
  const { t, i18n } = useTranslation();
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
  const [isMobile, setIsMobile] = useState(false);
  const [editType, setEditType] = useState("");
  const [selectedItem, setselectedItem] = useState("");
  const [uploadInputs, setUploadInputs] = useState([]);
  const state = useContext(GlobalState);
  const annonces = state.Annonces?.content;
  const {
    pseudoAds,
    setpseudoAds,
    numTelAds,
    setnumTelAds,
    actionAnnonceAds,
    setactionAnnonceAds,
    pageAds,
    setpageAds
  } = useContext(GlobalState)
  const filteredAnnonces = annonces?.filter(annonce => annonce.statusDemande === "EN_ATTENTE");
  const showDetail = (item) =>{
    console.log(item)
    setShowImageModal(true)
    setselectedItem(item)
   }
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
  const handlePageChange = (selectedPage) => {
    setpageAds(selectedPage.selected);
    console.log(pageAds) // React Paginate is 0-indexed, so we add 1
  };
  const handleTraiterAccept = (id , status) => {
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
    }).then(async(result) => {
      if (result.isConfirmed) {
        await traiterAnnonce(id , status);
        Swal.fire({
          title: "Supprimer",
          text: "Votre élément est Supprimer:)",
          icon: "Succes",
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

  const traiterAnnonce = async (id , status) => {
    try {
      const res = await axios.post(`http://localhost:8081/api/annonce/traiter?id=${id}&statusDemande=${status}` , {} , {headers : {Authorization: `Bearer ${token}`} } );
      console.log(res.data);
    } catch (error) {
      console.log(error);
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

  const handleTraiter = (id , status) => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non, annuler !"),
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (status === "APPROUVER") {
          await traiterAnnonce(id , status);
          Swal.fire({
            title: "Valider",
            text: "Votre élément est validé :)",
            icon: "success",
            confirmButtonColor: "#8c111b",
          });
        } else {
          await traiterAnnonce(id , status);
          Swal.fire({
            title: "Refuser",
            text: "Votre élément est refusé :)",
            icon: "error",
            confirmButtonColor: "#8c111b",
          });
        }
      } else {
        Swal.fire({
          title: "Annulé",
          text: "Votre élément est en sécurité :)",
          icon: "error",
          confirmButtonColor: "#8c111b",
        });
      }
    });
  };

  return (
    <div className="content-container">
      <section className="section">
        <div className="card">
          <div className="card-header">
            <h2 className="new-price">{t("Liste des annonce")}</h2>
          </div>
          <div className="card-body">
            <div className="table-responsive">
            <div className="row ">
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="recherche">
                      <h6>{t("Numéro de téléphone")}</h6>
                    </label>
                    <input required value={numTelAds} onChange={e=>setnumTelAds(e.target.value)} id="recherche" className="form-control" />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="recherche">
                      <h6>{t("Pseudo")}</h6>
                    </label>
                    <input required value={pseudoAds} onChange={e=>setpseudoAds(e.target.value)} id="recherche" className="form-control" />
                  </div>
                </div>
                <div className="col-6 form-group">
                  <h6>{t("Action")}</h6>
                  <select value={actionAnnonceAds} onChange={e=>setactionAnnonceAds(e.target.value)} className="choices form-select">
                  <option value="" selected></option>
                    <option value="Modification">{t("Modification")}</option>
                    <option value="Création">{t("Création")}</option>
                  </select>
                </div>
                <div className="col-6 form-group">
                  <h6>{t("Statut")}</h6>
                  <select className="choices form-select">
                  <option value="" disabled selected></option>
                    <option value="square">{t("Approuver")}</option>
                    <option value="rectangle">{t("En attente")}</option>
                    <option value="rectangle">{t("Refuser")}</option>
                  </select>
                </div>
                <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={3} // Total number of pages
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
        className="react-paginate"
      />
              </div>
              {isMobile ? (
                <table className="table" id="table1">
                  <tbody>
                  {filteredAnnonces &&
                      filteredAnnonces.map((item) => (
                        <>
                   
                    <tr>
                    <th>{t("Nom")}</th>
                    <td>{item.user.nomFamille}</td>
                    </tr>
                    <tr>
                    <th>{t("Prénom")}</th>
                    <td>{item.user.prenom}</td>
                    </tr>
                    <tr>
                    <th>{t("Pseudo")}</th>
                    <td>{item.user.pseudo}</td>
                    </tr>
                    <tr>
                    <th>{t("Numéro de téléphone")}</th>
                    <td>{item.user.numTel}</td>
                    </tr>
                    <tr>
                    <th>{t("Type")}</th>
                    <td>{item.type}</td>
                    </tr>
                    <tr>
                    <th>{t("Action")}</th>
                    <td>{item.actionAnnonce}</td>
                    </tr>
                    <tr>
                      <td>{t("Voir")}</td>
                      <td>
                        <Button
                          className="btn"
                          onClick={() => showDetail(item)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </Button>
                      </td>
                    </tr>
                  
                  <tr>
                    <td>{t("Valider")}</td>
                    <td>
                      <i
                        className="fa-solid fa-circle-check text-success"
                        onClick={() => handleTraiter(item.id , "APPROUVER")}
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("Refuser")}</td>
                    <td>
                      <i
                        className="fa-solid fa-circle-xmark text-danger"
                        onClick={() => handleTraiter(item.id ,"REFUSER")}
                      ></i>
                    </td>
                  </tr>
                    <tr>
                      <td colSpan="2">
                        <hr />
                      </td>
                    </tr>
                    </>
                  ))}
                  </tbody>
                </table>
              ) : (
                <table className="table" id="table1">
                  <thead>
                    <tr>
                      
                      <th>{t("Nom")}</th>
                      <th>{t("Prénom")}</th>
                      <th>{t("Pseudo")}</th>
                      <th>{t("Numéro de téléphone")}</th>
                      <th>{t("Type")}</th>
                      <th>{t("Action")}</th>
                      <th>{t("Voir")}</th>
                      <th>{t("Accepter")}</th>
                      <th>{t("Refuser")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAnnonces &&
                      filteredAnnonces.map((item) => (
                        <tr>
                         
                          <td>{item.user.nomFamille}</td>
                          <td>{item.user.prenom}</td>
                          <td>{item.user.pseudo}</td>
                          <td>{item.user.numTel}</td>
                          <td>{item.type}</td>
                          <td>{item.actionAnnonce}</td>
                          <td>
                            <Button
                              className="btn"
                              onClick={() => showDetail(item)}
                            >
                              <i className="fa-solid fa-eye"></i>
                            </Button>
                          </td>
                          <td>
                      <i
                        className="fa-solid fa-circle-check text-success"
                        onClick={() =>handleTraiter(item.id , "APPROUVER")}
                      ></i>
                    </td>
                    <td>
                      <i
                        className="fa-solid fa-circle-xmark text-danger"
                        onClick={() =>  handleTraiter(item.id ,"REFUSER")}
                      ></i>
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
                <Button variant="secondary" onClick={handleAddUploadInput}>
                  {t("Ajouter")}
                </Button>
                {uploadInputs.map((_, index) => (
                  <div key={index} className="mt-2">
                    <div className="custom-file">
                      <input required type="file" className="custom-file-input" />
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

      {/* Other Modals (Image, Video, Carousel) */}
      <Modal
          show={showImageModal}
          onHide={() => setShowImageModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("Image")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Image content */}
            {selectedItem ? (
    selectedItem.type === "image" ? (
        <img
            src={selectedItem.contenu}
            className="img-fluid"
            alt={t("Image")}
        />
    ) : (
        <video
            controls
            className="img-fluid" // You can adjust these styles as necessary
            alt={t("Video")}
            src={selectedItem.contenu} // Replace with your video source
        >
            Your browser does not support the video tag.
        </video>
    )
) : null}
           
            <div className="mt-3">
              <label>{t("Date de création")}</label>
              <input
                type="text"
                className="form-control"
                value={selectedItem.createdAt?.split("T")[0]}
                disabled
              />
            </div>
            <div className="mt-3">
              <label>{t("Date de publication")}</label>
              <input
                type="text"
                className="form-control"
                value={selectedItem.datePublication?.split("T")[0]}
                disabled
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowImageModal(false)}
            >
              {t("Fermer")}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showVideoModal}
          onHide={() => setShowVideoModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("Video")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Video content */}
            <video className="img-fluid" autoPlay controls>
              <source
                src="/assets/compiled/video/exemple.mp4"
                type="video/mp4"
              />
              {t("Your browser does not support the video tag.")}
            </video>
            <div className="mt-3">
              <label>{t("Date de création")}</label>
              <input
                type="text"
                className="form-control"
                value="02/02/2024"
                disabled
              />
            </div>
            <div className="mt-3">
              <label>{t("Date de publication")}</label>
              <input
                type="text"
                className="form-control"
                value="07/07/2024"
                disabled
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowVideoModal(false)}
            >
              {t("Fermer")}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showCarouselModal}
          onHide={() => setShowCarouselModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("Carousel")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Carousel content */}
            <div
              id="carouselExampleIndicators"
              className="carousel slide"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="/assets/compiled/jpg/architecture1.jpg"
                    className="d-block w-100"
                    alt={t("Carousel")}
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="/assets/compiled/jpg/architecture2.jpg"
                    className="d-block w-100"
                    alt={t("Carousel")}
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="/assets/compiled/jpg/architecture3.jpg"
                    className="d-block w-100"
                    alt={t("Carousel")}
                  />
                </div>
              </div>
              <a
                className="carousel-control-prev"
                href="#carouselExampleIndicators"
                role="button"
                data-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#carouselExampleIndicators"
                role="button"
                data-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
            <div className="mt-3">
              <label>{t("Date de création")}</label>
              <input
                type="text"
                className="form-control"
                value="03/01/2024"
                disabled
              />
            </div>
            <div className="mt-3">
              <label>{t("Date de publication")}</label>
              <input
                type="text"
                className="form-control"
                value="07/05/2024"
                disabled
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCarouselModal(false)}
            >
              {t("Fermer")}
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </div>
  );
}

export default DemandeAds;

