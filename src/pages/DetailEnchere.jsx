import React, { useState, useEffect, useContext } from "react";
import "../css/DetailEnchere.css";
import { Link } from "react-router-dom";
import "../css/DetailEnchere.css";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import { GlobalState } from "../GlobalState";
import axios from "axios";
import Cookies from "js-cookie";

function DetailEnchere(props) {
  const token = Cookies.get("token");
  const state = useContext(GlobalState);
  const users = state.Users?.content;
  console.log(users)
  const participants = [
    ...props.selectedItem.participantIds
  ];
  console.log("participants;",participants)
  console.log("enchereDetail" , props.selectedItem)
  const filteredUsers = users?.filter((user) => participants.includes(user.id));
  console.log("filteredUsers ===" , filteredUsers)
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGan, setselectedGan] = useState();
  const [selectedEnch, setselectedEnch] = useState();
  const [additionalTables, setAdditionalTables] = useState([]);
  const [newTableData, setNewTableData] = useState({
    datePayement: "",
    montantPayer: 0,
    enchereId: props.selectedItem.id,
    encherissementId: "",
    typepaiement: "CASH",
  });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log(participants, filteredUsers);
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
  const funModal = (user, enchere, encherissmentId) => {
    setselectedGan(user);
    setShowModal(true);
    setselectedEnch(enchere);
    console.log(encherissmentId);
    setNewTableData({ ...newTableData, encherissementId: encherissmentId });
  };

  const approverUser = async (enchereId, userId) => {
    try {
      const res = await axios.post(
        `http://localhost:8081/api/bid/approve/${enchereId}/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTable = () => {
    setAdditionalTables([
      ...additionalTables,
      {
        id: additionalTables.length + 1,
        data: [
          { label: t("Date de paiement"), value: newTableData.date },
          { label: t("Montant à payer"), value: newTableData.montantPayer },
          { label: t("Montant restant"), value: newTableData.montantRestant },
          {
            label: t("Montant à payer chaque mois"),
            value: newTableData.montantChaqueMois,
          },
        ],
      },
    ]);
    setShowModal(false);
    setNewTableData({
      date: "",
      montantPayer: "",
      montantRestant: "",
      montantChaqueMois: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTableData({ ...newTableData, [name]: value });
  };

  const handleDelete = () => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      text: t(
        "Une fois supprimé(e), vous ne pourrez pas récupérer cet élément !"
      ),
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
        Swal.fire(
          t("Supprimé(e) !"),
          t("Votre élément a été supprimé."),
          "secondary"
        );
      } else {
        Swal.fire(t("Annulé"), t("Votre élément est en sécurité :)"), "error");
      }
    });
  };

  useEffect(() => {
    const imgs = document.querySelectorAll(".img-select a");
    const imgBtns = [...imgs];
    let imgId = 1;

    imgBtns.forEach((imgItem) => {
      imgItem.addEventListener("click", (event) => {
        event.preventDefault();
        imgId = imgItem.dataset.id;
        slideImage();
      });
    });

    function slideImage() {
      const displayWidth = document.querySelector(
        ".img-showcase img:first-child"
      )?.clientWidth;

      if (displayWidth) {
        document.querySelector(".img-showcase").style.transform = `translateX(${
          -(imgId - 1) * displayWidth
        }px)`;
      }
    }

    window.addEventListener("resize", slideImage);

    // Cleanup function
    return () => {
      imgBtns.forEach((imgItem) => {
        imgItem.removeEventListener("click", slideImage);
      });
      window.removeEventListener("resize", slideImage);
    };
  }, []);

  const [mainImage, setMainImage] = useState(props.selectedItem.productMazed.galerie[0]);
  const addEcheance = async (e) => {
    console.log(newTableData);
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8081/api/bid/updateHighestBidder?datePayement=${newTableData.datePayement}&montantPayer=${newTableData.montantPayer}&enchereId=${newTableData.enchereId}&encherissementId=${newTableData.encherissementId}&enchereId=${newTableData.enchereId}&typepaiement=${newTableData.typepaiement}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="content-container">
       <button className="GoBack" onClick={() => window.location.reload()}>
      <svg
        height="16"
        width="16"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 1024 1024"
      >
        <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
      </svg>
      <span>{t("Retour")}</span>
    </button>
      <div id="main">

      <section className="product-section">
          <div className="card-container">
            <div className="card">
              <div className="product-detail">
                {/* Product Images */}
                <div className="product-images">
                  <div className="main-image">
                    <img
                      src={mainImage}
                      alt="Product"
                      className="main-product-img"
                    />
                  </div>
                  <div className="thumbnail-images">
                    {props.selectedItem.productMazed.galerie.map((image, index) => (
                      <img
                        key={image}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setMainImage(image)}
                        className="thumbnail-img"
                      />
                    ))}
                  </div>
                </div>
                <div className="product-info">
                  <div className="info-header">
                    {/* REF and Number */}
                    <div className="product-ref">
                      <p>
                        {t("REF")} : {props.selectedItem.ref}
                      </p>
                    </div>
                    {/* Statut */}
                    <div
                      className={`status-content ${props.selectedItem.status.toLowerCase()}`}
                    >
                      <p className="status-label">
                        {props.selectedItem.status === "En_Cours"
                          ? t("En cours")
                          : props.selectedItem.status === "Ouverte"
                          ? t("Ouverte")
                          : t("Terminer")}
                      </p>
                    </div>
                  </div>
                  <div className="product-header">
                    <div className="product-name">
                      <h2>{props.selectedItem.productMazed.libelleProductFr || "Nom Produits"}</h2>
                    </div>
                    <div className="product-category">
                      <p>
                        {props.selectedItem.productMazed.categoryFille.libCategorie || "Nom Catégorie"}
                      </p>
                    </div>
                    <div className="product-description">
                      <p>{props.selectedItem.productMazed.descriptionFR || "Description"}</p>
                    </div>
                  </div>
                  <div className="product-price-info">
                    {/* Timer for "En Cours" */}
                    {props.selectedItem.status === "En_Cours" && (
                      <div className="timer">
                        <p className="timer-label">{t("Temps restant")}:</p>
                        <p className="time-value">00:30:00</p>{" "}
                        {/* This value should dynamically update */}
                      </div>
                    )}

                    {props.selectedItem.status === "En_Cours" ? (
                     <div className="info-container">
                     {/* Product Information Details */}
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-calendar-check"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Date Déclenchemant :</strong>
                       </p>
                       <p className="data">{props.selectedItem.datedeclenchement}</p>
                     </div>
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-calendar-xmark"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Date Fermeture :</strong>
                       </p>
                       <p className="data">{props.selectedItem.datefermeture}</p>
                     </div>
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-calendar-days"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Date Publication :</strong>
                       </p>
                       <p className="data">{props.selectedItem.datePublication}</p>
                     </div>
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-stopwatch-20"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Extension Time :</strong>
                       </p>
                       <p className="data">{props.selectedItem.extensionTime}(secondes)</p>
                     </div>
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-user-clock"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Numbre de Participant attendu :</strong>
                       </p>
                       <p className="data">{props.selectedItem.nombreParticipantAttendu}</p>
                     </div>
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-users"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Numbre de Participant réel :</strong>
                       </p>
                       <p className="data">{props.selectedItem.nombreParticipantréel}</p>
                     </div>
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-list-ol"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Valeur Majoration :</strong>
                       </p>
                       <p className="data">{props.selectedItem.valeurMajoration.join('/')}</p>
                     </div>
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-coins"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Autofinancement :</strong>
                       </p>
                       <p className="data">{props.selectedItem.autoFinancement}</p>
                     </div>
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-money-bill-transfer"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Facilité :</strong>
                       </p>
                       <p className="data">{props.selectedItem.valeurFacilité}</p>
                     </div>
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-hand-holding-dollar"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Cou de clic :</strong>
                       </p>
                       <p className="data">{props.selectedItem.coutClic}DT</p>
                     </div>
                     <div className="info-row">
                       <p>
                         <i
                           className="fa-solid fa-money-bill-trend-up"
                           style={{ marginRight: "8px" }}
                         ></i>
                         <strong>Frais d'inscription</strong>
                       </p>
                       <p className="data">{props.selectedItem.coutParticipation}DT</p>
                     </div>
                   </div>
                    ) : props.selectedItem.status === "Ouverte" ? (
                      <div className="info-container">
                        {/* Product Information Details */}
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-calendar-check"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Date Déclenchemant :</strong>
                          </p>
                          <p className="data">{props.selectedItem.datedeclenchement}</p>
                        </div>
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-calendar-xmark"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Date Fermeture :</strong>
                          </p>
                          <p className="data">{props.selectedItem.datefermeture}</p>
                        </div>
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-calendar-days"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Date Publication :</strong>
                          </p>
                          <p className="data">{props.selectedItem.datePublication}</p>
                        </div>
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-stopwatch-20"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Extension Time :</strong>
                          </p>
                          <p className="data">{props.selectedItem.extensionTime}(secondes)</p>
                        </div>
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-user-clock"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Numbre de Participant attendu :</strong>
                          </p>
                          <p className="data">{props.selectedItem.nombreParticipantAttendu}</p>
                        </div>
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-users"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Numbre de Participant réel :</strong>
                          </p>
                          <p className="data">{props.selectedItem.nombreParticipantréel}</p>
                        </div>
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-list-ol"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Valeur Majoration :</strong>
                          </p>
                          <p className="data">{props.selectedItem.valeurMajoration.join('/')}</p>
                        </div>
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-coins"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Autofinancement :</strong>
                          </p>
                          <p className="data">{props.selectedItem.autoFinancement}</p>
                        </div>
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-money-bill-transfer"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Facilité :</strong>
                          </p>
                          <p className="data">{props.selectedItem.valeurFacilité}</p>
                        </div>
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-hand-holding-dollar"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Cou de clic :</strong>
                          </p>
                          <p className="data">{props.selectedItem.coutClic}DT</p>
                        </div>
                        <div className="info-row">
                          <p>
                            <i
                              className="fa-solid fa-money-bill-trend-up"
                              style={{ marginRight: "8px" }}
                            ></i>
                            <strong>Frais d'inscription</strong>
                          </p>
                          <p className="data">{props.selectedItem.coutParticipation}DT</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="price-text">
                          {t("Prix Mazed online final")} :{" "}
                          {props.selectedItem.prixMazedOnline}DT
                        </p>
                        <p className="date-time">{t("Date/Heure")}</p>
                        <p>{t("Nom et Prénom")}</p>
                        <p>{t("Pseudo")}</p>
                        <p>{t("Numéro du téléphone")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <br />
        <br />
        <section className="section">
          <div className="card">
            <div className="card-header">
              <h2 className="new-price">{t("Liste des participants")}</h2>
            </div>
            <div className="card-body">
              <div className="table-responsive datatable-minimal">
                {isMobile ? (
                  <table className="table" id="table2">
                    <tbody>
                      {filteredUsers &&
                        filteredUsers.map((item) => (
                          <>
                            <tr>
                              <td>{t("Nom de famille")}</td>
                              <td>Thamer</td>
                            </tr>
                            <tr>
                              <td>{t("Prénom")}</td>
                              <td>Seif</td>
                            </tr>
                            <tr>
                              <td>{t("Pseudo")}</td>
                              <td>Clubisty</td>
                            </tr>
                            <tr>
                              <td>{t("Numéro du téléphone")}</td>
                              <td>(+1) 613 820 8838</td>
                            </tr>

                            <tr>
                              <td>{t("Nombre d'encheres y liées")}</td>
                              <td>69</td>
                            </tr>
                            <tr>
                              <td>{t("Lien Page Details")}</td>
                              <td>Lien</td>
                            </tr>
                          </>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="table" id="table2">
                    <thead>
                      <tr>
                        <th>{t("Nom de famille")}</th>
                        <th>{t("Prénom")}</th>
                        <th>{t("Pseudo")}</th>
                        <th>{t("Numéro du téléphone")}</th>
                        <th>{t("Nombre d'encheres y liées")}</th>
                        <th>{t("Détail")}</th>
                        {/* <th>{t("approuver")}</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers &&
                        filteredUsers.map((item) => (
                          <tr>
                            <td>{item.nomFamille}</td>
                            <td>{item.prenom}</td>
                            <td>{item.pseudo}</td>
                            <td>{item.numTel}</td>
                            <td>{item.mesEnchere?.length}</td>
                            <td>
                              <i className="fa-solid fa-eye font-medium-1"></i>
                            </td>
                            {/* {!props.selectedItem.participantSignéIds.includes(
                              item.id
                            ) ? (
                              <td>
                                <i
                                  onClick={() =>
                                    approverUser(props.selectedItem.id, item.id)
                                  }
                                  className="fa-solid fa-check font-medium-1"
                                ></i>
                              </td>
                            ) : (
                              <td>-</td>
                            )} */}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </section>
        <br />
        <br />
        {
          props.selectedItem.status === "En_Cours"?(
            <section className="section">
            <div className="card">
              <div className="card-header">
                <h2 className="new-price">{t("Liste des Enchèrissement")}</h2>
              </div>
              <div className="card-body">
                <div className="table-responsive datatable-minimal">
                  {isMobile ? (
                    <table className="table" id="table2">
                      <tbody>
                        {props.selectedItem &&
                          props.selectedItem.enchérissement?.length > 0 &&
                          props.selectedItem.enchérissement
                            .sort(
                              (a, b) =>
                                new Date(b.heureMajoration) -
                                new Date(a.heureMajoration)
                            ) // Sort by heureMajoration, newest first
                            .map((item) => (
                              <React.Fragment
                                key={item.id || item.participant.pseudo}
                              >
                                {" "}
                                {/* Use React.Fragment with a unique key */}
                                <tr>
                                  <td>{t("User")}</td>
                                  <td>
                                    <img
                                      style={{ borderRadius: "50px" }}
                                      className="imgtable"
                                      src="./Mazed.jpg"
                                      alt="img"
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>{t("Nom")}</td>
                                  <td>{item.participant.nomFamille}</td>
                                </tr>
                                <tr>
                                  <td>{t("Prénom")}</td>
                                  <td>{item.participant.prenom}</td>
                                </tr>
                                <tr>
                                  <td>{t("Pseudo")}</td>
                                  <td>{item.participant.pseudo}</td>
                                </tr>
                                <tr>
                                  <td>{t("Heure de majoration")}</td>
                                  <td>{item.heureMajoration}</td>
                                </tr>
                                <tr>
                                  <td>{t("Valeur Majoration")}</td>
                                  <td>{item.valeurMajorationUser}</td>
                                </tr>
                                <tr>
                                  <td>{t("Montant total")}</td>
                                  <td>{item.montantTot}</td>
                                </tr>
                                <tr>
                                  <td>{t("Gagnant")}</td>
                                  <td>
                                    <i
                                      className="fa-solid fa-trophy"
                                      onClick={() =>
                                        funModal(
                                          item.participant,
                                          item.enchere,
                                          item.id
                                        )
                                      }
                                    ></i>
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
                          <th>{t("User")}</th>
                          <th>{t("Nom")}</th>
                          <th>{t("Prénom")}</th>
                          <th>{t("Pseudo")}</th>
                          <th>{t("Heure de majoration")}</th>
                          <th>{t("Valeur Majoration")}</th>
                          <th>{t("Montant total")}</th>
                          <th>{t("Gagant")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {props.selectedItem &&
                          props.selectedItem.enchérissement?.length > 0 &&
                          props.selectedItem.enchérissement
                            .sort(
                              (a, b) =>
                                new Date(b.heureMajoration) -
                                new Date(a.heureMajoration)
                            ) // Sort by heureMajoration, newest first
                            .map((item) => (
                              <tr key={item.id || item.participant.pseudo}>
                                {" "}
                                {/* Add a unique key prop */}
                                <td>
                                  <img
                                    style={{ borderRadius: "50px" }}
                                    className="imgtable"
                                    src="./Mazed.jpg"
                                    alt="img"
                                  />
                                </td>
                                <td>{item.participant.nomFamille}</td>
                                <td>{item.participant.prenom}</td>
                                <td>{item.participant.pseudo}</td>
                                <td>{item.heureMajoration}</td>
                                <td>{item.valeurMajorationUser}</td>
                                <td>{item.montantTot}</td>
                                <td>
                                  <i
                                    className="fa-solid fa-trophy"
                                    onClick={() =>
                                      funModal(
                                        item.participant,
                                        item.enchere,
                                        item.id
                                      )
                                    }
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
          ):(
            <></>
          )
        }

      </div>
      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Ajouter Echéance")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addEcheance}>
            <Form.Group>
              <Form.Label>{t("Type de payement")}</Form.Label>
              <Form.Control
                as="select"
                name="typepaiement"
                value={newTableData.selectedOption}
                onChange={handleInputChange}
              >
                <option value="CASH">{t("CASH")}</option>
                <option value="ParFacilité">{t("ParFacilité")}</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Date de paiement")}</Form.Label>
              <Form.Control
                type="datetime-local"
                name="datePayement"
                value={newTableData.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Montant à payer")}</Form.Label>
              <Form.Control
                type="number"
                name="montantPayer"
                value={newTableData.montantPayer}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                {t("Annuler")}
              </Button>
              <Button type="submit" variant="primary">
                {t("Ajouter")}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DetailEnchere;
