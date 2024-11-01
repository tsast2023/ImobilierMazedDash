import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import axios from "axios";
import ReactPaginate from 'react-paginate';
 
import Cookies from "js-cookie";
import "../css/Download.css";
// Modal component
function Modal({ t, id, traiterDemande }) {
  const [cause, setCause] = useState();
  return (
    <div
      className="modal fade text-left"
      id="default"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="myModalLabel1">
              {t("Cause")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="card-body">
            <div className="form-group with-title mb-3">
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                onChange={(e) => setCause(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn" data-bs-dismiss="modal">
              <i className="bx bx-x d-block d-sm-none"></i>
              <span className="d-none d-sm-block">{t("Annulé")}</span>
            </button>
            <button
              type="button"
              className="btn btn-primary ms-1"
              onClick={() => traiterDemande(id, "REFUSER", cause)}
            >
              <i className="bx bx-check d-block d-sm-none"></i>
              <span className="d-none d-sm-block">{t("Envoyer")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// TableRow component
function TableRow({ userData, onAccept }) {
  const token = Cookies.get("token");
  const { t, i18n } = useTranslation();
  const downloadFile = async (fileId, token) => {
    try {
      const res = await axios.get(
        `http://localhost:8082/api/demandeTransfert/file/${fileId}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Create a URL for the file blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `file_${fileId}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const traiterDemande = async (id, status, cause) => {
    try {
      console.log(id, status, cause);

      const res = await axios.post(
        `http://localhost:8082/api/demandeTransfert/traiter/${id}?statusDemande=${status}&cause=${cause}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAccept = (id, status, cause) => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non, annuler !"),
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then(async(result) => {
      if (result.isConfirmed) {
        await traiterDemande(id, status, cause);
        onAccept();
        Swal.fire({
          title: "Accepter",
          text: "Votre élément est Accepter :)",
          icon: "Succes",
          confirmButtonColor: "#b0210e",
        }).then(() => {
          window.location.reload(); // Reload after the alert is confirmed
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

  return (
    <tr>
      <td>
        <div class="custom-button">
          <div class="custom-button-wrapper">
            <a class="custom-text">Download</a>
            <a
              onClick={() => downloadFile(userData.fileId, token)}
              class="custom-icon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="2em"
                height="2em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </td>
      <td>{userData.montant}Dt</td>
      <td>{userData.acheteur.pseudo}</td>

      <td>{userData.createdAt?.split("T")[0]}</td>
      <td>{userData.typeRecharge}</td>
      <td>
        <span
          className={
            userData.statusDemande === "EN_ATTENTE"
              ? "badge bg-info"
              : userData.statusDemande === "REFUSER"
              ? "badge bg-danger"
              : "badge bg-success"
          }
        >
          {userData.statusDemande}
        </span>
      </td>
      {userData && userData.statusDemande === "EN_ATTENTE" ? (
        <>
          <td>
            <i
              className="fa-solid fa-circle-check text-success"
              onClick={() => handleAccept(userData.id, "APPROUVER")}
            ></i>
          </td>
          <td>
            <section id="basic-modals">
              <button
                type="button"
                className="btn btn-outline block"
                data-bs-toggle="modal"
                data-bs-target="#default"
              >
                <i className="fa-solid fa-circle-xmark text-danger"></i>
              </button>
              <Modal t={t} id={userData.id} traiterDemande={handleAccept} />
            </section>
          </td>
        </>
      ) : (
        <>
          <td>-</td>
          <td>-</td>
        </>
      )}
    </tr>
  );
}

// ResponsiveTable component
function ResponsiveTable({ data, headers, isMobile }) {
  const { t, i18n } = useTranslation();
  const { numTel, setnumTel, pseudo, setpseudo, statusDemande, setstatusDemande ,  typeRecharge,settypeRecharge , pageTransfert, setpageTransfert } = useContext(GlobalState);
  const handleAccept = () => {
    // Handle acceptance logic
    console.log("Item accepted");
  };
  const handlePageChange = (selectedPage) => {
    setpageTransfert(selectedPage.selected);
    console.log(pageTransfert) // React Paginate is 0-indexed, so we add 1
  };

  return (
    <div className="table-responsive datatable-minimal">
      <div className="row ">
        <div className="col-6">
          <div className="form-group">
            <label htmlFor="recherche">
              <h6>{t("Numéro de téléphone")}</h6>
            </label>
            <input value={numTel} onChange={e=>setnumTel(e.target.value)} id="recherche" className="form-control" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label htmlFor="recherche">
              <h6>{t("Pseudo")}</h6>
            </label>
            <input value={pseudo} onChange={e=>setpseudo(e.target.value)} id="recherche" className="form-control" />
          </div>
        </div>
        <div className="col-6 form-group">
          <h6>{t("Statut")}</h6>
          <select value={statusDemande} onChange={e=>setstatusDemande(e.target.value)} className="choices form-select">
            <option  value=""  selected></option>
            <option value="APPROUVER">{t("Approuver")}</option>
            <option value="EN_ATTENTE">{t("En attente")}</option>
            <option value="REFUSER">{t("Refuser")}</option>
          </select>
        </div>
        <div className="col-6 form-group">
          <h6>{t("Type de recharge")}</h6>
          <select value={typeRecharge} onChange={e=>settypeRecharge(e.target.value)} className="choices form-select">
            <option value=""  selected></option>
            <option value="Versement">{t("Versement")}</option>
            <option value="VirementBancaire">{t("Virement Bancaire")}</option>
            <option value="Cheque">{t("Cheque")}</option>
            <option value="VisiteBureau">{t("Visite Bureau")}</option>
            <option value="Transfert">{t("Transfert")}</option>
            <option value="CarteRecharge">{t("Carte Recharge")}</option>
            <option value="PointDeRecharge">{t("Point De Recharge")}</option>
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
        <table className="table" id="table2">
          <tbody>
            {data.content?.map((item, index) => (
              <React.Fragment key={index}>
                <TableRow userData={item} onAccept={handleAccept} />
                <tr>
                  <td colSpan="2">
                    <hr />
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="table" id="table2">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{t(header)}</th>
              ))}
              <th>{t("Accepter")}</th>
              <th>{t("Refuser")}</th>
            </tr>
          </thead>
          <tbody>
            {data?.content?.map((item, index) => (
              <TableRow
                key={index}
                userData={item}
                status={item.status}
                onAccept={handleAccept}
              />
            ))}
          </tbody>
        </table>
      )}
      
    </div>
  );
}

// Transfer component
function Transfer() {
  const state = useContext(GlobalState);
  const demandesTransfert = state.demandesT || [];
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  // State to track selected filter values
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchPseudo, setSearchPseudo] = useState("");
  const [searchNumtel, setSearchNumtel] = useState("");
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


  return (
    <div className="content-container">
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3"></i>
          </a>
        </header>

        <div className="page-heading">
          <section className="section">
            <div className="card">
              <div className="card-header">
                <h2 className="new-price">{t("Demandes de transferts")}</h2>
              </div>
              <div className="card-body">
                <ResponsiveTable
                  data={demandesTransfert}
                  headers={[
                    "ficher",
                    "montant",
                    "pseudo",
                    "Date demande",
                    "Type de recharge",
                    "Statut",
                  ]}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
