import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import ReactPaginate from "react-paginate";

function Commandes() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [CommandeId, setSelectedCommandeId] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [commandes, setCommandes] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [filters, setFilters] = useState({
    statut: "",
    searchValue: "",
    page: 0,
    size: 5,
    sort: "id,asc",
  });
  const [totalPages, setTotalPages] = useState(0);

  // Fetch commandes when filters change
  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const { statut, searchValue, page, size, sort } = filters;

        // Construct query parameters
        const params = new URLSearchParams();
        if (statut) params.append("statut", statut);
        if (searchValue) params.append("searchValue", searchValue);
        params.append("page", page);
        params.append("size", size);
        params.append("sort", sort);

        const res = await axios.get(`http://localhost:8082/api/commandes/filter?${params.toString()}`);
        setCommandes(res.data.content);
        console.log("commandes ==" , commandes)
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("Error fetching commandes:", error);
      }
    };

    fetchCommandes();
  }, [filters]);

  // Handle pagination change
  const handlePageClick = (data) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: data.selected,
    }));
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
      page: 0, // Reset to the first page when filters change
    }));
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1212);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentItems = commandes.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const handleStatusChange = (id) => {
    setSelectedCommandeId(id);
    setShowModal(true);
  };
  const handleSaveStatus = async () => {
    const selectedStatus = document.getElementById("statusSelect").value;
    console.log("CommandeId === " , CommandeId)
    console.log("selectedStatus ==== s" , selectedStatus)
    if (!CommandeId) {
      alert("No commande selected");
      return;
    }
  
    try {
      // Vous pouvez directement mettre à jour le statut de la commande ici
      await axios.put(`http://localhost:8082/api/commandes/${CommandeId}/status?newStatus=${selectedStatus}`);
      alert("Status updated successfully");
      // Réinitialisez ou mettez à jour l'état de l'interface ici
      setSelectedCommandeId(null); // Reset CommandeId après mise à jour
      setShowModal(false); 
      setFilters((prevFilters) => ({
        ...prevFilters,
        page: 0, // Recharger la page en cas de changement
      }));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
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
                  <input type="number" name="size" value={filters.size} onChange={handleFilterChange}    className="itemsPerPage" />
                </div>
              </div>
              <div className="row ">
                <div className="col-6 form-group">
                  <h6>{t("recherche")}</h6>
                  <input   name="searchValue"
                placeholder="Rechercher..."
               value={filters.searchValue}
                onChange={handleFilterChange} id="recherche" className="form-control" />
                </div>
                <div className="col-6 form-group">
                  <h6 htmlFor="basicInput">{t("Statut")}</h6>
                  <select className="choices form-select"    name="statut"
                value={filters.statut}
               onChange={handleFilterChange}>
                  <option value="EN_ATTENTE">{t("En Attente")}</option>
                  <option value="EN_COURS">{t("En Cours")}</option>
                  <option value="EXPEDIEE">{t("Expedié")}</option>
                  <option value="LIVREE">{t("Livré")}</option>
                  <option value="ANNULEE">{t("Annulé")}</option>
                  </select>
                </div>
              </div>
              
              
              { <div className="card-content">
                <div className="table-responsive">
                  {isMobile ? (
                    <MobileTable commandes={currentItems} handleStatusChange={handleStatusChange}/>
                  ) : (
                    <DesktopTable commandes={currentItems} handleStatusChange={handleStatusChange} />
                  )}
                </div>
              </div> }
              
              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                className="react-paginate"
              />
            </div>
          </div>
        </div>
      </section>
      <StatusModal handleSaveStatus={handleSaveStatus} />
    </div>
  );
}

function DesktopTable({ commandes , handleStatusChange }) {
  const { t } = useTranslation();
  return (
    <table className="table" id="table1">
      <thead>
        <tr>
        {/* <th>{t("id")}</th>  <th>{t("id")}</th> */}
          <th>{t("Num Commande")}</th>
          <th>{t("Date De Commande")}</th>
          <th>{t("Prix Total")}</th>
          <th>{t("Statut")}</th>
          <th>{t("Changer Statut")}</th>
        </tr>
      </thead>
      <tbody>
        {commandes.map((commande) => (
          <tr className="table" key={commande.id}>
              {/* <td className="text-bold-500">{commande.id}</td> */}
            <td className="text-bold-500">{commande.numCommande}</td>
       
            <td>{new Date(commande.createdAt).toLocaleDateString()}</td>
            <td>{commande.totalPrice}</td>
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
                onClick={() => handleStatusChange(commande.id)}
              ></i>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MobileTable({ commandes , handleStatusChange  }) {
  const { t } = useTranslation();
  return (
    <table className="table" id="table1">
      <tbody>
        {commandes.map((commande) => (
          <React.Fragment key={commande.id}>
             {/* <tr>
              <td>{t("Num Commande")}</td>
              <td className="text-bold-500">{commande.id}</td>
            </tr> */}
      

            <tr>
              <td>{t("Num Commande")}</td>
              <td className="text-bold-500">{commande.numCommande}</td>
            </tr>
      
            <tr>
              <td>{t("Prix Total")}</td>
              <td>{commande.totalPrice}</td>
            </tr>
            <tr>
              <td>{t("Date De Commande")}</td>
              <td>{new Date(commande.createdAt).toLocaleDateString()}</td>
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
                  onClick={() => handleStatusChange(commande.id)}
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

function StatusModal({ handleSaveStatus  , setShowModal}) {
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
            <div className="mb-3">
              <select className="form-select" id="statusSelect">
                <option value="EN_ATTENTE">{t("En attente")}</option>
                <option value="EN_COURS">{t("En Cours")}</option>
                <option value="EXPEDIEE">{t("Expedié")}</option>
                <option value="LIVREE">{t("Livrée")}</option>
                <option value="ANNULEE">{t("Annulé")}</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {t("Fermer")}
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSaveStatus}>
              {t("Sauvegarder")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Commandes;
