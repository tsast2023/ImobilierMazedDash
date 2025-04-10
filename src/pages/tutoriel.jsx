import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { GlobalState } from "../GlobalState";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";

const Modal = ({ t, handleImageChange, tuto, setTuto, addTuto }) => {
  return (
    <div
      className="modal fade text-left"
      id="inlineForm"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel33"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="myModalLabel33">
              {t("Ajouter une nouvelle image")}
            </h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={addTuto} action="#">
            <div className="modal-body">
              <label htmlFor="email">{t("Image")}</label>
              <div className="form-group">
                <input
                  id="email"
                  type="file"
                  placeholder={t("Écrivez ici")}
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>
              <label htmlFor="ordre">{t("Ordre")}</label>
              <div className="form-group">
                <input
                  id="ordre"
                  type="number"
                  placeholder={t("Écrivez ici")}
                  className="form-control"
                  onChange={(e) => setTuto({ ...tuto, ordre: e.target.value })}
                />
              </div>
              <label htmlFor="description français">
                {t("Description français")}
              </label>
              <div className="form-group">
                <textarea
                  id="description"
                  type="text"
                  placeholder={t("Écrivez ici")}
                  className="form-control"
                  onChange={(e) =>
                    setTuto({ ...tuto, description: e.target.value })
                  }
                />
              </div>
              <label htmlFor="description">{t("Description anglais")}</label>
              <div className="form-group">
                <textarea
                  id="description anglais"
                  type="text"
                  placeholder={t("Écrivez ici")}
                  className="form-control"
                  onChange={(e) =>
                    setTuto({ ...tuto, descriptionAr: e.target.value })
                  }
                />
              </div>
              <label htmlFor="description arabe">
                {t("Description arabe")}
              </label>
              <div className="form-group">
                <textarea
                  id="description"
                  type="text"
                  placeholder={t("Écrivez ici")}
                  className="form-control"
                  onChange={(e) =>
                    setTuto({ ...tuto, descriptionEn: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                <i className="bx bx-x d-block d-sm-none"></i>
                <span className="btn btn-secondary">{t("Annuler")}</span>
              </button>
              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                type="submit"
              >
                <i className="bx bx-check d-block d-sm-none"></i>
                <span className="btn btn-primary">{t("Enregistrer")}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ item, handleDelete }) => {
  const { t } = useTranslation();

  return (
    <tr>
      <td className="text-bold-500">
        <img
          className="imgtable"
          y
          src={item.file}
          alt="tuto_image"
          style={{ width: "auto", height: "150px" }}
        />
      </td>
      <td>{item.ordre}</td>
      <td>{item.description}</td>
      <td>
        <i
          className="fa-solid fa-trash deleteIcon"
          onClick={() => handleDelete(item.id)}
        ></i>
      </td>
    </tr>
  );
};

const ResponsiveTable = ({ tutorials, handleDelete, isMobile }) => {
  const { t } = useTranslation();

  return (
    <div className="table-responsive">
      {isMobile ? (
        <table className="table">
          <tbody>
            {tutorials && tutorials.length > 0 ? (
              tutorials.map((item, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{t("Image")}</td>
                    <td>
                      <img
                        src={item.file}
                        alt={item.description}
                        style={{ width: "50px", height: "auto" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>{t("Ordre")}</td>
                    <td>{item.ordre}</td>
                  </tr>
                  <tr>
                    <td>{t("Description")}</td>
                    <td>{item.description}</td>
                  </tr>
                  <tr>
                    <td>{t("Supprimer")}</td>
                    <td>
                      <i
                        className="fa-solid fa-trash deleteIcon"
                        onClick={() => handleDelete(item.id)}
                      ></i>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="2">{t("Aucun tutoriel disponible")}</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <table className="table table-lg">
          <thead>
            <tr>
              <td>{t("Image")}</td>
              <td>{t("Ordre")}</td>
              <td>{t("Description")}</td>
              <td>{t("Supprimer")}</td>
            </tr>
          </thead>
          <tbody>
            {tutorials && tutorials.length > 0 ? (
              tutorials.map((item, index) => (
                <TableRow key={index} item={item} handleDelete={handleDelete} />
              ))
            ) : (
              <tr>
                <td colSpan="4">{t("Aucun tutoriel disponible")}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Tutoriel = () => {
  const { t } = useTranslation();
  const [tuto, setTuto] = useState({
    ordre: 0,
    description: "",
    descriptionAr: "",
    descriptionEn: "",
    file: "",
  });
  const state = useContext(GlobalState);
  const tutorials = state.tutorials;
  const [isMobile, setIsMobile] = useState(false);
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

    // Initial check
    handleResize();

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setTuto({ ...tuto, file: reader.result });
    };

    reader.readAsDataURL(file);
  };

  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8082/api/tuto/deleteTuto?id=${id}`
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTuto = async (e) => {
    const formData = new FormData();
    formData.append("ordre", tuto.ordre);
    formData.append("description", tuto.description);
    formData.append("descriptionAr", tuto.descriptionAr);
    formData.append("descriptionEn", tuto.descriptionEn);
    formData.append("file", tuto.file);
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8082/api/tuto/publishNow",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Tutoriel created successfully!",
      });
    } catch (error) {
      // Handle errors
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text:
            error.response.data.message ||
            "An error occurred while creating the tutoriel.",
        });
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <div id="app">
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3"></i>
          </a>
        </header>
        <section id="form-and-scrolling-components">
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="card">
                <div className="card-content">
                  <div className="card-body">
                    <div className="form-group">
                      <h2 className="new-price">
                        {t("Vous souhaitez ajouter une nouvelle image ?")}
                      </h2>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        data-bs-toggle="modal"
                        data-bs-target="#inlineForm"
                      >
                        <i className="bi bi-plus"></i>
                        {t("Ajouter")}
                      </button>
                      <Modal
                        t={t}
                        handleImageChange={handleImageChange}
                        tuto={tuto}
                        setTuto={setTuto}
                        addTuto={addTuto}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section mt-4">
          <div className="card">
            <div
              className="card-header"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2 className="new-price">{t("Liste des images")}</h2>
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
            <div className="card-content">
              <div className="card-body">
                <ReactPaginate
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(tutorials.length / itemsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                  className="react-paginate"
                />
                <ResponsiveTable
                  tutorials={tutorials}
                  handleDelete={handleDelete}
                  isMobile={isMobile}
                />
                <ReactPaginate
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(tutorials.length / itemsPerPage)}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                  className="react-paginate"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tutoriel;
