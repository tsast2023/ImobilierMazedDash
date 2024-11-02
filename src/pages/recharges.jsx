import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { GlobalState } from "../GlobalState";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Table } from "react-bootstrap";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";

function Recharges() {
  const { t } = useTranslation();
  const state = useContext(GlobalState);
  const cartes = state.cartes;
  const [carteRech, setCarteRech] = useState({ quantity: "", montant: "" });
  const [isMobile, setIsMobile] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const token = Cookies.get("token");
  const recharges = state.recharges || [];

  // New state variables for filters
  const [filterNumSérie, setFilterNumSérie] = useState("");
  const [filterStatut, setFilterStatut] = useState("");

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1212);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
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
        deleteItem(id);
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

  const deleteItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8082/api/carte/deleteCarte?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const addCarte = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8082/api/carte/generer", null, {
        params: carteRech,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // Filtered cartes based on Numéro de série and Statut
  const filteredCartes = cartes.filter((item) => {
    return (
      (!filterNumSérie || item.numSérie.includes(filterNumSérie)) &&
      (!filterStatut || item.statuscarte === filterStatut)
    );
  });

  // Paginated data for filtered results
  const paginatedCartes = filteredCartes.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <div id="main">
      <header className="mb-3">
        <a href="#" className="burger-btn d-block d-xl-none">
          <i className="bi bi-justify fs-3"></i>
        </a>
      </header>

      <section id="form-and-scrolling-components">
        <div className="row">
          <div className="col-md-6 col-12">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="form-group">
                    <h2 className="new-price">
                      {t("Vous souhaitez ajouter une nouvelle carte ?")}
                    </h2>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#inlineForm"
                    >
                      <i className="bi bi-plus"></i>
                      {t("Ajouter")}
                    </button>
                    {/* Modal content here */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section mt-4">
        <div className="card">
          <div
            className="card-header"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <h2 className="new-price">{t("Liste des cartes ajoutées")}</h2>
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

          {/* Filter Inputs */}
          <div className="row" style={{ padding: "0 20px" }}>
            {/* Numéro de série Filter Section */}
            <div className="col-md-6 mb-4">
              <h6>{t("Numéro de série")}</h6>
              <fieldset className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("Filter by Numéro de série")}
                  value={filterNumSérie}
                  onChange={(e) => setFilterNumSérie(e.target.value)}
                />
              </fieldset>
            </div>

            {/* Statut Filter Section */}
            <div className="col-md-6 mb-4">
              <h6>{t("Statut")}</h6>
              <fieldset className="form-group">
                <select
                  className="form-select"
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                >
                  <option value="">{t("All Statut")}</option>
                  <option value="NONUTILISER">{t("NONUTILISER")}</option>
                  <option value="UTILISER">{t("UTILISER")}</option>
                </select>
              </fieldset>
            </div>
          </div>

          <div className="card-content">
            <div className="card-body">
              {isMobile ? (
                <Table responsive="sm">
                  <tbody>
                    {paginatedCartes.map((item) => (
                      <React.Fragment key={item.id}>
                        <tr>
                          <td>{t("Numéro de carte")}</td>
                          <td className="text-bold-500">{item.numSérie}</td>
                        </tr>
                        <tr>
                          <td>{t("Validité")}</td>
                          <td>
                            {item.validite === true ? "Valide" : "Invalide"}
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Statut")}</td>
                          <td>
                            <span
                              className={
                                item.statuscarte === "NONUTILISER"
                                  ? "badge bg-success"
                                  : "badge bg-danger"
                              }
                            >
                              {item.statuscarte}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Valeur")}</td>
                          <td>{item.valeur}</td>
                        </tr>
                        <tr>
                          <td>{t("Supprimer")}</td>
                          <td>
                            <i
                              className="fa-solid fa-trash deleteIcon"
                              onClick={() => handleDelete(item.id)}
                            ></i>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="table-responsive datatable-minimal">
                  <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(filteredCartes.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    className="react-paginate"
                  />
                  <Table className="table" id="table2">
                    <thead>
                      <tr>
                        <th>{t("Numéro de série")}</th>
                        <th>{t("Validité")}</th>
                        <th>{t("Statut")}</th>
                        <th>{t("Valeur")}</th>
                        <th>{t("Supprimer")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCartes.map((item) => (
                        <tr key={item.id}>
                          <td>{item.numSérie}</td>
                          <td>
                            {item.validite === true ? "Valide" : "Invalide"}
                          </td>
                          <td>
                            <span
                              className={
                                item.statuscarte === "NONUTILISER"
                                  ? "badge bg-success"
                                  : "badge bg-danger"
                              }
                            >
                              {item.statuscarte}
                            </span>
                          </td>
                          <td>{item.valeur}</td>
                          <td>
                            <i
                              className="fa-solid fa-trash deleteIcon"
                              onClick={() => handleDelete(item.id)}
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Recharges;
