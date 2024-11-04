import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import ReactPaginate from "react-paginate";

function Commandes() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const state = useContext(GlobalState);
  const commande = state.Commandes;
  console.log("commandes ==", commande);
  const [commandes, setCommandes] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

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

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8082/api/commandes/getCommandeByUser"
        );
        setCommandes(response.data);
      } catch (error) {
        console.error("Error fetching commandes:", error);
      }
    };

    fetchCommandes();
  }, []);

  const currentItems = commandes.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="content-container">
      <section className="section">
        <div className="row" id="table-contexual">
          <div className="col-12">
            <div className="card">
              <div
                className="card-header"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <h2 className="new-price">{t("Tableau de Commandes")}</h2>
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
                  {isMobile ? (
                    <MobileTable commandes={currentItems} />
                  ) : (
                    <DesktopTable commandes={currentItems} />
                  )}
                </div>
              </div>
              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={Math.ceil(commandes.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
                className="react-paginate"
              />
            </div>
          </div>
        </div>
      </section>
      <StatusModal />
    </div>
  );
}

function DesktopTable({ commandes }) {
  const { t } = useTranslation();
  return (
    <table className="table" id="table1">
      <thead>
        <tr>
          <th>{t("Image")}</th>
          <th>{t("Num Commande")}</th>
          <th>{t("Produit")}</th>
          <th>{t("Prix Produit")}</th>
          <th>{t("Quantité")}</th>
          <th>{t("Prix Total")}</th>
          <th>{t("Date De Commande")}</th>
          <th>{t("Statut")}</th>
          <th>{t("Changer Statut")}</th>
        </tr>
      </thead>
      <tbody>
        {commandes.map((commande) => (
          <tr className="table" key={commande.id}>
            <td>
              <img className="imgtable" src={commande.image} alt="img" />
            </td>
            <td className="text-bold-500">{commande.numCommande}</td>
            <td>{commande.produit}</td>
            <td>{commande.prixProduit}</td>
            <td>{commande.quantite}</td>
            <td>{commande.prixTotal}</td>
            <td>{new Date(commande.dateCommande).toLocaleDateString()}</td>
            <td>
              <span
                className={`badge ${
                  commande.statut === "Terminé" ? "bg-secondary" : "bg-warning"
                }`}
              >
                {t(commande.statut)}
              </span>
            </td>
            <td>
              <i
                className="fa-solid fa-sliders"
                data-bs-toggle="modal"
                data-bs-target="#statusModal"
              ></i>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MobileTable({ commandes }) {
  const { t } = useTranslation();
  return (
    <table className="table" id="table1">
      <tbody>
        {commandes.map((commande) => (
          <React.Fragment key={commande.id}>
            <tr>
              <td>{t("Num Commande")}</td>
              <td className="text-bold-500">{commande.numCommande}</td>
            </tr>
            <tr>
              <td>{t("Produit")}</td>
              <td>{commande.produit}</td>
            </tr>
            <tr>
              <td>{t("Image Produit")}</td>
              <td>
                <img className="imgtable" src={commande.image} alt="img" />
              </td>
            </tr>
            <tr>
              <td>{t("Prix Produit")}</td>
              <td>{commande.prixProduit}</td>
            </tr>
            <tr>
              <td>{t("Quantité")}</td>
              <td>{commande.quantite}</td>
            </tr>
            <tr>
              <td>{t("Prix Total")}</td>
              <td>{commande.prixTotal}</td>
            </tr>
            <tr>
              <td>{t("Date De Commande")}</td>
              <td>{new Date(commande.dateCommande).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>{t("Statut")}</td>
              <td>
                <span
                  className={`badge ${
                    commande.statut === "Terminé"
                      ? "bg-secondary"
                      : "bg-warning"
                  }`}
                >
                  {t(commande.statut)}
                </span>
              </td>
            </tr>
            <tr>
              <td>{t("Changer Statut")}</td>
              <td>
                <i
                  className="fa-solid fa-sliders"
                  data-bs-toggle="modal"
                  data-bs-target="#statusModal"
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
  );
}

function StatusModal() {
  const { t } = useTranslation();
  return (
    <div
      className="modal fade"
      id="statusModal"
      tabIndex="-1"
      aria-labelledby="statusModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="statusModalLabel">
              {t("Changer Statut")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <select className="form-select" id="statusSelect">
                  <option value="termine">{t("Terminé")}</option>
                  <option value="en-cours">{t("En Cours")}</option>
                  <option value="annule">{t("Annulé")}</option>
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {t("Fermer")}
            </button>
            <button type="button" className="btn btn-primary">
              {t("Sauvegarder")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Commandes;
