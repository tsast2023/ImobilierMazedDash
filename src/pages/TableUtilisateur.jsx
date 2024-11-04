import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import ReactPaginate from "react-paginate";

function TableUtilisateur() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const state = useContext(GlobalState);
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
  const users = state.Users;
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
        Swal.fire(
          t("Désactivé(e) !"),
          t("Votre élément a été désactivé."),
          "secondary"
        );
      } else {
        Swal.fire(t("Annulé"), t("Votre élément est en sécurité :)"), "error");
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
        Swal.fire(
          t("Débloqué(e)"),
          t("Votre élément a été débloqué."),
          "secondary"
        );
      } else {
        Swal.fire(t("Annulé"), t("Votre élément est en sécurité :)"), "error");
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
            <i className="bi bi-justify fs-3"></i>
          </a>
        </header>
        <section className="section">
          <div className="card">
            <div
              className="card-header"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="new-price">{t("Liste des utilisateurs")}</h2>
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
              <div className="table-responsive">
                {isMobile ? (
                  <table className="table" id="table1">
                    <tbody>
                      {users &&
                        users.map((item) => (
                          <>
                            <tr>
                              <td>{t("Nom")}</td>
                              <td>{item.prenom}</td>
                            </tr>
                            <tr>
                              <td>{t("Pseudo")}</td>
                              <td>{item.pseudo}</td>
                            </tr>
                            <tr>
                              <td>{t("Email")}</td>
                              <td>{item.email}</td>
                            </tr>
                            <tr>
                              <td>{t("Détail")}</td>
                              <td>
                                <Link
                                  to={{
                                    pathname: `/UtilisateurDetails/${item.id}`,
                                    state: { user: "hello" },
                                  }}
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </Link>
                              </td>
                            </tr>
                            <tr>
                              <td>{t("Modifier")}</td>
                              <td>
                                <Link to="/UtilisateurEdit">
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </Link>
                              </td>
                            </tr>
                            <tr>
                              <td>{t("Bloquer")}</td>
                              <td>
                                <i
                                  className="fa-solid fa-lock"
                                  onClick={handleBlockClick}
                                ></i>
                              </td>
                            </tr>
                            <tr>
                              <td>{t("Débloquer")}</td>
                              <td>
                                <i
                                  className="fa-solid fa-lock-open"
                                  onClick={handleUnblockClick}
                                ></i>
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
                        <th>{t("Role")}</th>
                        <th>{t("Détail")}</th>
                        <th>{t("Modifier")}</th>
                        <th>{t("Bloquer")}</th>
                        <th>{t("Débloquer")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users &&
                        users.map((item) => (
                          <tr>
                            <td>{item.prenom}</td>
                            <td>{item.pseudo}</td>
                            <td>{item.email}</td>
                            <td>
                              <Link
                                to={{
                                  pathname: `/UtilisateurDetails/${item.id}`,
                                  state: { user: "hello" },
                                }}
                              >
                                <i className="fa-solid fa-eye"></i>
                              </Link>
                            </td>
                            <td>
                              <Link to="/UtilisateurEdit">
                                <i className="fa-solid fa-pen-to-square"></i>
                              </Link>
                            </td>
                            <td>
                              <i
                                className="fa-solid fa-lock"
                                onClick={handleBlockClick}
                              ></i>
                            </td>
                            <td>
                              <i
                                className="fa-solid fa-lock-open"
                                onClick={handleUnblockClick}
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

export default TableUtilisateur;
