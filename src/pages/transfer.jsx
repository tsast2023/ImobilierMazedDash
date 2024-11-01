import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

// Modal component
function Modal({ t }) {
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
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn" data-bs-dismiss="modal">
              <span className="d-none d-sm-block">{t("Annulé")}</span>
            </button>
            <button
              type="button"
              className="btn btn-primary ms-1"
              data-bs-dismiss="modal"
            >
              <span className="d-none d-sm-block">{t("Envoyer")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ userData, onAccept }) {
  const { t } = useTranslation();

  const handleAccept = () => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non, annuler !"),
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((result) => {
      if (result.isConfirmed) {
        onAccept();
        Swal.fire({
          title: "Accepter",
          text: "Votre élément est accepté :)",
          icon: "success",
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

  return (
    <tr>
      <td>{userData.name}</td>
      <td>{userData.vehicle}</td>
      <td>{userData.value}</td>
      <td>{userData.location}</td>
      <td>{userData.note}</td>
    </tr>
  );
}

function ResponsiveTable({ data, headers, isMobile }) {
  const { t } = useTranslation();

  return (
    <div className="table-responsive datatable-minimal">
      <table className="table" id="table2">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{t(header)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <TableRow key={index} userData={item} onAccept={() => {}} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Transfer() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const data = [
    {
      name: "Graiden",
      vehicle: "vehicula",
      value: "076",
      location: "Offenburg",
      note: "Lorem",
      status: { text: "Accepté", color: "secondary" },
    },
    {
      name: "Graiden",
      vehicle: "vehicula",
      value: "076",
      location: "Offenburg",
      note: "Lorem",
      status: { text: "Refusé", color: "danger" },
    },
    {
      name: "Graiden",
      vehicle: "vehicula",
      value: "076",
      location: "Offenburg",
      note: "Lorem",
      status: { text: "En attente", color: "warning" },
    },
    // Additional data objects here
  ];

  // Pagination Slice
  const paginatedData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1212);
    window.addEventListener("resize", handleResize);
    handleResize();
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
              <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 className="new-price">{t("Demandes de transferts")}</h2>
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
              <div className="card-body">
              <ReactPaginate
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(data.length / itemsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                  className="react-paginate"
                />
                <ResponsiveTable
                  data={paginatedData}
                  headers={["Fichier", "Type recharge", "Pseudo", "Montant", "Statut"]}
                  isMobile={isMobile}
                />
                <ReactPaginate
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(data.length / itemsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                  className="react-paginate"
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
