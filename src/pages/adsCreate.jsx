import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { Watch } from "react-loader-spinner";


function AnnonceCreator() {
  const token = Cookies.get('token');
  const { t } = useTranslation();
  const [fileInputType, setFileInputType] = useState("");
  const [type, setTypeAnnonce] = useState("");
  const [contenu, setAnnonce] = useState(null);
  const [description, setDescripton] = useState(); // To hold the uploaded file as Base64
  const [datePublication, setDatePublication] = useState();
  const [showPlanifierModal, setShowPlanifierModal] = useState(false);
  // Handle type change
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setFileInputType(selectedType);
    setTypeAnnonce(selectedType);
};

// Handle file input
const handleFileInput = () => {
    return (
        <input
            type="file"
            className="form-control mb-3" // Add bottom margin for spacing between inputs
            accept={fileInputType === "vidéo" ? "video/*" : "image/*"}
            onChange={handleFileUpload}
        />
    );
};

// Handle file upload
const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
        setAnnonce(file); // Set the file directly in the state
    }
};


const publishNow = async () => {
  if (!contenu) {
    toast.error("No content file selected");
    return; // Notify the user and exit
  }

  const resolveWithSomeData = new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append("contenu", contenu); // Append the file
      formData.append("type", type); // Append the type of the announcement
      formData.append("description", description); // Append description

      const res = await axios.post(
        "http://localhost:8081/api/annonce/createAnnonce",
        formData, // Send the FormData
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type
            Authorization: `Bearer ${token}`, // Include the authorization token
          },
        }
      );

      console.log(res.data); // Log the response
      resolve(res.data); // Resolve the promise with response data
    } catch (error) {
      console.error("Error creating announcement:", error);
      reject(error); // Reject the promise with error
    }
  });

  toast.promise(resolveWithSomeData, {
    pending: {
      render() {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Watch
              visible={true}
              height="30"
              width="30"
              radius="48"
              color="#4fa94d"
              ariaLabel="watch-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            "Uploading announcement..."
          </div>
        );
      },
      icon: false,
    },
    success: {
      render({ data }) {
        return "Announcement successfully created!";
      },
      icon: "🟢",
    },
    error: {
      render({ data }) {
        return `Error: ${data.message}`;
      },
    },
  });
};
const scheduledAds = async () => {
  const resolveWithSomeData = new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(
        `http://localhost:8081/api/annonce/planifier?contenu=${contenu}&type=${type}&description=${description}&datePublication=${datePublication}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data); // Log the response
      resolve(res.data); // Resolve the promise with response data
    } catch (error) {
      console.error("Error scheduling ads:", error);
      reject(error); // Reject the promise with error
    }
  });

  toast.promise(resolveWithSomeData, {
    pending: {
      render() {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Watch
              visible={true}
              height="30"
              width="30"
              radius="48"
              color="#4fa94d"
              ariaLabel="watch-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            "Scheduling your ad..."
          </div>
        );
      },
      icon: false,
    },
    success: {
      render({ data }) {
        return "Ad successfully scheduled!";
      },
      icon: "🟢",
    },
    error: {
      render({ data }) {
        return `Error: ${data.message}`;
      },
    },
  });
};

  return (
    <div className="content-container">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h2 className="new-price">{t("Création d'annonce")}</h2>
          </div>
          <div className="card-content">
            <div className="card-body">
              <form className="form form-vertical">
                <div className="form-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="type-annonce">{t("Type de l'annonce")}</label>
                        <div className="position-relative">
                          <select
                            className="form-control"
                            id="type-annonce"
                            onChange={handleTypeChange}
                          >
                            <option value="">{t("Sélectionner le type d'annonce")}</option>
                            <option value="image">{t("Image")}</option>
                            <option value="vidéo">{t("Vidéo")}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mb-3" id="file-input-container">
                      {handleFileInput()}
                    </div>
                    <div className="">
                      <h6 className="">Description:</h6>
                      <textarea required 
                        className="form-control"
                        name="description"
                        onChange={e => setDescripton(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <Button variant="secondary" className="me-2">
                    {t("Annuler")}
                  </Button>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => setShowPlanifierModal(true)}
                  >
                    {t("Planifier")}
                  </Button>
                  <Button variant="info" onClick={publishNow}>
                    {t("Publier immédiatement")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showPlanifierModal}
        onHide={() => setShowPlanifierModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Planifier la publication")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-3">
            <label htmlFor="publicationDate">{t("Date")}</label>
            <input
              type="datetime-local"
              id="publicationDate"
              className="form-control"
              onChange={(e) => setDatePublication(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => setShowPlanifierModal(false)}
          >
            {t("Annuler")}
          </Button>
          <Button variant="secondary" onClick={scheduledAds}>
            {t("Planifier")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AnnonceCreator;
