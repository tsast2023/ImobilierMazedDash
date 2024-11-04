import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import ReactPaginate from "react-paginate";

function Reclamation() {
  const { t } = useTranslation();
  const state = useContext(GlobalState);

  // Sample data based on your provided structure
  const reclamations = [
    {
      date: "10/10/2024",
      utilisateur: t("Lorem Lorem"),
      sujet: t("Lorem Lorem"),
      statut: "Ouverte",
      id: 1, // Added an ID for tracking purposes
    },
    {
      date: "10/10/2024",
      utilisateur: t("Lorem Lorem"),
      sujet: t("Lorem Lorem"),
      statut: "Fermée",
      id: 2, // Added an ID for tracking purposes
    },
    {
      date: "10/10/2024",
      utilisateur: t("Lorem Lorem"),
      sujet: t("Lorem Lorem"),
      statut: "Fermée",
      id: 2, // Added an ID for tracking purposes
    },
    // Y
    {
      date: "10/10/2024",
      utilisateur: t("Lorem Lorem"),
      sujet: t("Lorem Lorem"),
      statut: "Fermée",
      id: 2, // Added an ID for tracking purposes
    },
    // Y
    {
      date: "10/10/2024",
      utilisateur: t("Lorem Lorem"),
      sujet: t("Lorem Lorem"),
      statut: "Fermée",
      id: 2, // Added an ID for tracking purposes
    },
    // Y
    
    // You can add more entries here as needed
  ];

  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(Math.ceil(reclamations.length / itemsPerPage));
  const [response, setResponse] = useState(""); // State for textarea input

  useEffect(() => {
    setPageCount(Math.ceil(reclamations.length / itemsPerPage));
  }, [itemsPerPage, reclamations]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const startIndex = currentPage * itemsPerPage;
  const displayedReclamations = reclamations.slice(startIndex, startIndex + itemsPerPage);

  const handleModalOpen = (rec) => {
    setSelectedReclamation(rec);
    setResponse(""); // Clear previous response
    if (rec.statut === "Ouverte") {
      setShowModal1(true);
    } else {
      setShowModal2(true);
    }
  };

  return (
    <div className="content-container">
      <div id="main" className={showModal1 || showModal2 ? "blur-background" : ""}>
        <section className="section">
          <div className="row" id="table-context">
            <div className="col-12">
              <div className="card">
                <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                  <h2 className="new-price">{t("Liste Reclamation")}</h2>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                <div className="card-content">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>{t("Date")}</th>
                          <th>{t("Utilisateur")}</th>
                          <th>{t("Sujet")}</th>
                          <th>{t("Statut")}</th>
                          <th>{t("Détail")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedReclamations.map((rec, index) => (
                          <tr key={index}>
                            <td className="text-bold-500">{rec.date}</td>
                            <td>{rec.utilisateur}</td>
                            <td className="text-bold-500">{rec.sujet}</td>
                            <td>
                              <span className={`badge ${rec.statut === "Ouverte" ? "bg-secondary" : "bg-danger"}`}>
                                {t(rec.statut)}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-outline block"
                                onClick={() => handleModalOpen(rec)}
                              >
                                <i className="fa-solid fa-eye font-medium-1"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

        {/* Modal for the first type of reclamation */}
        {showModal1 && (
          <div
            className={`modal fade ${showModal1 ? "show" : ""}`}
            style={{ display: showModal1 ? "block" : "none" }}
            aria-modal={showModal1 ? "true" : "false"}
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("Détails de la Réclamation Ouverte")}</h5>
                  <button type="button" className="close" onClick={() => setShowModal1(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>{t("Détails supplémentaires pour la réclamation ouverte.")}</p>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder={t("Répondre à cette réclamation...")}
                    rows={4}
                    className="form-control"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal1(false)}>
                    {t("Fermer")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      // Handle response submission
                      console.log(`Response to reclamation ${selectedReclamation?.id}: ${response}`);
                      setShowModal1(false);
                    }}
                  >
                    {t("Envoyer")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for the second type of reclamation */}
        {showModal2 && (
          <div
            className={`modal fade ${showModal2 ? "show" : ""}`}
            style={{ display: showModal2 ? "block" : "none" }}
            aria-modal={showModal2 ? "true" : "false"}
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("Détails de la Réclamation Fermée")}</h5>
                  <button type="button" className="close" onClick={() => setShowModal2(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>{t("Détails supplémentaires pour la réclamation fermée.")}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal2(false)}>
                    {t("Fermer")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {(showModal1 || showModal2) && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default Reclamation;
