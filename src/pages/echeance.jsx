import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Echeance() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // State to hold selected row data
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1212);
    };

    window.addEventListener("resize", handleResize);

    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to handle the click on the modify icon
  const handleModifyClick = (rowData) => {
    setSelectedRow(rowData);
    setShowModal(true);
    document.body.classList.add("modal-open"); // Add class to blur or darken background
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRow(null);
    document.body.classList.remove("modal-open"); // Remove class when modal is closed
  };

  return (
    <div className="content-container">
      <div id="main" className={showModal ? "blur-background" : ""}>
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3"></i>
          </a>
        </header>
        <section className="section">
          <div className="row" id="table-contexual">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h2 className="new-price">{t("Liste echéance")}</h2>
                </div>
                <div className="card-content">
                  <div className="table-responsive">
                    {isMobile ? (
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>{t("Date paiement")}</td>
                            <td>Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Montant à payer")}</td>
                            <td>Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Montant restant")}</td>
                            <td>Lorem Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Montant à payer chaque mois")}</td>
                            <td>Lorem Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Modifier")}</td>
                            <td>
                              <i
                                className="fa-solid fa-pen-to-square"
                                onClick={() =>
                                  handleModifyClick({
                                    date: "Lorem",
                                    montantAPayer: "Lorem",
                                    montantRestant: "Lorem Lorem",
                                    montantChaqueMois: "Lorem Lorem",
                                  })
                                }
                              ></i>
                            </td>
                          </tr>
                          <td colSpan="2">
                            <hr />
                          </td>
                        </tbody>
                      </table>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>{t("Date paiement")}</th>
                            <th>{t("Montant à payer")}</th>
                            <th>{t("Montant restant")}</th>
                            <th>{t("Montant à payer chaque mois")}</th>
                            <th>{t("Modifier")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Lorem</td>
                            <td> Lorem Lorem </td>
                            <td className="text-bold-500">
                              {t("Lorem Lorem")}
                            </td>
                            <td>Lorem Lorem</td>
                            <td>
                              <i
                                className="fa-solid fa-pen-to-square"
                                onClick={() =>
                                  handleModifyClick({
                                    date: "Lorem",
                                    montantAPayer: "Lorem",
                                    montantRestant: "Lorem Lorem",
                                    montantChaqueMois: "Lorem Lorem",
                                  })
                                }
                              ></i>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bootstrap Modal */}
        {selectedRow && (
          <div
            className={`modal fade ${showModal ? "show" : ""}`}
            tabIndex="-1"
            style={{ display: showModal ? "block" : "none" }}
            aria-modal={showModal ? "true" : "false"}
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t("Modifier Echéance")}</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={handleCloseModal}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label>{t("Date payement")}</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={selectedRow.date}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("Montant à payer")}</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={selectedRow.montantAPayer}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("Montant restant")}</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={selectedRow.montantRestant}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t("Montant à payer chaque mois")}</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={selectedRow.montantChaqueMois}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    {t("Fermer")}
                  </button>
                  <button type="button" className="btn btn-primary"> 
                    {t("Enregistrer les modifications")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Blur or Dark Overlay */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default Echeance;
