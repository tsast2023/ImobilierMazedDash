import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import ReactPaginate from "react-paginate";

function TableVendeurs() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const state = useContext(GlobalState);
  const vendeurs = state.Vendeurs;
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

  console.log("vendeurs ===", vendeurs);
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

  const handleBlockClick = () => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non"),
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem();
        Swal.fire({
          title: "Bloquer",
          text: "Votre élément est Bloquer :)",
          icon: "Succes",
          confirmButtonColor: "#b0210e",
        });
      } else {
        Swal.fire({
          title: "Annulé",
          text: "Votre élément est Deblouquer :)",
          icon: "error",
          confirmButtonColor: "#b0210e",
        });
      }
    });
  };

  const handleUnblockClick = () => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non"),
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem();
        Swal.fire({
          title: "Deblouquer",
          text: "Votre élément est Deblouquer:)",
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

  const deleteItem = () => {
    // Your delete logic here
  };

  return (
    <div className="content-container">
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3" />
          </a>
        </header>
        <section className="section">
          <div className="card">
            <div
              className="card-header"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="new-price">{t("Liste des vendeurs")}</h2>
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
            <div className="row" style={{ padding: "0 20px" }}>
              <div className="col-md-6 mb-4">
                <h6>{t("Statut")}</h6>
                <fieldset className="form-group">
                  <select className="form-select" id="basicSelect1">
                    <option> {t("Particulier")} </option>
                    <option> {t("Professionel")} </option>
                  </select>
                </fieldset>
              </div>
              <div className="col-md-6 mb-4">
                <h6>{t("Etat")}</h6>
                <fieldset className="form-group">
                  <select className="form-select" id="basicSelect2">
                    <option> {t("Accepte")} </option>
                    <option> {t("Non confirmé")} </option>
                    <option> {t("Refuse")} </option>
                  </select>
                </fieldset>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                {isMobile ? (
                  <table className="table" id="table1">
                    <tbody>
                      {vendeurs &&
                        vendeurs.map((item) => (
                          <>
                            <tr>
                              <td>{t("Nom")}</td>
                              <td>{item.nomFamille}</td>
                            </tr>
                            <tr>
                              <td>{t("Pseudo")}</td>
                              <td>{item.pseudo}</td>
                            </tr>
                            <tr>
                              <td>{t("Date inscription")}</td>
                              <td>{item.createdAt}</td>
                            </tr>
                            <tr>
                              <td>{t("Produits déposés dans boutique")}</td>
                              <td>1</td>
                            </tr>
                            <tr>
                              <td>{t("Produits déposés aux enchères")}</td>
                              <td>1</td>
                            </tr>
                            <tr>
                              <td>{t("Détail")}</td>
                              <td>
                                <Link to="/VendeurDetails">
                                  <i className="fa-solid fa-eye"></i>
                                </Link>
                              </td>
                            </tr>
                            <tr>
                              <td>{t("Bloquer")}</td>
                              <td>
                                <i
                                  onClick={handleBlockClick}
                                  className="fa-solid fa-lock"
                                ></i>
                              </td>
                            </tr>
                            <tr>
                              <td>{t("Débloquer")}</td>
                              <td>
                                <i
                                  onClick={handleUnblockClick}
                                  className="fa-solid fa-unlock"
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
                        <th>{t("Pseudo")}</th>
                        <th>{t("Date inscription")}</th>
                        <th>{t("Produits déposés dans boutique")}</th>
                        <th>{t("Produits déposés aux enchères")}</th>
                        <th>{t("Détail")}</th>
                        <th>{t("Bloquer")}</th>
                        <th>{t("Débloquer")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendeurs &&
                        vendeurs.map((item) => (
                          <tr>
                            <td>{item.nomFamille}</td>
                            <td>{item.pseudo}</td>
                            <td>{item.createdAt}</td>
                            <td>1</td>
                            <td>1</td>
                            <td>
                              <Link to="/VendeurDetails">
                                <i className="fa-solid fa-eye"></i>
                              </Link>
                            </td>
                            <th>
                              <i
                                onClick={handleBlockClick}
                                className="fa-solid fa-lock"
                              ></i>
                            </th>
                            <td>
                              <i
                                onClick={handleUnblockClick}
                                className="fa-solid fa-unlock"
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
        </section>
      </div>
    </div>
  );
}

export default TableVendeurs;
