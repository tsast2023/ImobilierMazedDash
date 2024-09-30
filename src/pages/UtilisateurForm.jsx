import React from "react";
import { useTranslation } from "react-i18next";

function UtilisateurForm() {
  const { t } = useTranslation();

  return (
    <div className="content-container">
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3" />
          </a>
        </header>
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h2 className="new-price">{t("Ajouter un Utilisateur")}</h2>
            </div>
            <div className="card-content">
              <div className="card-body">
                <form className="form form-vertical">
                  <div className="form-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="nom">{t("Nom")}</label>
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control"
                              id="nom"
                              placeholder={t("Nom")}
                              maxLength={25}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="prenom">{t("Prénom")}</label>
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control"
                              id="prenom"
                              placeholder={t("Prénom")}
                              maxLength={25}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="prenom">{t("Pseudo")}</label>
                          <div className="position-relative">
                            <input
                              type="text"
                              className="form-control"
                              id="prenom"
                              placeholder={t("Pseudo")}
                              maxLength={25}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="email">{t("Email")}</label>
                          <div className="position-relative">
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              placeholder={t("Email")}
                              maxLength={25}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="phone-number">
                            {t("Numéro de téléphone")}
                          </label>
                          <div className="input-group mb-1 phone-input-group">
                            <input
                              type="text"
                              className="form-control"
                              id="phone-number"
                              aria-label="PhoneNumber"
                              defaultValue="+216"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="role">{t("Role")}</label>
                          <fieldset className="form-group mb-3">
                            <select className="form-select" id="role">
                              <option>{t("IT")}</option>
                              <option>{t("Blade Runner")}</option>
                              <option>{t("Thor Ragnarok")}</option>
                            </select>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-3"
                      >
                        {t("Annuler")}
                      </button>

                      <button type="button" className="btn btn-primary">
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
  );
}

export default UtilisateurForm;
