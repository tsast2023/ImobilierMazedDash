import React from 'react';
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';
import '../css/EnchèreCreation.css';
import { Link } from 'react-router-dom';

function EnchèreEdit() {
  const { t } = useTranslation();

  const confirmAction = (actionType) => {
    Swal.fire({
      title: t("Êtes-vous sûr?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non, annuler!"),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(t("Terminé"), t("L'élément a été ajoutée"), "secondary");
      }
    });
  };

  return (
    <div className='content-container'>
      <div className="page-heading">
        <section id="basic-vertical-layouts">
          <div className="match-height">
            <div>
              <div className="card">
                <div className="card-header">
                  <h2 className="new-price">{t("Modification De Enchere")}</h2>
                </div>
                <div className="card-content">
                  <div className="card-body">
                    <form className="form form-vertical">
                      <div className="form-body">
                        <div className="row">
                          <div className="col-12">
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label htmlFor="email-id-vertical">{t("Prix magasin")}</label>
                              <input type="number" id="email-id-vertical" className="form-control" name="email-id" placeholder={t("dt")} required />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label htmlFor="email-id-vertical">{t("Prix Mazed Online")}</label>
                              <input type="text" id="email-id-vertical" className="form-control" name="email-id" placeholder={t("prix mazad")} required />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label htmlFor="email-id-vertical">{t("Notaire")}</label>
                              <input type="text" id="email-id-vertical" className="form-control" name="email-id" placeholder={t("prix mazad")} required />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label htmlFor="email-id-vertical">{t("Avocat")}</label>
                              <input type="number" id="email-id-vertical" className="form-control" name="email-id" placeholder={t("prix mazad")} required />
                            </div>
                          </div>
                          <div className="col-12">
                            <label>{t("Produits")}</label>
                            <div className="form-group">
                              <select className="choices form-select">
                                <option value="square">{t("Square")}</option>
                                <option value="rectangle">{t("Rectangle")}</option>
                                <option value="rombo">{t("Rombo")}</option>
                                <option value="romboid">{t("Romboid")}</option>
                                <option value="trapeze">{t("Trapeze")}</option>
                                <option value="traible">{t("Triangle")}</option>
                                <option value="polygon">{t("Polygon")}</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-12">
                            <label>{t("Ville")}</label>
                            <fieldset className="form-group">
                              <select className="form-select" id="basicSelect" required>
                                <option>{t("Sousse")}</option>
                                <option>{t("Gafsa")}</option>
                                <option>{t("Tunis")}</option>
                                <option>{t("Ariana")}</option>
                                <option>{t("Béja")}</option>
                                <option>{t("Ben Arous")}</option>
                                <option>{t("Bizerte")}</option>
                                <option>{t("Gabes")}</option>
                                <option>{t("Jendouba")}</option>
                                <option>{t("Kairouan")}</option>
                                <option>{t("Kasserine")}</option>
                                <option>{t("Kebili")}</option>
                                <option>{t("La Manouba")}</option>
                                <option>{t("Le Kef")}</option>
                                <option>{t("Mahdia")}</option>
                                <option>{t("Médenine")}</option>
                                <option>{t("Monastir")}</option>
                                <option>{t("Nabeul")}</option>
                                <option>{t("Sfax")}</option>
                                <option>{t("Sidi Bouzid")}</option>
                                <option>{t("Siliana")}</option>
                                <option>{t("Tataouine")}</option>
                                <option>{t("Tozeur")}</option>
                                <option>{t("Zaghouan")}</option>
                              </select>
                            </fieldset>
                          </div>
                          <br/>
                            <br/>
                            <br/>
                            <br/>
                          <div className="col-12 d-flex justify-content-end">
                            <button type="reset" className="btn btn-secondary me-1 mb-1">
                              {t("Annuler")}
                            </button>
                            <Link to={"/configuration"} type="stubmi" className="btn btn-primary me-1 mb-1">
                              <a style={{ color: 'white' }}>{t("Suivant")}</a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EnchèreEdit;
