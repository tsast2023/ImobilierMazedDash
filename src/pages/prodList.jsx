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
  const [currentProduct, setCurrentProduct] = useState(null);
  const [products, setProducts] = useState([]); // State to hold product data

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

  const deleteItem = (productId) => {
    // Implement your delete logic here using productId
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
    setCurrentProduct(product); // Set the current product for editing
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentProduct(null); // Clear the current product
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // like sending updated data to a server.
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
                        <img className="imgtable" src={product.galerie[0] || "./Mazed.jpg"} alt="img" />
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
                        <img className="imgtable" src={product.galerie[0] || "./Mazed.jpg"} alt="img" />
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

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Modifier le produit")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentProduct && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="libelleProductFr" className="form-label">{t("Libellé")}</label>
                <input
                  type="text"
                  className="form-control"
                  id="libelleProductFr"
                  value={currentProduct.libelleProductFr}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, libelleProductFr: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="prixPrincipale" className="form-label">{t("Prix")}</label>
                <input
                  type="number"
                  className="form-control"
                  id="prixPrincipale"
                  value={currentProduct.prixPrincipale}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, prixPrincipale: e.target.value })}
                />
              </div>
              {/* Add more fields as necessary */}
              <Button variant="primary" type="submit">{t("Sauvegarder")}</Button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProdList;
