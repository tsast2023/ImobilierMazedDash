import React, { useState, useEffect } from "react";
import "../css/prod-detail.css";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

const ProductDetail = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
    // Get the location object
    const location = useLocation();

    useEffect(()=> {
      console.log("selectedColor" , selectedColor
     ) })
  
    // Access the cat object from the state
    const product = location.state && location.state.product;
    
    useEffect(()=>{
      console.log("product===" , location.state.product)
    })
    const [options , setOptions] = useState({})
    const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Si la couleur est sélectionnée, on récupère la galerie pour cette couleur
  const handleColorSelect = (colorCode) => {
    setSelectedColor(colorCode);

    // Reset selected option when color changes
    setSelectedOptions(null);

    // Set the first image from the gallery for the selected color
    const selectedGalerie = product.couleurDetails[colorCode]?.galerie || [];
    setMainImage(selectedGalerie[0]);
    setOptions(product.couleurDetails[colorCode]?.optionsColor || []);
  };

  const handleOptionSelect = (optionName, optionValue) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [optionName]: optionValue,
    }));

    // Update selected option and show price and stock details
    setSelectedOptions(optionValue);
  };

  // Si aucune couleur n'est sélectionnée, on utilise la galerie par défaut
  const galerieImages = selectedColor
    ? product.couleurDetails[selectedColor]?.galerie || []
    : product.galerie || []; 
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

  return (
    <>
    <div className="content-container">
    <div className="product-detail">
  <div className="product-images">
    <div className="main-image">
      <img src={mainImage || "default-image.jpg"} alt="Product" />
    </div>
    <div className="thumbnail-images">
      {galerieImages.length > 0 ? (
        galerieImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setMainImage(image)}
          />
        ))
      ) : (
        <p>Aucune image disponible pour cette couleur</p>
      )}
    </div>
  </div>

  <div className="product-info">
    <h1>{product.libelleProductFr}</h1>
    <p>
      <strong>Fournisseur:</strong> {product.fournisseur}
    </p>
    <p>{product.descriptionFR}</p>

    {/* Handle Color Selection */}
    {product.withColor && product.couleurDetails && (
      <div className="product-colors">
        <strong>Couleurs disponibles:</strong>
        <div className="color-list d-flex">
          {Object.keys(product.couleurDetails).map((colorCode, index) => (
            <div
              key={index}
              className="color-box"
              style={{
                backgroundColor: colorCode,
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                margin: "5px",
                border: selectedColor === colorCode ? "2px solid #000" : "1px solid #ccc"
              }}
              onClick={() => handleColorSelect(colorCode)}
              title={`Couleur: ${colorCode}`}
            ></div>
          ))}
        </div>
      </div>
    )}
{product.withOptions && selectedColor && (
  <div className="product-options">
    <strong className="options-title">Options disponibles:</strong>
    <div className="options-list d-flex">
      {product.couleurDetails[selectedColor]?.optionsColor &&
        Object.keys(product.couleurDetails[selectedColor].optionsColor).length > 0 ? (
        Object.keys(product.couleurDetails[selectedColor].optionsColor).map((optionKey, index) => {
          const sizes = product.couleurDetails[selectedColor].optionsColor[optionKey];
          return (
            <div key={index} className="option-box">
              <h4 className="option-title">{optionKey}</h4>
              <div className="size-options d-flex">
                {Object.keys(sizes).map((sizeKey, sizeIndex) => {
                  const size = sizes[sizeKey][0];  // Assuming each size array has a single object with stock and price data
                  return (
                    <div
                      key={sizeIndex}
                      className="size-option d-flex"
                      onClick={() => handleOptionSelect(optionKey, size)}
                    >
                      <div className="size-info">
                        <p className="size-name"><strong>{sizeKey}</strong></p>
                     
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      ) : (
        <p>Aucune option disponible pour cette couleur</p>
      )}
    </div>
  </div>
)}

  {selectedOptions && (
              <div className="selected-option-details">
                <p><strong>Prix:</strong> {selectedOptions.prix}€</p>
                <p><strong>Stock actuel:</strong> {selectedOptions.stockActuel}</p>
                <p><strong>Stock actuel:</strong> {selectedOptions.stockInitiale}</p>
              </div>
            )}



    {/* <p>
      <strong>Fournisseur:</strong> {product.fournisseur}
    </p>
    <p>{product.descriptionFR}</p> */}

    {/* Handle Stock Display */}
  

    {/* Action Buttons */}
    <div className="product-buttons">
      <button className="btn" onClick={() => confirmAction("Désactiver")}>
        {t("Désactiver")}
      </button>
      <button className="btn" onClick={() => confirmAction("Supprimé")}>
        {t("Supprimer")}
      </button>
      
      <Link to="/EnchèreCreation">
        <button className="btn">{t("Ajouter une enchère")}</button>
      </Link>
    </div>
  </div>
</div>

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
                      <a href="#" className="btn btn-secondary">
                        secondary
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>{t("Configuration")}</td>
                    <td>
                      <div className="buttons">
                        <Link to="/ConfigurationEnchere" className="btn">
                          <i className="fas fa-cog"></i>
                        </Link>
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
                      <a href="#" className="btn btn-secondary">
                        secondary
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-bold-500">Michael Right</td>
                    <td>$15/hr</td>
                    <td className="text-bold-500">UI/UX</td>
                    <td className="text-bold-500">Michael Right</td>
                    <td>$15/hr</td>
                    <td>
                      <a href="#" className="btn btn-secondary">
                        secondary
                      </a>
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </section>
      <br />
      <br />
      <section className="section">
      <div className="col-12">
              <div className="card">
                <div className="card-body">
                    <div className="card-header">
                      <h5 className="card-title">{t("Ventes")}</h5>
                    </div>
                      <div className="table-responsive datatable-minimal">
                        {isMobile ? (
                          <table className="table" id="table2">
                            <tbody>
                              <tr>
                                <td>{t("Le stock à l’entrée")}</td>
                                <td>500</td>
                              </tr>
                              <tr>
                                <td>{t("Le stock actuel")}</td>
                                <td>200</td>
                              </tr>
                              <tr>
                                <td>{t("Le prix de vente")}</td>
                                <td>20</td>
                              </tr>
                              <tr>
                                <td>{t("Les promotions")}</td>
                                <td>20%</td>
                              </tr>
                              <tr>
                                <td>{t("L’évaluation")}</td>
                                <td>Lorem</td>
                              </tr>
                              <tr>
                                <td>{t("Le nombre de visites sur produit")}</td>
                                <td>350</td>
                              </tr>
                            </tbody>
                          </table>
                        ) : (
                          <table className="table" id="table2">
                            <thead>
                              <tr>
                                <th>{t("Le stock à l’entrée")}</th>
                                <th>{t("Le stock actuel")}</th>
                                <th>{t("Le prix de vente")}</th>
                                <th>{t("Les promotions")}</th>
                                <th>{t("L’évaluation")}</th>
                                <th>{t("Le nombre de visites sur produit")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>500</td>
                                <td>200</td>
                                <td>20</td>
                                <td>20%</td>
                                <td>Lorem</td>
                                <td>350</td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                </div>
              </div>
            </div>
      </section>
      </div>
    </>
  );
};

export default ProductDetail;
