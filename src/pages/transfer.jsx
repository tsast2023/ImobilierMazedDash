import React, { useState, useEffect } from "react";
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
              <i className="bx bx-x d-block d-sm-none"></i>
              <span className="d-none d-sm-block">{t("Annulé")}</span>
            </button>
            <button
              type="button"
              className="btn btn-primary ms-1"
              data-bs-dismiss="modal"
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

function TableRow({ userData, status, onAccept }) {
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
        Swal.fire({   title: "Accepter",
          text: "Votre élément est Accepter :)",
          icon: "Succes",
          confirmButtonColor: "#b0210e",
        });       } else {
        Swal.fire({   title: "Annulé",
          text: "Votre élément est en sécurité :)",
          icon: "error",
          confirmButtonColor: "#b0210e",
        });       }
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

// ResponsiveTable component
function ResponsiveTable({ data, headers, isMobile }) {
  const { t } = useTranslation();

  const handleAccept = () => {
    // Handle acceptance logic
    console.log("Item accepted");
  };

  return (
    <div className="table-responsive datatable-minimal">
      {isMobile ? (
        <table className="table" id="table2">
          <tbody>
            {data.map((item, index) => (
              <React.Fragment key={index}>
                <TableRow
                  userData={item}
                  status={item.status}
                  onAccept={handleAccept}
                />
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
              {/* <th>{t("Accepter")}</th>
              <th>{t("Refuser")}</th> */}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
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
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

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

  const data = [
    {
      name: "Graiden",
      vehicle: "vehicula",
      value: "076",
      location: "Offenburg",
      note: "Lorem",
      status: {
        text: "Accepté",
        color: "secondary",
      },
    },
    {
      name: "Graiden",
      vehicle: "vehicula",
      value: "076",
      location: "Offenburg",
      note: "Lorem",
      status: {
        text: "Refusé",
        color: "danger",
      },
    },
    {
      name: "Graiden",
      vehicle: "vehicula",
      value: "076",
      location: "Offenburg",
      note: "Lorem",
      status: {
        text: "En attente",
        color: "warning",
      },
    },
  ];

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
                  data={data}
                  headers={[
                    "Fichier",
                    "Type recharge",
                    "Pseudo",
                    "Montant",
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
