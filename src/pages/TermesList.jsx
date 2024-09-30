import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";


function TermesList() {
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

  // Function to handle item deletion
  const handleDelete = () => {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      text: t("Une fois supprimé(e), vous ne pourrez pas récupérer cet élément !"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui, supprimez-le !"),
      cancelButtonText: t("Non, annuler !"),
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // Call deleteItem function
        deleteItem();
        Swal.fire({   title: "Supprimer",
          text: "Votre élément est Supprimer:)",
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

  const deleteItem = () => {
    // Your delete logic here
  };

  return (
    <div className="content-container">
      <div id="main">
        <div className="page-heading">
          <section className="section">
            <div className="card">
              <div className="card-header">
                <h2 className="new-price">{t("Termes et conditions")}</h2>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  {isMobile ? (
                    <table className="table" id="table1">
                      <tbody>
                        <tr>
                          <td>{t("Date de création")}</td>
                          <td>{t("05/05/2024")}</td>
                        </tr>
                        <tr>
                          <td>{t("Sujet")}</td>
                          <td>{t("création d'un compte acheteur")}</td>
                        </tr>
                        <tr>
                          <td>{t("Voir")}</td>
                          <td>
                            <i className="fa-solid fa-eye" data-bs-toggle="modal" data-bs-target="#viewModal"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Editer")}</td>
                          <td>
                            <i className="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Supprimer")}</td>
                          <td>
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2"><hr /></td>
                        </tr>
                        <tr>
                          <td>{t("Date de création")}</td>
                          <td>{t("05/05/2024")}</td>
                        </tr>
                        <tr>
                          <td>{t("Sujet")}</td>
                          <td>{t("création d'un compte vendeur")}</td>
                        </tr>
                        <tr>
                          <td>{t("Voir")}</td>
                          <td>
                            <i className="fa-solid fa-eye" data-bs-toggle="modal" data-bs-target="#viewModal"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Editer")}</td>
                          <td>
                            <i className="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("Supprimer")}</td>
                          <td>
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <table className="table" id="table1">
                      <thead>
                        <tr>
                          <th>{t("Date de création")}</th>
                          <th>{t("Sujet")}</th>
                          <th>{t("Voir")}</th>
                          <th>{t("Editer")}</th>
                          <th>{t("Supprimer")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{t("05/05/2024")}</td>
                          <td>{t("création d'un compte acheteur")}</td>
                          <td>
                            <i className="fa-solid fa-eye" data-bs-toggle="modal" data-bs-target="#viewModal"></i>
                          </td>
                          <td>
                            <i className="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                          </td>
                          <td>
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("05/05/2024")}</td>
                          <td>{t("création d'un compte vendeur")}</td>
                          <td>
                            <i className="fa-solid fa-eye" data-bs-toggle="modal" data-bs-target="#viewModal"></i>
                          </td>
                          <td>
                            <i className="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                          </td>
                          <td>
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("05/05/2024")}</td>
                          <td>{t("participation à une enchère")}</td>
                          <td>
                            <i className="fa-solid fa-eye" data-bs-toggle="modal" data-bs-target="#viewModal"></i>
                          </td>
                          <td>
                            <i className="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                          </td>
                          <td>
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>{t("05/05/2024")}</td>
                          <td>{t("enchérir")}</td>
                          <td>
                            <i className="fa-solid fa-eye" data-bs-toggle="modal" data-bs-target="#viewModal"></i>
                          </td>
                          <td>
                            <i className="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                          </td>
                          <td>
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* View Modal */}
      <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="viewModalLabel">Default Layout</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam,
              commodi? Ullam quaerat similique iusto temporibus, vero aliquam
              praesentium, odit deserunt eaque nihil saepe hic deleniti?
              Placeat delectus quibusdam ratione ullam!
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">{t("Ajouter un terme")}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="form form-vertical">
                <div className="form-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group has-icon-left">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">
                          {t("Text")}
                        </label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} defaultValue={""} />
                      </div>
                    </div>
                    <div className="col-12">
                      <fieldset className="form-group">
                        <label>{t("Sujet")}</label>
                        <select className="form-select" id="basicSelect">
                          <option>{t("Création d'un compte acheteur")}</option>
                          <option>{t("Création d'un compte vendeur")}</option>
                          <option>{t("Participation à une enchère")}</option>
                          <option>{t("enchérir")}</option>
                        </select>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t("Annuler")}</button>
              <button type="button" className="btn btn-primary" id="suivantBtn">{t("Enregistrer")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermesList;
