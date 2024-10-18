import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";

function ProdAction() {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    // State for color options
    const [withColor, setWithColor] = useState(null);
    const [colorInputs, setColorInputs] = useState([{ color: "", imageFiles: null }]);

    const { id: productId } = useParams(); // Get productId from URL parameters
    console.log("Product ID:", productId); // Log the Product ID

    useEffect(() => {
        if (!productId) {
            console.error("Product ID is missing!");
        }
    }, [productId]);

    const goBack = () => {
        window.history.back();
    };

    const location = useLocation();
    const { formData, inputs } = location.state || {};

    console.log("Received form data:", formData);
    console.log("Received inputs:", inputs);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleWithColorChange = (value) => {
        setWithColor(value);
        setColorInputs([{ color: "", imageFiles: null }]);
    };

    const addInput = () => {
        setColorInputs([...colorInputs, { color: "", imageFiles: null }]);
    };

    const handleColorChange = (e, index) => {
        const newColorInputs = [...colorInputs];
        newColorInputs[index].color = e.target.value;
        setColorInputs(newColorInputs);
    };

    const handleImageChange = (e, index) => {
        const newColorInputs = [...colorInputs];
        newColorInputs[index].imageFiles = e.target.files[0];
        setColorInputs(newColorInputs);
    };

    const handleSave = async () => {
        const payload = withColor
            ? colorInputs.map((input) => ({
                color: input.color,
                imageFiles: input.imageFiles,
            }))
            : colorInputs.map((input) => ({
                imageFiles: input.imageFiles,
            }));

        const formData = new FormData();
        payload.forEach((item, index) => {
            if (withColor) {
                formData.append(`colors[${index}][color]`, item.color);
            }
            formData.append(`images[${index}]`, item.imageFiles);
        });

        try {
            const response = await axios.post(
                "http://localhost:8082/api/products/create",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                alert("Data saved successfully!");
            } else {
                alert("Failed to save data.");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert("An error occurred while saving data.");
        }
    };

    // Publish Immediately
    const handlePublishNow = async () => {
        try {
            if (!productId) {
                console.error("Product ID is missing!");
                return;
            }

            const response = await axios.post(
                `http://localhost:8082/api/products/${productId}/publishNow`
            );

            if (response.status === 200) {
                alert("Product published immediately!");
            } else {
                alert("Failed to publish.");
            }
        } catch (error) {
            console.error("Error publishing product:", error);
            alert("An error occurred while publishing the product.");
        }
    };

    // Schedule Product
    const handleSchedule = async () => {
        const date = document.getElementById("dateInput").value;
        const time = document.getElementById("timeInput").value;

        const scheduleData = { date, time };

        try {
            const response = await axios.post(
                `http://localhost:8082/api/products/options/${productId}`,
                scheduleData
            );

            if (response.status === 200) {
                alert("Product scheduled successfully!");
            } else {
                alert("Failed to schedule the product.");
            }
        } catch (error) {
            console.error("Error scheduling product:", error);
            alert("An error occurred while scheduling the product.");
        }
    };

    return (
        <div className="content-container">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h4 className="new-price">{t("Actions")}</h4>
                    </div>
                    <div className="card-content">
                        <div className="card-body">
                            <form className="form form-vertical">
                                <div className="form-body">
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <div className="form-group">
                                                <label htmlFor="first-name-vertical">
                                                    {t("Libellé")}
                                                </label>
                                                <input
                                                    type="text"
                                                    id="first-name-vertical"
                                                    className="form-control"
                                                    name="fname"
                                                    maxLength="25"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <Button
                                                variant="secondary"
                                                className="me-2"
                                                onClick={goBack}
                                            >
                                                {t("Retour")}
                                            </Button>
                                            <Button
                                                variant="success"
                                                className="me-2"
                                                onClick={handleSave}
                                            >
                                                {t("Enregistrer")}
                                            </Button>
                                            <Button
                                                variant="primary"
                                                className="me-2"
                                                onClick={handleOpenModal}
                                            >
                                                {t("Planifier")}
                                            </Button>
                                            <Button
                                                variant="primary"
                                                className="me-2"
                                                onClick={handlePublishNow}
                                            >
                                                {t("Publier immédiatement")}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Modal for scheduling the product */}
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{t("Planifier")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label htmlFor="dateInput" className="form-label">
                                {t("Date")}
                            </label>
                            <input type="date" className="form-control" id="dateInput" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="timeInput" className="form-label">
                                {t("Heure")}
                            </label>
                            <input type="time" className="form-control" id="timeInput" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            {t("Fermer")}
                        </Button>
                        <Button variant="primary" onClick={handleSchedule}>
                            {t("Planifier")}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default ProdAction;
