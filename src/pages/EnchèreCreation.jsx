import React, { useContext , useState , useRef} from 'react';
import { useTranslation } from "react-i18next";
import Swal from 'sweetalert2';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Choices from "choices.js";
import '../css/EnchèreCreation.css';
import { GlobalState } from '../GlobalState';
import axios from 'axios';
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useEffect } from 'react';
import { Watch } from "react-loader-spinner";

function EnchèreCreation() {
  const { t } = useTranslation();
  const [steps, setSteps] = useState(0);
  // step 1
  const state = useContext(GlobalState)
  const [customDelegation, setCustomDelegation] = useState("");
  const [isCustomDelegation, setIsCustomDelegation] = useState(false);
  const [customDelegationFr, setCustomDelegationFr] = useState("");
  const [isCustomDelegationFr, setIsCustomDelegationFr] = useState(false);
  const token = Cookies.get("token");
  const products = state.Products 
  const [data, setData] = useState({
    ville: "Sousse",
    ref: "",
    prixMazedOnline: 0,
    avocat: "",
    notaire: "",
    libProduct: products ? products[0].libelleProductFr : "",
    villeArabe: "",
    delegation : "", 
    delegationAr : ""
  });
  const villesDelegations = {
    "تونس": ["تونس المدينة", "المرسى", "الكرم", "باردو", "حلق الوادي", "سيدي حسين"],
    "أريانة": ["أريانة المدينة", "المنيهلة", "سكرة", "رواد"],
    "بن عروس": ["بن عروس", "حمام الأنف", "حمام الشط", "رادس", "المروج", "فوشانة"],
    "منوبة": ["منوبة", "الجديدة", "وادي الليل", "المرناقية", "طبربة", "دوار هيشر"],
    "بنزرت": ["بنزرت المدينة", "منزل بورقيبة", "جرزونة", "راس الجبل", "العالية", "ماطر"],
    "نابل": ["نابل", "الحمامات", "دار شعبان الفهري", "بني خيار", "قليبية", "منزل تميم"],
    "زغوان": ["زغوان", "الفحص", "الناظور", "بئر مشارقة"],
    "باجة": ["باجة", "تستور", "مجاز الباب", "نفزة", "عمدون"],
    "جندوبة": ["جندوبة", "فرنانة", "طبرقة", "عين دراهم", "بلطة بوعوان"],
    "الكاف": ["الكاف", "تاجروين", "ساقية سيدي يوسف", "القصور"],
    "سليانة": ["سليانة", "مكثر", "بوعرادة", "الكريب", "قعفور"],
    "سوسة": ["سوسة المدينة", "مساكن", "حمام سوسة", "القلعة الكبرى", "القلعة الصغرى"],
    "المنستير": ["المنستير", "جمال", "المكنين", "البقالطة", "قصر هلال", "زرمدين"],
    "المهدية": ["المهدية", "الشابة", "قصور الساف", "سيدي علوان", "ملولش"],
    "صفاقس": ["صفاقس المدينة", "جبنيانة", "عقارب", "المحرس", "الحنشة"],
    "القيروان": ["القيروان", "حفوز", "بوحجلة", "الشبيكة", "نصر الله"],
    "القصرين": ["القصرين", "تالة", "فريانة", "حيدرة", "سبيطلة"],
    "سيدي بوزيد": ["سيدي بوزيد", "جلمة", "المزونة", "بئر الحفي", "سبالة أولاد عسكر"],
    "قفصة": ["قفصة", "المتلوي", "أم العرائس", "رديف", "القصر"],
    "توزر": ["توزر", "دقاش", "نفطة", "حزوة"],
    "قبلي": ["قبلي", "دوز", "سوق الأحد"],
    "قابس": ["قابس", "مارث", "مطماطة", "الحامة", "غنوش"],
    "مدنين": ["مدنين", "جرجيس", "بن قردان", "حومة السوق", "أجيم"],
    "تطاوين": ["تطاوين", "غمراسن", "البئر الأحمر", "ذهيبة"],
  };
  const villesDelegationsFr = {
    "Tunis": ["Tunis ville", "La Marsa", "El Kram", "Bardo", "Halk el Wadi", "Sidi Hussein"],
    "Ariana": ["Ariana ville", "El Mnihla", "Cité Saker", "Raoued"],
    "Ben Arous": ["Ben Arous", "Hammam El Enf", "Hammam Chott", "Rades", "El Mourouj", "Fouchana"],
    "Manouba": ["Manouba", "La Nouvelle", "Oued Ellil", "El Mornaguia", "Teboursouk", "Douar Hicher"],
    "Bizerte": ["Bizerte ville", "Menzel Bourguiba", "Jarzouna", "Ras Jebel", "El Aalia", "Mateur"],
    "Nabeul": ["Nabeul", "Hammamet", "Dar Châabane El Fehri", "Beni Khiar", "Kelibia", "Menzel Temim"],
    "Zaghouan": ["Zaghouan", "El Fahs", "Nadhour", "Bir Mcharga"],
    "Beja": ["Beja", "Tastour", "Menzel Bourguiba", "Nefza", "Amdoun"],
    "Jendouba": ["Jendouba", "Fernana", "Tabarka", "Ain Draham", "Belta Bouaouan"],
    "Kef": ["Le Kef", "Tajerouine", "Saqiet Sidi Youssef", "Les Ksours"],
    "Siliana": ["Siliana", "Makthar", "Bouarada", "Kebili", "Kafour"],
    "Sousse": ["Sousse ville", "Msaken", "Hammam Sousse", "El Kalaa El Kbira", "El Kalaa El Sghira"],
    "Monastir": ["Monastir", "Jammel", "Moknine", "El Bqalta", "Kasr Hellal", "Zeramdine"],
    "Mahdia": ["Mahdia", "Chebba", "Kasr El Saf", "Sidi Alwan", "Melloulche"],
    "Sfax": ["Sfax ville", "Jebiniana", "Aqareb", "Al Mahres", "El Hncha"],
    "Kairouan": ["Kairouan", "Hafouz", "Bouhajla", "El Chebika", "Nassr Allah"],
    "Kasserine": ["Kasserine", "Tala", "Fériana", "Haïdra", "Sbaita"],
    "Sidi Bouzid": ["Sidi Bouzid", "Jemla", "El M’zouna", "Bir El Haffi", "Sablet Oulad Asker"],
    "Gafsa": ["Gafsa", "Metlaoui", "Om El Arayes", "Redayef", "El Ksour"],
    "Tozeur": ["Tozeur", "Degache", "Nefta", "Hazoua"],
    "Kebili": ["Kebili", "Douz", "Souk El Khamis"],
    "Gabes": ["Gabes", "Mareth", "Matmata", "El Hama", "Ghannouch"],
    "Mednine": ["Mednine", "Jarjis", "Ben Guerdane", "Houmet Essouk", "Ajim"],
    "Tataouine": ["Tataouine", "Ghamrassen", "El Berr Erredh", "Dhahiba"],
  };
  const handleDelegationChange = (event) => {
    const selectedDelegation = event.target.value;
    setData({ ...data, delegationAr: selectedDelegation });
    
    // If the user selects "Other" or something that's not in the list
    if (selectedDelegation === "other") {
      setIsCustomDelegation(true);
    } else {
      setIsCustomDelegation(false);
    }
  };

  const handleCustomDelegationChange = (event) => {
    setCustomDelegation(event.target.value);
    setData({ ...data, delegationAr: event.target.value });
  };
  const handleDelegationChangeFr = (event) => {
    const selectedDelegation = event.target.value;
    setData({ ...data, delegation: selectedDelegation });
    
    // If the user selects "Other" or something that's not in the list
    if (selectedDelegation === "other") {
      setIsCustomDelegationFr(true);
    } else {
      setIsCustomDelegationFr(false);
    }
  };

  const handleCustomDelegationChangeFr = (event) => {
    setCustomDelegationFr(event.target.value);
    setData({ ...data, delegation: event.target.value });
  };

  const addbid = async () => {
    try {
      const res = await axios.post("http://localhost:8082/api/bid/createBrouillon", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log(res);
      if (res.data && res.data.id) {
        localStorage.setItem("idenchere", res.data.id);
        setSteps(steps + 1);
      } else {
        console.error("ID is undefined in the response.");
      }
    } catch (error) {
      console.error("Error adding bid:", error.response || error);
      // Vérifier si l'erreur concerne une référence existante
      if (error.response && error.response.data === 'An auction with the reference 5000 already exists.') {
    
        alert("Une enchère avec cette référence existe déjà. Veuillez essayer une autre référence.");
      } else {
        alert("Une erreur est survenue lors de la création de l'enchère. Veuillez réessayer.");
      }
    }
  };
  
  

  useEffect(() => {
    if (products && products.length > 0) {
      setData((prevData) => ({
        ...prevData,
        categoryName: products[0].libelleProductFr, // Set first category as default
      }));
    }
  }, [products]);
  // step 2  
  const [showEmail1, setShowEmail1] = useState(true);
  const [showEmail2, setShowEmail2] = useState(true);
  const [showFac, setShowFac] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(""); // State for input value

  const selectRef = useRef(null);
  const choicesInstance = useRef(null);

  useEffect(() => {
    if (selectRef.current) {
      choicesInstance.current = new Choices(selectRef.current, {
        allowHTML: false,
        removeItemButton: true,
        addItemText: (value) => `Add "${value}"`,
        itemSelectText: "",
        duplicateItemsAllowed: false, // Prevent duplicate items
        shouldSort: false, // Disable sorting to keep the original order
      });
    }

    // Cleanup Choices.js
    return () => {
      if (choicesInstance.current) {
        choicesInstance.current.destroy();
        choicesInstance.current = null;
      }
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault(); // Prevent default form submission or other actions

      if (choicesInstance.current) {
        const value = inputValue.trim();
        // Add the new option
        choicesInstance.current.setChoices(
          [{ value: value, label: value, selected: true, disabled: false }],
          "value",
          "label",
          true // This flag indicates that the options should be added to the end of the existing list
        );
        setInputValue(""); // Clear the input after adding
      }
    }
  };

  const handleCheckbox1Change = () => {
    setShowEmail1(!showEmail1);
  };

  const handleCheckbox2Change = () => {
    setShowEmail2(!showEmail2);
    setShowFac(!showFac);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDelete = () => {
    Swal.fire({
      title: "Êtes-vous sûr(e) ?",
      text: "Une fois supprimé(e), vous ne pourrez pas récupérer cet élément !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Oui, Annuler-le !",
      cancelButtonText: "Non, annuler !",
      closeOnConfirm: false,
      closeOnCancel: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem();
        Swal.fire({
          title: "Annuler(e) !",
          text: "Votre élément a été supprimé.",
          icon: "success",
          iconColor: "black",
          confirmButtonColor: "#b0210e",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Annulé",
          text: "Votre élément est en sécurité :)",
          icon: "error",
          confirmButtonColor: "#b0210e",
          confirmButtonText: "OK",
        });
      }
    });
  };

  const deleteItem = () => {
    // Implement your delete logic here
  };
  const [valeurMajoration, setValeurMajoration] = useState([]);
  const [newValue, setNewValue] = useState("");

  const handleAddValue = () => {
    if (newValue) {
      setValeurMajoration([...valeurMajoration, parseInt(newValue)]);
      setNewValue(""); // Clear input field after adding
    }
  };
   const [dataConfig, setDataConfig] = useState({
    coutClic: 0,
    coutParticipation: 0,
    valeurMajoration: [],
    datedeclenchement: Date.now(),
    datefermeture: Date.now(),
    nombreParticipantAttendu: 0,
    nombreMois: 0,
    extensionTime: 0,
    autoFinancement: 0,
    datepublication : Date.now(),
    prixPlafond : 0.0
  });

  const addBidConfig = async () => {
    console.log(dataConfig);
    console.log(localStorage.getItem("idenchere"));

    const resolveWithSomeData = new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        Object.keys(dataConfig).forEach((key) => {
          formData.append(key, dataConfig[key]);
        });

        // Add IdEnchere to FormData
        formData.append("IdEnchere", localStorage.getItem("idenchere"));
        const valeurMajorationArray = String(valeurMajoration)
          .split(",")
          .map(Number);
        console.log(valeurMajorationArray);
        valeurMajorationArray.forEach((value) => {
          formData.append("valeurMajoration", value);
        });


        const res = await axios.post(
          "http://localhost:8082/api/bid/publishBidNow",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(res.data);
        localStorage.removeItem("idenchere");
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(resolveWithSomeData, {
      pending: {
        render() {
          return (
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-around"}}>
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
              "Uploading bid configuration..."
            </div>
          );
        },
        icon: false,
      },
      success: {
        render({ data }) {
          return `Bid successfully published!`;
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
  const confirmAction = (actionType) => {
    Swal.fire({
      title: t("Êtes-vous sûr?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Oui"),
      cancelButtonText: t("Non, annuler!"),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(t("Terminé"), t("L'élément a été ajoutée"), "secondary");
      }
    });
  };

  return (
    <>
   {steps === 0 && (
    <div className='content-container'>
      <div className="page-heading">
        <section id="basic-vertical-layouts">
          <div className="match-height">
            <div>
              <div className="card">
                <div className="card-header">
                  <h2 className="new-price">{t("Création De Enchere")}</h2>
                </div>
                <div className="card-content">
                  <div className="card-body">
                    <form className="form form-vertical">
                      <div className="form-body">
                        <div className="row">
                          <div className="col-12">
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label htmlFor="email-id-vertical">{t("Référence")}</label>
                              <input type="number" id="email-id-vertical" className="form-control" name="email-id" required
                                  onChange={(e) =>
                                    setData({ ...data, ref: e.target.value })
                                  } />
                            </div>
                          </div>
                          {/* <div className="col-12">
                            <div className="form-group">
                              <label htmlFor="email-id-vertical">{t("Prix magasin")}</label>
                              <input type="number" id="email-id-vertical" className="form-control" name="email-id" required />
                            </div>
                          </div> */}
                          <div className="col-12">
                            <div className="form-group">
                              <label htmlFor="email-id-vertical">{t("Prix Mazed Online")}</label>
                              <input type="text" id="email-id-vertical" className="form-control" name="email-id" required 
                                  onChange={(e) =>
                                    setData({ ...data, prixMazedOnline: e.target.value })
                                  }/>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label htmlFor="email-id-vertical">{t("Notaire")}</label>
                              <input type="text" id="email-id-vertical" className="form-control" name="email-id" required 
                                  onChange={(e) =>
                                    setData({ ...data, notaire: e.target.value })
                                  }/>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label htmlFor="email-id-vertical">{t("Avocat")}</label>
                              <input type="text" id="email-id-vertical" className="form-control" name="email-id" required
                                  onChange={(e) =>
                                    setData({ ...data, avocat: e.target.value })
                                  } />
                            </div>
                          </div>
                          <div className="col-12">
                            <label>{t("Produits")}</label>
                            <div className="form-group">
                              <select className="choices form-select"
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    libProduct: e.target.value,
                                  })
                                }>
                              {products &&
                                      products.map((item, index) => (
                                        <option
                                          key={index}
                                          value={item.libelleProductFr}
                                        >
                                          {item.libelleProductFr}
                                        </option>
                                      ))}
                              </select>
                            </div>
                            <br/>
                          </div>
                         
                          <div className="col-12">
                            <label>{t("Ville")}</label>
                            <fieldset className="form-group">
    <select
      className="form-select"
      id="basicSelect"
      value={data.ville}
      onChange={(e) => setData({ ...data, ville: e.target.value })}
      required
    >
      {Object.keys(villesDelegationsFr).map((ville, index) => (
        <option key={index} value={ville}>
          {t(ville)}
        </option>
      ))}
    </select>
  </fieldset>
                          
                            <br/>
                          
                          </div>
                          <label>{t("Delegation")}</label>
  <fieldset className="form-group">
    <select
      className="form-select"
      id="delegationSelect"
      value={data.delegation}
      onChange={handleDelegationChangeFr}
      required
    >
      {villesDelegationsFr[data.ville]?.map((delegation, index) => (
        <option key={index} value={delegation}>
          {t(delegation)}
        </option>
      ))}
          <option value="other">{t("Autre")}</option>
    </select>
    <br/>
  </fieldset>
  
  {isCustomDelegationFr && (
        
        <div>
          <label>{t("Enter Custom Delegation")}</label>
          <input
            type="text"
            id="email-id-vertical" className="form-control"
            value={customDelegationFr}
            onChange={handleCustomDelegationChangeFr}
            placeholder={t("Enter delegation")}
            required
          />
         <br/>
        </div>
      
      )}
                          
                          <div className="col-12">
  <label>{t("Ville")}</label>
  <fieldset className="form-group">
    <select
      className="form-select"
      id="basicSelect"
      value={data.villeArabe}
      onChange={(e) => setData({ ...data, villeArabe: e.target.value })}
      required
    >
      {Object.keys(villesDelegations).map((ville, index) => (
        <option key={index} value={ville}>
          {t(ville)}
        </option>
      ))}
      
    </select>
    <br/>
  </fieldset>
                          </div>
                          <div className="col-12">
                          <label>{t("Delegation")}</label>
      <fieldset className="form-group">
        <select
          className="form-select"
          id="delegationSelect"
          value={data.delegationAr}
          onChange={handleDelegationChange}
          required
        >
          {villesDelegations[data.villeArabe]?.map((delegation, index) => (
            <option key={index} value={delegation}>
              {t(delegation)}
            </option>
          ))}
          {/* Option for manual input */}
          <option value="other">{t("أخرى")}</option>
        </select>
      </fieldset>
      <br/>
      {isCustomDelegation && (
        
        <div>
          <label>{t("Enter Custom Delegation")}</label>
          <input
            type="text"
            id="email-id-vertical" className="form-control"
            value={customDelegation}
            onChange={handleCustomDelegationChange}
            placeholder={t("Enter delegation")}
            required
          />
        </div>
      )}
      <br />
</div>
                          <br/>
                            <br/>
                            <br/>
                            <br/>
                          <div className="col-12 d-flex justify-content-end">
                            <button type="reset" className="btn btn-secondary me-1 mb-1">
                              {t("Annuler")}
                            </button>
                            <a
                                  onClick={addbid}
                                  className="btn btn-primary me-1 mb-1"
                                  style={{ color: "white" }}
                                >
                                  {t("Suivant")}
                                </a>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
      )}
       {steps === 1 && (
    <div className="content-container">
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3" />
          </a>
        </header>
        <div className="page-heading">
          <section id="basic-vertical-layouts">
            <div className="match-height">
              <div>
                <div className="card">
                  <div className="card-header">
                    <h2 className="new-price" id="myModalLabel33">
                      {t("Configuration De L'enchere")}
                    </h2>
                  </div>
                  <div className="card-content">
                    <div className="card-body">
                      <form className="form form-vertical">
                        <div className="form-body">
                          <div className="row">
                            <div className="col-12">
                              <div className="form-group">
                                <label htmlFor="participation-cost">
                                  {t("Cout Du Participation")}
                                </label>
                                <input
                                  type="number"
                                  id="participation-cost"
                                  className="form-control"
                                  name="participation-cost"
                                  placeholder={t("Ecrire Ici")}
                                  onChange={(e) =>
                                    setDataConfig({
                                      ...dataConfig,
                                      coutParticipation: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group">
                                <label htmlFor="click-cost">
                                  {t("Cout Du Clic")}
                                </label>
                                <input
                                  type="number"
                                  id="click-cost"
                                  className="form-control"
                                  name="click-cost"
                                    onChange={(e) =>
                                        setDataConfig({
                                          ...dataConfig,
                                          coutClic: e.target.value,
                                        })
                                      }
                                  placeholder={t("Ecrire Ici")}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-12">
                              <div className="form-group">
                                <label htmlFor="increment-value">
                                  {t("Ajouter Valeur De Majoration")}
                                </label>
                                <input
                                  type="text"
                                  id="increment-value"
                                  className="form-control"
                                  value={inputValue}
                                  onChange={handleInputChange}
                                  onKeyDown={handleKeyPress}
                                  placeholder={t(
                                    "Add new option and press Enter"
                                  )}
                                />
                                <label htmlFor="increment-value">
                                  {t("Select Valeur De Majoration")}
                                </label>
                                <select
                                  id="choices-select"
                                  className="form-select"
                                  name="increment-value"
                                  ref={selectRef}
                                  required
                                  multiple
                                >
                                  {/* Initial options can be added here if needed */}
                                </select>
                              </div>
                            </div>
                            {/* <div className="col-12 checkbox">
                              <input
                                type="checkbox"
                                id="checkbox1"
                                className="col-1 form-check-input"
                                checked={showEmail1}
                                onChange={handleCheckbox1Change}
                              />
                              <span>Remboursement</span>
                            </div>
                            {showEmail1 && (
                              <div className="col-12">
                                <input
                                  type="text"
                                  id="email-id-vertical1"
                                  className="col-6 form-control"
                                  name="email-id"
                                  placeholder="Ecrire Ici"
                                  required
                                />
                              </div>
                            )} */}
                            <br />
                            <br />
                            {/* <div className="row">
                              <div className="col-12 checkbox">
                                <input
                                  type="checkbox"
                                  id="checkbox2"
                                  className="col-6 form-check-input"
                                  checked={showEmail2}
                                  onChange={handleCheckbox2Change}
                                />
                                <span>Facilité</span>
                              </div>
                              {showEmail2 && (
                                <div className="col-6">
                                  <input
                                    type="number"
                                    id="email-id-vertical2"
                                    className="col-6 form-control"
                                    name="email-id"
                                    placeholder="Ecrire Ici"
                                    required
                                  />
                                </div>
                              )}
                              {showFac && (
                                <fieldset
                                  style={{ padding: "0px", margin: "0px" }}
                                  id="fac"
                                  className="col-6 form-group"
                                >
                                  <select
                                    className="form-select"
                                    id="basicSelect"
                                    required
                                  >
                                    <option>Mois</option>
                                    <option>L'année</option>
                                  </select>
                                </fieldset>
                              )}
                            </div> */}

                            <div className="col-12">
                              <div className="form-group">
                                <label htmlFor="number-of-months">
                                  {t("Nb De Mois")}
                                </label>
                                <input
                                  type="number"
                                  id="number-of-months"
                                  className="form-control"
                                  onChange={(e) =>
                                    setDataConfig({
                                      ...dataConfig,
                                      nombreMois: e.target.value,
                                    })
                                  }
                                  name="number-of-months"
                                  placeholder={t("Ecrire Ici")}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="card">
              <div
                style={{ backgroundColor: "white", padding: 20 }}
                className="modal-content"
              >
                <div className="modal-header">
                  <h2 className="new-price" id="myModalLabel33">
                    {t("Ajouter une nouvelle Configuration")}
                  </h2>
                </div>
                <form action="#">
                  <div className="modal-body">
                    <label htmlFor="expected-participants">
                      {t("Nb attendu des participants")}
                    </label>
                    <div className="form-group">
                      <input
                        type="number"
                        id="expected-participants"
                        className="form-control"
                        placeholder={t("Écrivez ici")}
                        maxLength={25}
                        onChange={(e) =>
                          setDataConfig({
                            ...dataConfig,
                            nombreParticipantAttendu: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <label htmlFor="launch-date">
                      {t("Date de Lancement")}
                    </label>
                    <div className="form-group">
                      <input
                        type="datetime-local"
                        id="launch-date"
                        className="form-control"
                        placeholder={t("Écrivez ici")}
                        required
                        onChange={(e) =>
                          setDataConfig({
                            ...dataConfig,
                            datedeclenchement: e.target.value,
                          })
                        }
                      />
                    </div>
                    <label htmlFor="closing-date">
                      {t("Date de Fermeture")}
                    </label>
                    <div className="form-group">
                      <input
                        type="datetime-local"
                        id="closing-date"
                        className="form-control"
                        placeholder={t("Écrivez ici")}
                        required
                        onChange={(e) =>
                          setDataConfig({
                            ...dataConfig,
                            datefermeture: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary ms-1"
                      onClick={handleOpenModal}
                    >
                      <span className="d-none d-sm-block">
                        {t("Planifier")}
                      </span>
                    </button>
                    <button type="button" className="btn btn-primary ms-1">
                      <span className="d-none d-sm-block">{t("Publier")}</span>
                    </button>
                    <button type="button" className="btn btn-primary ms-1" onClick={addBidConfig}>
                      <span className="d-none d-sm-block">
                        {t("Enregister")}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary ms-1"
                      onClick={() => setSteps(steps - 1)}
                    >
                      <span className="d-none d-sm-block">{t("Annuler")}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>

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
          <Button variant="primary">{t("Planifier")}</Button>
        </Modal.Footer>
      </Modal>
    </div>
       )}
    
    </>
     
  );
}

export default EnchèreCreation;
