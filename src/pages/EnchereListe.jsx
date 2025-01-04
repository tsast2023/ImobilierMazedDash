import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { Table } from "react-bootstrap";
import { GlobalState } from "../GlobalState";
import "../css/DetailEnchere.css";
import "../css/DetailEnchere.css";
import { Modal, Button, Form } from "react-bootstrap";
import DetailEnchere from "./DetailEnchere";
import axios from "axios";
import EnchèreEdit from "./EnchèreEdit";
import Cookies from "js-cookie";
import Configuration from "./configuration";
import { toast } from "react-toastify";
import ReactPaginate from 'react-paginate';

function EnchereListe() {
  const token = Cookies.get("token");
  const { t, i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [steps, setSteps] = useState(0);
  const [selectedItem, setSelectedItem] = useState();
  const state = useContext(GlobalState);
  const encheres = state.Bids;
  const user = state.Me
  const {
    statusBid,
    setStatusBid,
    size,
    setSize,
    nomCategorie ,
    setNomCategorie,
    nomProduit ,
    setNomProduit,
    ville,
    setVille,
    pageBid,
    setPageBid
  } =useContext(GlobalState)
  const [showPlanifierModal, setShowPlanifierModal] = useState(false);
  const [NumberMois, setNumberMois] = useState();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1400);
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePageChange = (selectedPage) => {
    setPageBid(selectedPage.selected);
    console.log(pageBid) // React Paginate is 0-indexed, so we add 1
  };
  useEffect(() => {}, [i18n.language]);
  const getEnchereName = (cat) => {
    console.log( "cat ====" , cat)
    switch (i18n.language) {
      case "ar":
        return cat.productMazed.libelleProductAr || "";
      case "en":
        return cat.productMazed.libelleProductEn || "";
      case "fr":
      default:
        return cat.productMazed.libelleProductFr || "";
    }
  };

  const Désépingler = async () => {
    toast.success("Success message!");
    window.location.reload();
  };
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8082/api/bid/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
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
        deleteItem(id);
        Swal.fire({
          title: "Supprimer",
          text: "Votre élément est Supprimer:)",
          icon: "Succes",
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

  const handleDel = (id, itemName) => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      text: t(
        `Pour confirmer, veuillez saisir le nom de l'élément "${itemName}"  à supprimer :`
      ),
      input: "text",
      inputPlaceholder: t("Entrez le nom de l'élément ici..."),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: t("Oui, supprimez-le !"),
      cancelButtonText: t("Non, annuler !"),
      closeOnConfirm: false,
      closeOnCancel: false,
      preConfirm: (inputValue) => {
        if (inputValue !== itemName) {
          Swal.showValidationMessage(
            t("Le nom de l'élément saisi est incorrect.")
          );
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(id);
        Swal.fire({
          title: t("Supprimer"),
          text: t("Votre élément a été supprimé avec succès."),
          icon: "success",
          confirmButtonColor: "#b0210e",
        }).then(() => {
          window.location.reload(); // Reload after deletion
        });
      } else {
        Swal.fire({
          title: t("Annulé"),
          text: t("Votre élément est en sécurité :)"),
          icon: "error",
          confirmButtonColor: "#b0210e",
        });
      }
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [additionalTables, setAdditionalTables] = useState([]);
  const [newTableData, setNewTableData] = useState({
    date: "",
    montantPayer: "",
    montantRestant: "",
    montantChaqueMois: "",
  });

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

  const product = {
    title: "Sample Product",
    description:
      "This is a sample product description. It provides details about the product features and benefits.",
    price: 99.99,
    stock: 20,
    images: [
      "https://via.placeholder.com/600x400",
      "https://via.placeholder.com/600x400/ff7f7f",
      "https://via.placeholder.com/600x400/7f7fff",
      "https://via.placeholder.com/600x400/7fff7f",
    ],
  };

  const [mainImage, setMainImage] = useState(product.images[0]);

  const confirmAction = (actionType) => {
    Swal.fire({
      title: t("Êtes-vous sûr?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b0210e",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non, annuler!"),
    }).then((result) => {
      if (result.isConfirmed) {
        let message;
        switch (actionType) {
          case "Désactiver":
            message = t("L'élément a été désactivé");
            break;
          case "Supprimé":
            message = t("L'élément a été supprimé");
            break;
          case "Terminé":
            message = t("L'élément a été ajouté");
            break;
          default:
            message = t("Action terminée");
        }
        Swal.fire(
          t(actionType.charAt(0).toUpperCase() + actionType.slice(1)),
          message,
          "success"
        );
      }
    });
  };
  const AnnulerBid = async (id) => {
    
      if (user.roleAdmin.name === "Super admin") {
        try {
          const res = await axios.post(
            `http://localhost:8082/api/bid/annuler/${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      }else{
        try {
          const res = await axios.post(
            `http://localhost:8082/api/demandes/creerDemandeAnnulation?enchereId=${id}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(res.data);
        } catch (error) {
          console.log(error);
        }
      }
      
  };
  return (
    <>
      {steps === 0 && (
        <div className="content-container">
          <div id="main">
            <header className="mb-3">
              <a href="#" className="burger-btn d-block d-xl-none">
                <i className="bi bi-justify fs-3" />
              </a>
            </header>
            <section className="section">
              <div className="card">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  className="card-header"
                >
                  <h2 className="new-price">{t("Liste d'enchére")}</h2>
                </div>
                <div className="card-body">
                  <div className="row ">
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="recherche">
                          <h6>{t("Nom Produit")}</h6>
                        </label>
                        <input required value={nomProduit} onChange={e=>setNomProduit(e.target.value)} id="recherche" className="form-control" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <label htmlFor="recherche">
                          <h6>{t("Nom Catégorie")}</h6>
                        </label>
                        <input required value={nomCategorie} onChange={e=>setNomCategorie(e.target.value)} id="recherche" className="form-control" />
                      </div>
                    </div>
                    <div className="col-6 form-group">
                      <h6>{t("Ville")}</h6>
                      <select value={ville} onChange={e=>setVille(e.target.value)} className="choices form-select">
                        <option   selected></option>
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
                    </div>
                    <div className="col-6 form-group">
                      <h6>{t("Statut")}</h6>
                      <select value={statusBid} onChange={e=>setStatusBid(e.target.value)} className="choices form-select">
                        <option  selected></option>
                        <option value="Brouillon">{t("Brouillon")}</option>
                        <option value="Ouverte">{t("Ouverte")}</option>
                        <option value="En_cours">{t("En cours")}</option>
                        <option value="Cachée">{t("Cachée")}</option>
                        <option value="Annulée">{t("Annulée")}</option>
                      </select>
                    </div>
                    <div className="col-4 form-group">
          <h6>{t("nombre des pages")}</h6>
          <input type="text" value={size} onChange={e=>setSize(e.target.value)} className="form-control" />
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
                    <Table responsive="sm">
                      <tbody>
                        {encheres &&
                          encheres.content?.map((item) => (
                            <>
                              <tr>
                                <td>{t("Produit")}</td>
                                <td className="text-bold-500">
                                  {getEnchereName(item)}
                                </td>
                              </tr>
                              <tr>
                                <td>{t("Prix")}</td>
                                <td>{item.prixMazedOnline}</td>
                              </tr>
                              <tr>
                                <td>{t("Nb de Participant")}</td>
                                <td className="text-bold-500">
                                  {item.nombreParticipantréel}
                                </td>
                              </tr>
                              <tr>
                                <td>{t("Date de Publication")}</td>
                                <td className="text-bold-500">
                                  {item.createdAt.split("T")[0]}
                                </td>
                              </tr>
                              <tr>
                                <td>{t("Date de Déclenchement")}</td>
                                <td>{item.datedeclenchement}</td>
                              </tr>
                              <tr>
                                <td>{t("Statut")}</td>
                                <td>
                                  <a
                                    href="#"
                                    className={
                                      item.status === "Brouillon"
                                        ? "btn btn-secondary"
                                        : item.status === "Ouverte"
                                        ? "btn btn-success"
                                        : item.status == "En_Cours"
                                        ? "btn btn-primary"
                                        : "btn btn-dark"
                                    }
                                  >
                                    {t(item.status)}
                                  </a>
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
                                    <a
                                      onClick={() => {
                                        setSelectedItem(item);
                                        setSteps(1);
                                      }}
                                      className="btn"
                                    >
                                      <i className="fa-solid fa-eye"></i>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>{t("Modifier")}</td>
                                <td>
                                  <div className="buttons">
                                    <a
                                      onClick={() => {
                                        localStorage.setItem(
                                          "idenchere",
                                          item.id
                                        );
                                        setSteps(3);
                                      }}
                                      className="btn"
                                    >
                                      <i className="fa-solid fa-pen-to-square"></i>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>{t("Supprimer")}</td>
                                <td>
                                  <div className="buttons">
                                    <a className="btn">
                                      <i
                                        onClick={() => handleDel(item.id , getEnchereName(item))}
                                        className="fa-solid fa-trash"
                                      ></i>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>{t("Annuler")}</td>
                                <td>
                                  <div className="buttons">
                                    <a className="btn">
                                      <i
                                        onClick={() => AnnulerBid(item.id)}
                                        className="fa-solid fa-close"
                                      ></i>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>{t("Épingler")}</td>
                                <td>
                                  <div className="buttons">
                                    <a className="btn">
                                      <i className="fa-solid fa-thumbtack"></i>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td>{t("Désépingler")}</td>
                                <td>
                                  <div className="buttons">
                                    <a className="btn">
                                      <i
                                        className="fa-solid fa-link-slash"
                                        onClick={setShowPlanifierModal}
                                      ></i>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            </>
                          ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Table responsive="sm">
                      <thead>
                        <tr className="customTr">
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
                          <th>{t("Annuler")}</th>
                          <th>{t("Épingler")}</th>
                          <th>{t("Désépingler")}</th>
                        </tr>
                      </thead>
                      <tbody className="customTb">
                        {encheres &&
                          encheres?.content?.map((item) => (
                            <tr>
                              <td className="text-bold-500">
                                {getEnchereName(item)}
                              </td>
                              <td>{item.prixMazedOnline}</td>
                              <td className="text-bold-500">
                                {item.nombreParticipantréel}
                              </td>
                              <td className="text-bold-500">
                                {item.createdAt.split("T")[0]}
                              </td>
                              <td>{item.datedeclenchement}</td>
                              <td>
                                <a
                                  href="#"
                                  className={
                                    item.status === "Brouillon"
                                      ? "btn btn-secondary"
                                      : item.status === "Ouverte"
                                      ? "btn btn-success"
                                      : item.status == "En_Cours"
                                      ? "btn btn-primary"
                                      : "btn btn-dark"
                                  }
                                >
                                  {t(item.status)}
                                </a>
                              </td>
                              <td>
                                {item.status === "Brouillon" ? (
                                  <div className="buttons">
                                    <a
                                      onClick={() => {
                                        localStorage.setItem(
                                          "idenchere",
                                          item.id
                                        );
                                        setSteps(3);
                                      }}
                                      className="btn"
                                    >
                                      <i className="fas fa-cog"></i>
                                    </a>
                                  </div>
                                ) : (
                                  <i className="fas fa-check"></i>
                                )}
                              </td>
                              <td>
                                <div className="buttons">
                                  <a
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setSteps(1);
                                    }}
                                    className="btn"
                                  >
                                    <i className="fa-solid fa-eye"></i>
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className="buttons">
                                  <a
                                    onClick={() => {
                                      setSelectedItem(item);
                                      setSteps(2);
                                    }}
                                    className="btn"
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className="buttons">
                                  <a className="btn">
                                    <i
                                      onClick={() => handleDel(item.id , getEnchereName(item))}
                                      className="fa-solid fa-trash"
                                    ></i>
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className="buttons">
                                  <a className="btn">
                                    <i
                                      onClick={() => AnnulerBid(item.id)}
                                      className="fa-solid fa-close"
                                    ></i>
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className="buttons">
                                  <a className="btn">
                                    <i
                                      onClick={() => handleDel(item.id , getEnchereName(item))}
                                      className="fa-solid fa-thumbtack"
                                    ></i>
                                  </a>
                                </div>
                              </td>
                              <td>
                                <div className="buttons">
                                  <a className="btn">
                                    <i
                                      className="fa-solid fa-link-slash"
                                      onClick={setShowPlanifierModal}
                                    ></i>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
      <Modal
        show={showPlanifierModal}
        onHide={() => setShowPlanifierModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Nombre de mois")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-3">
            <label htmlFor="publicationDate">{t("Nombre de mois")}</label>
            <input
              type="number"
              id="publicationDate"
              className="form-control"
              onChange={(e) => setNumberMois(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowPlanifierModal(false)}>
            {t("Annuler")}
          </Button>
          <Button variant="secondary" onClick={Désépingler}>
            {t("Planifier")}
          </Button>
        </Modal.Footer>
      </Modal>
      {steps === 1 && <DetailEnchere selectedItem={selectedItem} />}
      {steps === 2 && <EnchèreEdit selectedItem={selectedItem} />}
      {steps === 3 && <Configuration selectedItem={selectedItem} />}
    </>
  );
}

export default EnchereListe;
