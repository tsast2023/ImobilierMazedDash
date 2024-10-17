import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Table, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from 'axios';

const ProdList = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [starClicked, setStarClicked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1212);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/products/all");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const deleteItem = (productId) => {
    console.log("Item deleted:", productId);
  };

  const handleDelete = (productId) => {
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
        deleteItem(productId);
        Swal.fire({
          title: "Supprimer",
          text: "Votre élément est Supprimé :)",
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

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(currentProduct);
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
              products.map((product, index) => (
                <Table responsive="sm" key={index}>
                  <tbody>
                    <tr>
                      <td>{t("Image")}</td>
                      <td>
                        {/* Map through galerie to display all images */}
                        {product.galerie && product.galerie.length > 0 ? (
                          product.galerie.map((image, imgIndex) => (
                            <img key={imgIndex} className="imgtable" src={image} alt={`img-${imgIndex}`} />
                          ))
                        ) : (
                          <img className="imgtable" src="./Mazed.jpg" alt="default" />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Réf")}</td>
                      <td>{product.reference}</td>
                    </tr>
                    <tr>
                      <td>{t("Libellé")}</td>
                      <td>{product.libelleProductFr}</td>
                    </tr>
                    <tr>
                      <td>{t("Stock initial")}</td>
                      <td>{product.stockInitiale}</td>
                    </tr>
                    <tr>
                      <td>{t("Prix")}</td>
                      <td>{product.prixPrincipale}</td>
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
                        <button className="btn btn-outline block" onClick={() => handleEditClick(product)}>
                          <i className="fa-solid fa-pen-to-square font-medium-1"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Supprimer")}</td>
                      <td>
                        <i className="fa-solid fa-trash deleteIcon font-medium-1" onClick={() => handleDelete(product.id)}></i>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Désactiver")}</td>
                      <td>
                        <i className="fa-solid fa-ban blockIcon"></i>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Mettre à l'une")}</td>
                      <td>
                        {starClicked ? (
                          <i className="fa-solid fa-star arrowIcon" onClick={() => setStarClicked(!starClicked)}></i>
                        ) : (
                          <i className="fa-regular fa-star arrowIcon" onClick={() => setStarClicked(!starClicked)}></i>
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
                    <th>{t("Prix")}</th>
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
                        {/* Map through galerie to display all images */}
                        {product.galerie && product.galerie.length > 0 ? (
                          product.galerie.map((image, imgIndex) => (
                            <img key={imgIndex} className="imgtable" src={image} alt={`img-${imgIndex}`} />
                          ))
                        ) : (
                          <img className="imgtable" src="./Mazed.jpg" alt="default" />
                        )}
                      </td>
                      <td>{product.reference}</td>
                      <td>{product.libelleProductFr}</td>
                      <td>{product.stockInitiale}</td>
                      <td>{product.prixPrincipale}</td>
                      <td>
                        <button className="btn btn-secondary">{t("Publié")}</button>
                      </td>
                      <td>
                        <Link to="/prodDétail" className="btn btn-outline block">
                          <i className="fa-solid fa-eye font-medium-1"></i>
                        </Link>
                      </td>
                      <td>
                        <button className="btn btn-outline block" onClick={() => handleEditClick(product)}>
                          <i className="fa-solid fa-pen-to-square font-medium-1"></i>
                        </button>
                      </td>
                      <td>
                        <i className="fa-solid fa-trash deleteIcon font-medium-1" onClick={() => handleDelete(product.id)}></i>
                      </td>
                      <td>
                        <i className="fa-solid fa-ban blockIcon"></i>
                      </td>
                      <td>
                        {starClicked ? (
                          <i className="fa-solid fa-star arrowIcon" onClick={() => setStarClicked(!starClicked)}></i>
                        ) : (
                          <i className="fa-regular fa-star arrowIcon" onClick={() => setStarClicked(!starClicked)}></i>
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

      {/* Modal for editing */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Modifier le produit")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {/* Include your form fields here, prefilled with currentProduct data */}
            <div>
              <label>{t("Libellé")}</label>
              <input type="text" value={currentProduct ? currentProduct.libelleProductFr : ''} onChange={(e) => setCurrentProduct({ ...currentProduct, libelleProductFr: e.target.value })} />
            </div>
            {/* Add other form fields as necessary */}
            <Button variant="primary" type="submit">
              {t("Sauvegarder")}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProdList;
 