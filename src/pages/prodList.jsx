import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Table, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { GlobalState } from "../GlobalState";

const ProdList = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [starClicked, setStarClicked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [label, setLabel] = useState("");
  const [image, setImage] = useState(null);
  const [initialStock, setInitialStock] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]); // State to hold product data
  const { Products } = useContext(GlobalState);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1212);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch all products from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/products/all");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(); // Call the function to fetch products
  }, []);

  const deleteItem = () => {
    // Implement your delete logic here
    console.log("Item deleted");
  };

  const handleDelete = () => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      text: t("Une fois supprimé(e), vous ne pourrez pas récupérer cet élément !"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b0210e",
      confirmButtonText: t("Oui, supprimez-le !"),
      cancelButtonText: t("Non, annuler !")
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem();
        Swal.fire({
          title: "Supprimer",
          text: "Votre élément est Supprimer :)",
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

  const handleBan = () => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b0210e",
      confirmButtonText: t("Oui, désactivez-le !"),
      cancelButtonText: t("Non, annuler !")
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(); // Replace with your deactivate logic
        Swal.fire({
          title: "Desactiver",
          text: "Votre élément est Desactiver :)",
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

  const handleArrowClick = () => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b0210e",
      confirmButtonText: t("Oui, mettre à l'une !"),
      cancelButtonText: t("Non, annuler !")
    }).then((result) => {
      if (result.isConfirmed) {
        // Toggle starClicked state
        setStarClicked(!starClicked);
        Swal.fire({
          title: "Effectuer",
          text: "Votre élément est Effectuer :)",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // like sending data to a server.
    console.log({
      label,
      image,
      initialStock,
      currentStock,
      color,
      description,
    });
    // You can add further logic here, like closing the modal after successful submission
    setShowEditModal(false);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEditClick = () => {
    // Show the edit modal
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    // Close the edit modal
    setShowEditModal(false);
  };

  return (
    <div className="content-container">
      <section className="section">
        <div className="card">
          <div className="card-header">
            <h2 className="new-price">{t("Listes des Produits")}</h2>
          </div>
          <div className="card-body">
            {isMobile ? (
              products.map((product, index) => ( // Display each product in mobile view
                <Table responsive="sm" key={index}>
                  <tbody>
                    <tr>
                      <td>{t("Image")}</td>
                      <td>
                        <img className="imgtable" src={product.image || "./Mazed.jpg"} alt="img" />
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Réf")}</td>
                      <td>{product.ref}</td>
                    </tr>
                    <tr>
                      <td>{t("Libellé")}</td>
                      <td>{product.label}</td>
                    </tr>
                    <tr>
                      <td>{t("Stock initial")}</td>
                      <td>{product.initialStock}</td>
                    </tr>
                    <tr>
                      <td>{t("Stock actuel")}</td>
                      <td>{product.currentStock}</td>
                    </tr>
                    <tr>
                      <td>{t("Statut")}</td>
                      <td>
                        <button className="btn btn-secondary">{t("Publié")}</button>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Détail")}</td>
                      <td>
                        <Link to="/prodDétail" className="btn btn-outline block">
                          <i className="fa-solid fa-eye font-medium-1"></i>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Modifier")}</td>
                      <td>
                        <button className="btn btn-outline block" onClick={handleEditClick}>
                          <i className="fa-solid fa-pen-to-square font-medium-1"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Supprimer")}</td>
                      <td>
                        <i className="fa-solid fa-trash deleteIcon font-medium-1" onClick={handleDelete}></i>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Désactiver")}</td>
                      <td>
                        <i className="fa-solid fa-ban blockIcon" onClick={handleBan}></i>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Mettre à l'une")}</td>
                      <td>
                        {starClicked ? (
                          <i className="fa-solid fa-star arrowIcon" onClick={handleArrowClick}></i>
                        ) : (
                          <i className="fa-regular fa-star arrowIcon" onClick={handleArrowClick}></i>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              ))
            ) : (
              <Table responsive="sm">
                <thead>
                  <tr>
                    <th>{t("Image")}</th>
                    <th>{t("Réf")}</th>
                    <th>{t("Libellé")}</th>
                    <th>{t("Stock initial")}</th>
                    <th>{t("Stock actuel")}</th>
                    <th>{t("Statut")}</th>
                    <th>{t("Détail")}</th>
                    <th>{t("Modifier")}</th>
                    <th>{t("Supprimer")}</th>
                    <th>{t("Désactiver")}</th>
                    <th>{t("Mettre à l'une")}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <img className="imgtable" src={product.image || "./Mazed.jpg"} alt="img" />
                      </td>
                      <td>{product.ref}</td>
                      <td>{product.label}</td>
                      <td>{product.initialStock}</td>
                      <td>{product.currentStock}</td>
                      <td>
                        <button className="btn btn-secondary">{t("Publié")}</button>
                      </td>
                      <td>
                        <Link to="/prodDétail" className="btn btn-outline block">
                          <i className="fa-solid fa-eye font-medium-1"></i>
                        </Link>
                      </td>
                      <td>
                        <button className="btn btn-outline block" onClick={handleEditClick}>
                          <i className="fa-solid fa-pen-to-square font-medium-1"></i>
                        </button>
                      </td>
                      <td>
                        <i className="fa-solid fa-trash deleteIcon font-medium-1" onClick={handleDelete}></i>
                      </td>
                      <td>
                        <i className="fa-solid fa-ban blockIcon" onClick={handleBan}></i>
                      </td>
                      <td>
                        {starClicked ? (
                          <i className="fa-solid fa-star arrowIcon" onClick={handleArrowClick}></i>
                        ) : (
                          <i className="fa-regular fa-star arrowIcon" onClick={handleArrowClick}></i>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </section>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Modifier le produit")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="label" className="form-label">{t("Libellé")}</label>
              <input
                type="text"
                className="form-control"
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">{t("Image")}</label>
              <input
                type="file"
                className="form-control"
                id="image"
                onChange={handleImageChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="initialStock" className="form-label">{t("Stock initial")}</label>
              <input
                type="number"
                className="form-control"
                id="initialStock"
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="currentStock" className="form-label">{t("Stock actuel")}</label>
              <input
                type="number"
                className="form-control"
                id="currentStock"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="color" className="form-label">{t("Couleur")}</label>
              <input
                type="color"
                className="form-control"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">{t("Description")}</label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button variant="primary" type="submit">
              {t("Soumettre")}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProdList;
