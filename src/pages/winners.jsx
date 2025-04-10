import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";

function Winners() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [additionalTables, setAdditionalTables] = useState([]);
  const [newTableData, setNewTableData] = useState({
    date: "",
    montantPayer: "",
    montantRestant: "",
    montantChaqueMois: "",
  });
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default number of items per page
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  
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

  const handleAddTable = () => {
    setAdditionalTables([
      ...additionalTables,
      {
        id: additionalTables.length + 1,
        data: [
          { label: t("Date de paiement"), value: newTableData.date },
          { label: t("Montant à payer"), value: newTableData.montantPayer },
          { label: t("Montant restant"), value: newTableData.montantRestant },
          {
            label: t("Montant à payer chaque mois"),
            value: newTableData.montantChaqueMois,
          },
        ],
      },
    ]);
    setShowModal(false);
    setNewTableData({
      date: "",
      montantPayer: "",
      montantRestant: "",
      montantChaqueMois: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTableData({ ...newTableData, [name]: value });
  };

  const renderTable = (tableData) => (
    <table className="table">
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            <td>{row.label}</td>
            <td>{row.value}</td>
          </tr>
        ))}
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
          <div className="row" id="table-contexual">
            <div className="col-12">
              <div className="card">
                <div
                  className="card-header"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h2 className="new-price">{t("Liste des gagnants")}</h2>
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
                          <tr></tr>
                          <tr>
                            <td>{t("User")}</td>
                            <td>
                              <img
                                style={{ borderRadius: "50px" }}
                                className="imgtable"
                                src="./Mazed.jpg"
                                alt="img"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>{t("Nom")}</td>
                            <td>Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Prénom")}</td>
                            <td>{t("Lorem Lorem")}</td>
                          </tr>
                          <tr>
                            <td>{t("Pseudo")}</td>
                            <td>{t("Lorem Lorem")}</td>
                          </tr>
                          <tr>
                            <td>{t("Email")}</td>
                            <td>Lorem@Lorem.Lorem</td>
                          </tr>
                          <tr>
                            <td>{t("Enchère")}</td>
                            <td>
                              <Link
                                to="/DetailEnchere"
                                className="btn btn-outline block"
                              >
                                <i className="fa-solid fa-eye font-medium-1"></i>
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>{t("Type de payement")}</td>
                            <td>type de payement</td>
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
                            <th>{t("User")}</th>
                            <th>{t("Nom")}</th>
                            <th>{t("Prénom")}</th>
                            <th>{t("Pseudo")}</th>
                            <th>{t("Enchère")}</th>
                            <th>{t("Type de paiement")}</th>
                            <th>{t("Liste echéance")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <img
                                style={{ borderRadius: "50px" }}
                                className="imgtable"
                                src="./Mazed.jpg"
                                alt="img"
                              />
                            </td>
                            <td>{t("Lorem Lorem")}</td>
                            <td className="text-bold-500">
                              {t("Lorem Lorem")}
                            </td>
                            <td>Lorem Lorem</td>
                            <td>
                              <Link
                                to="/DetailEnchere"
                                className="btn btn-outline block"
                              >
                                <i className="fa-solid fa-eye font-medium-1"></i>
                              </Link>
                            </td>
                            <td>Payement</td>
                            <td>
                              <Link to="/Echéance">
                                <i className="fa-solid fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                style={{ borderRadius: "50px" }}
                                className="imgtable"
                                src="./Mazed.jpg"
                                alt="img"
                              />
                            </td>
                            <td>{t("Lorem Lorem")}</td>
                            <td className="text-bold-500">
                              {t("Lorem Lorem")}
                            </td>
                            <td>Lorem Lorem</td>
                            <td>
                              <Link
                                to="/DetailEnchere"
                                className="btn btn-outline block"
                              >
                                <i className="fa-solid fa-eye font-medium-1"></i>
                              </Link>
                            </td>
                            <td>Payement</td>
                            <td>
                              <Link to="/Echéance">
                                <i className="fa-solid fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                style={{ borderRadius: "50px" }}
                                className="imgtable"
                                src="./Mazed.jpg"
                                alt="img"
                              />
                            </td>
                            <td>{t("Lorem Lorem")}</td>
                            <td className="text-bold-500">
                              {t("Lorem Lorem")}
                            </td>
                            <td>Lorem Lorem</td>
                            <td>
                              <Link
                                to="/DetailEnchere"
                                className="btn btn-outline block"
                              >
                                <i className="fa-solid fa-eye font-medium-1"></i>
                              </Link>
                            </td>
                            <td>Payement</td>
                            <td>
                              <Link to="/Echéance">
                                <i className="fa-solid fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                style={{ borderRadius: "50px" }}
                                className="imgtable"
                                src="./Mazed.jpg"
                                alt="img"
                              />
                            </td>
                            <td>{t("Lorem Lorem")}</td>
                            <td className="text-bold-500">
                              {t("Lorem Lorem")}
                            </td>
                            <td>Lorem Lorem</td>
                            <td>
                              <Link
                                to="/DetailEnchere"
                                className="btn btn-outline block"
                              >
                                <i className="fa-solid fa-eye font-medium-1"></i>
                              </Link>
                            </td>
                            <td>Payement</td>
                            <td>
                              <Link to="/Echéance">
                                <i className="fa-solid fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                style={{ borderRadius: "50px" }}
                                className="imgtable"
                                src="./Mazed.jpg"
                                alt="img"
                              />
                            </td>
                            <td>{t("Lorem Lorem")}</td>
                            <td className="text-bold-500">
                              {t("Lorem Lorem")}
                            </td>
                            <td>Lorem Lorem</td>
                            <td>
                              <Link
                                to="/DetailEnchere"
                                className="btn btn-outline block"
                              >
                                <i className="fa-solid fa-eye font-medium-1"></i>
                              </Link>
                            </td>
                            <td>Payement</td>
                            <td>
                              <Link to="/Echéance">
                                <i className="fa-solid fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                style={{ borderRadius: "50px" }}
                                className="imgtable"
                                src="./Mazed.jpg"
                                alt="img"
                              />
                            </td>
                            <td>{t("Lorem Lorem")}</td>
                            <td className="text-bold-500">
                              {t("Lorem Lorem")}
                            </td>
                            <td>Lorem Lorem</td>
                            <td>
                              <Link
                                to="/DetailEnchere"
                                className="btn btn-outline block"
                              >
                                <i className="fa-solid fa-eye font-medium-1"></i>
                              </Link>
                            </td>
                            <td>Payement</td>
                            <td>
                              <Link to="/Echéance">
                                <i className="fa-solid fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img
                                style={{ borderRadius: "50px" }}
                                className="imgtable"
                                src="./Mazed.jpg"
                                alt="img"
                              />
                            </td>
                            <td>{t("Lorem Lorem")}</td>
                            <td className="text-bold-500">
                              {t("Lorem Lorem")}
                            </td>
                            <td>Lorem Lorem</td>
                            <td>
                              <Link
                                to="/DetailEnchere"
                                className="btn btn-outline block"
                              >
                                <i className="fa-solid fa-eye font-medium-1"></i>
                              </Link>
                            </td>
                            <td>Payement</td>
                            <td>
                              <Link to="/Echéance">
                                <i className="fa-solid fa-eye"></i>
                              </Link>
                            </td>
                          </tr>
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
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Ajouter Echéance")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t("Date de paiement")}</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newTableData.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Montant à payer")}</Form.Label>
              <Form.Control
                type="text"
                name="montantPayer"
                value={newTableData.montantPayer}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Montant restant")}</Form.Label>
              <Form.Control
                type="text"
                name="montantRestant"
                value={newTableData.montantRestant}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Montant à payer chaque mois")}</Form.Label>
              <Form.Control
                type="text"
                name="montantChaqueMois"
                value={newTableData.montantChaqueMois}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("Annuler")}
          </Button>
          <Button variant="primary" onClick={handleAddTable}>
            {t("Ajouter")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Winners;
