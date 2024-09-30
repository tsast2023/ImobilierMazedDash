import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { Table } from "react-bootstrap";

function EnchereListe() {
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

  const deleteItem = () => {
    // Implement your delete logic here
  };

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
        });      }
    });
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
            <div style={{ display: "flex", justifyContent: "space-between" }} className="card-header">
              <h2 className="new-price">{t("Liste d'enchére")}</h2>
            </div>
            <div className="card-body">
              <div className="row ">
                <div className="col-6 form-group">
                  <h6>{t("Catégories")}</h6>
                  <select className="choices form-select">
                    <option value="square">Square</option>
                    <option value="rectangle">Rectangle</option>
                    <option value="rombo">Rombo</option>
                    <option value="romboid">Romboid</option>
                    <option value="trapeze">Trapeze</option>
                    <option value="traible">Triangle</option>
                    <option value="polygon">Polygon</option>
                  </select>
                </div>
                <div className="col-6 form-group">
                  <h6 htmlFor="basicInput">{t("Statut")}</h6>
                  <select className="choices form-select">
                    <option value="square">Square</option>
                    <option value="rectangle">Rectangle</option>
                  </select>
                </div>
              </div>
              {isMobile ? (
                <Table responsive="sm">
                  <tbody>
                    <tr>
                      <td>{t("Produit")}</td>
                      <td className="text-bold-500">Michael Right</td>
                    </tr>
                    <tr>
                      <td>{t("Prix")}</td>
                      <td>$15/hr</td>
                    </tr>
                    <tr>
                      <td>{t("Nb de Participant")}</td>
                      <td className="text-bold-500">UI/UX</td>
                    </tr>
                    <tr>
                      <td>{t("Date de Publication")}</td>
                      <td className="text-bold-500">Michael Right</td>
                    </tr>
                    <tr>
                      <td>{t("Date de Déclenchement")}</td>
                      <td>$15/hr</td>
                    </tr>
                    <tr>
                      <td>{t("Statut")}</td>
                      <td>
                        <a href="#" className="btn btn-secondary">secondary</a>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Configuration")}</td>
                      <td>
                        <div className="buttons">
                          <Link to="/configuration" className="btn">
                            <i className="fas fa-cog"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Voir")}</td>
                      <td>
                        <div className="buttons">
                          <Link to="/DetailEnchere" className="btn">
                            <i className="fa-solid fa-eye"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Modifier")}</td>
                      <td>
                        <div className="buttons">
                          <Link to="/EnchèreEdit" className="btn">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Supprimer")}</td>
                      <td>
                        <div className="buttons">
                          <a className="btn">
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <Table responsive="sm">
                  <thead>
                    <tr>
                      <th>{t("Produit")}</th>
                      <th>{t("Prix")}</th>
                      <th>{t("Nb de Participant")}</th>
                      <th>{t("Date de Publication")}</th>
                      <th>{t("Date de Déclenchement")}</th>
                      <th>{t("Statut")}</th>
                      <th>{t("Configuration")}</th>
                      <th>{t("Voir")}</th>
                      <th>{t("Modifier")}</th>
                      <th>{t("Supprimer")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-bold-500">Michael Right</td>
                      <td>$15/hr</td>
                      <td className="text-bold-500">UI/UX</td>
                      <td className="text-bold-500">Michael Right</td>
                      <td>$15/hr</td>
                      <td>
                        <a href="#" className="btn btn-secondary">secondary</a>
                      </td>
                      <td>
                        <div className="buttons">
                          <Link to="/configuration" className="btn">
                            <i className="fas fa-cog"></i>
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className="buttons">
                          <Link to="/DetailEnchere" className="btn">
                            <i className="fa-solid fa-eye"></i>
                          </Link>
                        </div>
                      </td>
                      <td>
                      <div className="buttons">
                          <Link to="/EnchèreEdit" className="btn">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className="buttons">
                          <a className="btn">
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-bold-500">Michael Right</td>
                      <td>$15/hr</td>
                      <td className="text-bold-500">UI/UX</td>
                      <td className="text-bold-500">Michael Right</td>
                      <td>$15/hr</td>
                      <td>
                        <a href="#" className="btn btn-secondary">secondary</a>
                      </td>
                      <td>
                        <div className="buttons">
                          <Link to="/configuration" className="btn">
                            <i className="fas fa-cog"></i>
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className="buttons">
                          <Link to="/DetailEnchere" className="btn">
                            <i className="fa-solid fa-eye"></i>
                          </Link>
                        </div>
                      </td>
                      <td>
                      <div className="buttons">
                          <Link to="/EnchèreEdit" className="btn">
                            <i className="fa-solid fa-pen-to-square"></i>
                          </Link>
                        </div>
                      </td>
                      <td>
                        <div className="buttons">
                          <a className="btn">
                            <i onClick={handleDelete} className="fa-solid fa-trash"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EnchereListe;
