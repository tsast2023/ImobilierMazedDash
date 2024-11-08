import React, { useState } from "react";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    withColor: false,
    withOptions: false,
    colors: [{ color: "", stock: 0, price: 0 }],
    galerieWithoutColor: null,
    galerieWithColor: [[]],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[index][field] = value;
    setFormData((prevData) => ({ ...prevData, colors: updatedColors }));
  };

  const addColor = () => {
    setFormData((prevData) => ({
      ...prevData,
      colors: [...prevData.colors, { color: "", stock: 0, price: 0 }],
      galerieWithColor: [...prevData.galerieWithColor, []],
    }));
  };

  const removeColor = (index) => {
    const updatedColors = [...formData.colors];
    const updatedGalerieWithColor = [...formData.galerieWithColor];
    updatedColors.splice(index, 1);
    updatedGalerieWithColor.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      colors: updatedColors,
      galerieWithColor: updatedGalerieWithColor,
    }));
  };

  const handleGalerieWithColorChange = (index, files) => {
    const updatedGalerie = [...formData.galerieWithColor];
    updatedGalerie[index] = files;
    setFormData((prevData) => ({ ...prevData, galerieWithColor: updatedGalerie }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // Place submit logic here, such as an API call
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Créer un produit</h4>

      <label>
        Avec couleur :
        <input
          type="checkbox"
          name="withColor"
          checked={formData.withColor}
          onChange={handleInputChange}
        />
      </label>

      <label>
        Avec options :
        <input
          type="checkbox"
          name="withOptions"
          checked={formData.withOptions}
          onChange={handleInputChange}
        />
      </label>

      {/* Galerie sans couleur */}
      {!formData.withColor && (
        <div>
          <label>Galerie sans couleur :</label>
          <input
            type="file"
            name="galerieWithoutColor"
            multiple
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                galerieWithoutColor: e.target.files,
              }))
            }
          />
        </div>
      )}

      {/* Gestion des couleurs */}
      {formData.withColor &&
        formData.colors.map((color, index) => (
          <div key={index} className="color-section">
            <label>
              Couleur :
              <input
                type="text"
                value={color.color}
                onChange={(e) => handleColorChange(index, "color", e.target.value)}
              />
            </label>

            {/* Galerie avec couleur */}
            <label>
              Galerie pour cette couleur :
              <input
                type="file"
                multiple
                onChange={(e) =>
                  handleGalerieWithColorChange(index, Array.from(e.target.files))
                }
              />
            </label>

            {/* Stock et prix pour chaque couleur, affichés seulement si withOptions est false */}
            {!formData.withOptions && (
              <>
                <label>
                  Stock pour cette couleur :
                  <input
                    type="number"
                    value={color.stock}
                    onChange={(e) => handleColorChange(index, "stock", e.target.value)}
                  />
                </label>

                <label>
                  Prix pour cette couleur :
                  <input
                    type="number"
                    value={color.price}
                    onChange={(e) => handleColorChange(index, "price", e.target.value)}
                  />
                </label>
              </>
            )}

            <button type="button" onClick={() => removeColor(index)}>
              Supprimer cette couleur
            </button>
          </div>
        ))}

      {/* Bouton pour ajouter une nouvelle couleur */}
      {formData.withColor && (
        <button type="button" onClick={addColor}>
          Ajouter une couleur
        </button>
      )}

      <button type="submit">Soumettre</button>
    </form>
  );
};

export default ProductForm;
