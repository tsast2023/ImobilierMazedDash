import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import ReactPaginate from "react-paginate";

function Echeance() {
  const { t } = useTranslation();
  const state = useContext(GlobalState);
  
  // Sample data to represent echeance
  const echeance = [
    { date: "2024-11-01", montantAPayer: 100, montantRestant: 50, montantChaqueMois: 25 },
    { date: "2024-11-02", montantAPayer: 200, montantRestant: 150, montantChaqueMois: 50 },
    { date: "2024-11-03", montantAPayer: 300, montantRestant: 250, montantChaqueMois: 75 },
    { date: "2024-11-04", montantAPayer: 400, montantRestant: 350, montantChaqueMois: 100 },
    { date: "2024-11-05", montantAPayer: 500, montantRestant: 450, montantChaqueMois: 125 },
    { date: "2024-11-06", montantAPayer: 600, montantRestant: 550, montantChaqueMois: 150 },
    { date: "2024-11-07", montantAPayer: 700, montantRestant: 650, montantChaqueMois: 175 },
    { date: "2024-11-08", montantAPayer: 800, montantRestant: 750, montantChaqueMois: 200 },
    { date: "2024-11-09", montantAPayer: 900, montantRestant: 850, montantChaqueMois: 225 },
    { date: "2024-11-10", montantAPayer: 1000, montantRestant: 950, montantChaqueMois: 250 }
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // State to hold selected row data
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default number of items per page
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(Math.ceil(echeance.length / itemsPerPage));

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
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate pageCount whenever itemsPerPage or echeance changes
  useEffect(() => {
    setPageCount(Math.ceil(echeance.length / itemsPerPage));
  }, [itemsPerPage, echeance]);

  // Function to handle the click on the modify icon
  const handleModifyClick = (rowData) => {
    setSelectedRow(rowData);
    setShowModal(true);
    document.body.classList.add("modal-open");
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRow(null);
    document.body.classList.remove("modal-open"); 
  };

  // Calculate the items to display on the current page
  const startIndex = currentPage * itemsPerPage;
  const currentItems = echeance.slice(startIndex, startIndex + itemsPerPage);

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
                <div
                  className="card-header"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h2 className="new-price">{t("Liste echéance")}</h2>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <label
                      htmlFor="itemsPerPage"
                      style={{ marginRight: "10px" }}
                    >
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
                    {isMobile ? (
                      <table className="table">
                        <tbody>
                          {currentItems.map((item, index) => (
                            <tr key={index}>
                              <td>{item.date}</td>
                              <td>{item.montantAPayer}</td>
                              <td>{item.montantRestant}</td>
                              <td>{item.montantChaqueMois}</td>
                              <td>
                                <i
                                  className="fa-solid fa-pen-to-square"
                                  onClick={() => handleModifyClick(item)}
                                ></i>
                              </td>
                            </tr>
                          ))}
                          <td colSpan="5">
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
                          {currentItems.map((item, index) => (
                            <tr key={index}>
                              <td>{item.date}</td>
                              <td>{item.montantAPayer}</td>
                              <td className="text-bold-500">{item.montantRestant}</td>
                              <td>{item.montantChaqueMois}</td>
                              <td>
                                <i
                                  className="fa-solid fa-pen-to-square"
                                  onClick={() => handleModifyClick(item)}
                                ></i>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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
                      <label>{t("Date paiement")}</label>
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
                    {t("Enregistrer")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default Echeance;
