import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../GlobalState";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

function ListeAdministrateur() {
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default number of items per page
  const [currentPage, setCurrentPage] = useState(0);
  const state = useContext(GlobalState);
  const admins = state.Admins;
  console.log("Admins", admins);
  const roles = state.Roles;
  const [data, setData] = useState({
    prenom: "",
    numTel: "",
    email: "",
    identifiant: "",
    roleName: "",
    password: "",
  });
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value)); // Update items per page
    setCurrentPage(0); // Reset to first page when items per page changes
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1212);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBlockModal = (id) => {
    Swal.fire({
      title: t("Êtes-vous sûr?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non, annuler!"),
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((result) => {
      if (result.isConfirmed) {
        block(id);
        Swal.fire({ title: "fait", confirmButtonColor: "#b0210e" });
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

  const handleUnblockModal = (id) => {
    Swal.fire({
      title: t("Êtes-vous sûr?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non, annuler!"),
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((result) => {
      if (result.isConfirmed) {
        unBlock(id);
        Swal.fire({ title: "fait", confirmButtonColor: "#b0210e" });
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

  const openEditModal = () => {
    setShowModal(true);
  };

  const closeEditModal = () => {
    setShowModal(false);
  };
  const block = async (id) => {
    try {
      const res = await axios.put(`http://localhost:8082/admin/block/${id}`);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const unBlock = async (id) => {
    try {
      const res = await axios.put(`http://localhost:8082/admin/unblock/${id}`);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
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
            <div className="card-header">
              <h2 className="new-price">{t("Liste des administrateurs")}</h2>
              <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",

                  }}
                >
                  <label htmlFor="itemsPerPage" style={{ marginRight: "10px" }}>
                    <h6>{t("Items par page:")}</h6>
                  </label>
                  <select className="itemsPerPage"
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
                      {admins &&
                        admins.map((item) => (
                          <>
                            <tr>
                              <td>{t("Nom")}</td>
                              <td>{item.prenom}</td>
                            </tr>
                            <tr>
                              <td>{t("Pseudo")}</td>
                              <td>{item.identifiant}</td>
                            </tr>
                            {/* <tr>
                              <td>{t("Role")}</td>
                              <td>{item.roleAdmin.name}</td>
                            </tr> */}
                            <tr>
                              <td>{t("Status")}</td>
                              <td>{item.status}</td>
                            </tr>
                            <tr>
                              <td>{t("Modifier")}</td>
                              <td>
                                <i
                                  className="fa-solid fa-pen-to-square"
                                  onClick={openEditModal}
                                ></i>
                              </td>
                            </tr>
                            <tr>
                              <td>{t("Bloquer")}</td>
                              <td>
                                <i
                                  className="fa-solid fa-lock"
                                  onClick={() => handleBlockModal(item.id)}
                                ></i>
                              </td>
                            </tr>
                            <tr>
                              <td>{t("Débloquer")}</td>
                              <td>
                                <i
                                  className="fa-solid fa-lock-open"
                                  onClick={() => handleUnblockModal(item.id)}
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
                        <th>{t("Email")}</th>
                        <th>{t("Pseudo")}</th>
                        <th>{t("Role")}</th>
                        <th>{t("Status")}</th>
                        <th>{t("Modifier")}</th>
                        <th>{t("Bloquer")}</th>
                        <th>{t("Débloquer")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins &&
                        admins.map((item) => (
                          <tr>
                            <td>{item.prenom}</td>
                            <td>{item.identifiant}</td>
                            <td>{item.roleAdmin.name}</td>
                            <td>{item.status}</td>
                            <td>
                              <i
                                className="fa-solid fa-pen-to-square"
                                onClick={openEditModal}
                              ></i>
                            </td>
                            <td>
                              <i
                                className="fa-solid fa-lock"
                                onClick={() => handleBlockModal(item.id)}
                              ></i>
                            </td>
                            <td>
                              <i
                                className="fa-solid fa-lock-open"
                                onClick={() => handleUnblockModal(item.id)}
                              ></i>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal and Backdrop */}
      {showModal && (
        <div>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {t("modification d'un administrateur")}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeEditModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="card-content">
                    <div className="card-body">
                      <form className="form form-vertical">
                        <div className="form-body">
                          <div className="row">
                            <div className="col-12">
                              <div className="form-group">
                                <label htmlFor="role-id">{t("Role")}</label>
                                <fieldset className="form-group mb-3">
                                  <select className="form-select" id="role-id">
                                    <option>IT</option>
                                    <option>Blade Runner</option>
                                    <option>Thor Ragnarok</option>
                                  </select>
                                </fieldset>
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group">
                                <label htmlFor="role-id">
                                  {t("Permission")}
                                </label>
                                <fieldset className="form-group mb-3">
                                  <select className="form-select" id="role-id">
                                    <option>IT</option>
                                    <option>Blade Runner</option>
                                    <option>Thor Ragnarok</option>
                                  </select>
                                </fieldset>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary me-2"
                              onClick={closeEditModal}
                            >
                              {t("Annuler")}
                            </button>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              id="suivantBtn"
                            >
                              {t("Enregistrer")}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End Modal and Backdrop */}
    </div>
  );
}

export default ListeAdministrateur;
