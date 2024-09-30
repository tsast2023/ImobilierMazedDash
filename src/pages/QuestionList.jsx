import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

function QuestionList() {
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

  const handleDelete = () => {
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
        deleteItem();
        Swal.fire({   title: "Supprimer",
          text: "Votre élément est Supprimer:)",
          icon: "Succes",
          confirmButtonColor: "#b0210e",
        });      } else {
          Swal.fire({   title: "Annulé",
            text: "Votre élément est en sécurité :)",
            icon: "error",
            confirmButtonColor: "#b0210e",
          });            }
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
                <h2 className="new-price">{t("Liste des questions")}</h2>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  {isMobile ? (
                    <table className="table" id="table1">
                      <tbody>
                        <tr>
                          <td>{t("La question")}</td>
                          <td>{t("Lorem Lorem")}</td>
                        </tr>
                        <tr>
                          <td>{t("Date de création")}</td>
                          <td>{t("05/05/2024")}</td>
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
                          <td>{t("La question")}</td>
                          <td>{t("Lorem Lorem")}</td>
                        </tr>
                        <tr>
                          <td>{t("Date de création")}</td>
                          <td>{t("05/05/2024")}</td>
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
                          <th>{t("La question")}</th>
                          <th>{t("Date de création")}</th>
                          <th>{t("Voir")}</th>
                          <th>{t("Editer")}</th>
                          <th>{t("Supprimer")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{t("Lorem Lorem")}</td>
                          <td>{t("05/05/2024")}</td>
                          <th>
                            <i className="fa-solid fa-eye" data-bs-toggle="modal" data-bs-target="#viewModal"></i>
                          </th>
                          <th>
                            <i className="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                          </th>
                          <th>
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </th>
                        </tr>
                        <tr>
                          <td>{t("Lorem Lorem")}</td>
                          <td>{t("05/05/2024")}</td>
                          <th>
                            <i className="fa-solid fa-eye" data-bs-toggle="modal" data-bs-target="#viewModal"></i>
                          </th>
                          <th>
                            <i className="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                          </th>
                          <th>
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </th>
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
              <h5 className="modal-title" id="viewModalLabel">{t("Détail de Question")}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>{t("Contenu de détail de question ici.")}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t("Fermer")}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">{t("Éditer Question")}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="form form-vertical">
                <div className="form-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group has-icon-left">
                        <label htmlFor="question" className="form-label">{t("La question")}</label>
                        <textarea className="form-control" id="question" rows={3}></textarea>
                      </div>
                      <div className="form-group has-icon-left">
                        <label htmlFor="answer" className="form-label">{t("La réponse")}</label>
                        <textarea className="form-control" id="answer" rows={3}></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t("Annuler")}</button>
              <button type="button" className="btn btn-primary">{t("Enregistrer")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionList;
