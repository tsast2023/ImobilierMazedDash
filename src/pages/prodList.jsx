import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Table, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ReactPaginate from "react-paginate";

const ProdList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [starClicked, setStarClicked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default number of items per page
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Update current page
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value)); // Update items per page
    setCurrentPage(0); // Reset to first page when items per page changes
  };

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
        console.log("products ===" , response.data)
        setPageCount(Math.ceil(response.data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [itemsPerPage]);

  const deleteItem = async (productId) => {
    try {
      await axios.delete(`http://localhost:8082/api/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId)); // Update state to remove deleted item
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleDelete = (product) => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      text: t("Une fois supprimé(e), vous ne pourrez pas récupérer cet élément !") + ` (${product.libelleProductFr})`,
      icon: "warning",
      input: 'text',
      inputPlaceholder: t("Tapez 'SUPPRIMER' pour confirmer"),
      showCancelButton: true,
      confirmButtonColor: "#b0210e",
      confirmButtonText: t("Oui, supprimez-le !"),
      cancelButtonText: t("Non, annuler !"),
      preConfirm: (inputValue) => {
        if (inputValue !== 'SUPPRIMER') {
          Swal.showValidationMessage(
            t("Veuillez taper 'SUPPRIMER' pour confirmer.")
          );
        }
        return inputValue;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(product.id);
        Swal.fire({
          title: "Supprimer",
          text: t("Votre élément est Supprimé :)"),
          icon: "success",
          confirmButtonColor: "#b0210e",
        });
      } else {
        Swal.fire({
          title: "Annulé",
          text: t("Votre élément est en sécurité :)"),
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

  const handleDeactivate = (product) => {
    Swal.fire({
      title: t("Êtes-vous sûr(e) ?"),
      text: t("Êtes-vous sûr de vouloir désactiver ce produit ?") + ` (${product.libelleProductFr})`,
      icon: "warning",
      input: 'text',
      inputPlaceholder: t("Tapez 'DÉSACTIVER' pour confirmer"),
      showCancelButton: true,
      confirmButtonColor: "#b0210e",
      confirmButtonText: t("Oui, désactivez-le !"),
      cancelButtonText: t("Non, annuler !"),
      preConfirm: (inputValue) => {
        if (inputValue !== 'DÉSACTIVER') {
          Swal.showValidationMessage(
            t("Veuillez taper 'DÉSACTIVER' pour confirmer.")
          );
        }
        return inputValue;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Call deactivate function (assuming an API exists for this)
        Swal.fire({
          title: "Désactiver",
          text: t("Votre produit est Désactivé :)"),
          icon: "success",
          confirmButtonColor: "#b0210e",
        });
      } else {
        Swal.fire({
          title: "Annulé",
          text: t("Votre produit est toujours actif :)"),
          icon: "error",
          confirmButtonColor: "#b0210e",
        });
      }
    });
  };

  return (
    <div className="content-container">
      <section className="section">
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 className="new-price">{t("Liste des Produits")}</h2>
            <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <label htmlFor="itemsPerPage" style={{ marginRight: "10px" }}>
                  <h6>{t("Items par page:")}</h6>
                </label>
                <select
                  className="itemsPerPage"
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>
          </div>

          {/* Pagination component at the top */}
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
            className="react-paginate"
          />

          <div className="card-body">
            {isMobile ? (
              products.map((product, index) => (
                <Table responsive="sm" key={index}>
                  <tbody>
                    <tr>
                      <td>{t("Image")}</td>
                      <td>
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
                  <a
                    onClick={() =>
                      navigate(`/prodDétail/${product.id}`, { state: { product } })
                    }
                  >
                    <i className="fa-solid fa-eye"></i>
                  </a>
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
                        <button className="btn btn-outline block" onClick={() => handleDelete(product)}>
                          <i className="fa-solid fa-trash font-medium-1"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Désactiver")}</td>
                      <td>
                        <button className="btn btn-outline block" onClick={() => handleDeactivate(product)}>
                          <i className="fa-solid fa-power-off font-medium-1"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>{t("Mettre à l'une")}</td>
                      <td>
                        <button className="btn btn-outline block" onClick={() => setStarClicked(!starClicked)}>
                          <i className="fa-solid fa-star font-medium-1"></i>
                        </button>
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
                <a
                  onClick={() =>
                    navigate(`/prodDétail/${product.id}`, { state: { product } })
                  }
                >
                  <i className="fa-solid fa-eye"></i>
                </a>
              </td>
                      <td>
                        <button className="btn btn-outline block" onClick={() => handleEditClick(product)}>
                          <i className="fa-solid fa-pen-to-square font-medium-1"></i>
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-outline block" onClick={() => handleDelete(product)}>
                          <i className="fa-solid fa-trash font-medium-1"></i>
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-outline block" onClick={() => handleDeactivate(product)}>
                          <i className="fa-solid fa-power-off font-medium-1"></i>
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-outline block" onClick={() => setStarClicked(!starClicked)}>
                          <i className="fa-solid fa-star font-medium-1"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>

          {/* Pagination component at the bottom */}
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
            className="react-paginate"
          />
        </div>
      </section>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Modifier le produit")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {/* Your edit form fields go here */}
            <button type="submit">{t("Enregistrer les modifications")}</button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProdList;
