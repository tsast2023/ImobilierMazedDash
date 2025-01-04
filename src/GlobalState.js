import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const token = Cookies.get("token");
  const [demandeT , setDemandeT] = useState();
  const [notifications , setNotifications] = useState();
  const [me , setMe] = useState();
  const [pseudo , setpseudo] = useState("");
  const [statusDemande , setstatusDemande] = useState("");
  const [typeRecharge , settypeRecharge] = useState("");
  const [pageTransfert , setpageTransfert] = useState(0);
  const [numTel , setnumTel] = useState("");
  const [userPseudo , setUserPseudo] = useState("");
  const [userNumtel , setUserNumtel] = useState("");
  const [userStatus , setUserStatus] = useState("");
  const [pageUser , setpageUser] = useState(0);
  const [questions , setQuestions]= useState();
  const [Categories, setCategories] = useState([]);
  const [Acheteur, setAcheteur] = useState([]);
  const [pseudoAds ,setpseudoAds] = useState("");
  const [numTelAds ,setnumTelAds] = useState("");
  const [actionAnnonceAds ,setactionAnnonceAds] = useState("");
  const [pageAds , setpageAds] = useState(0);
  const [Vendeur, setVendeur] = useState([]);
  const [annonces , setAnnonces] = useState();
  const [Admin, setAdmin] = useState([]);
  const [Products, setProducts] = useState([]);
  const [tutoriel, setTutotiel] = useState([]);
  const [carteRech, setCarteRech] = useState([]);
  const [bids, setBids] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [users, setUsers] = useState([]);
  const [adsList, setAdsList] = useState([]);
  const [size , setSize] = useState(20)
  const [statusBid, setStatusBid] = useState(""); // Assuming StatusEnchere is an enum, you can also set a default here
  const [nomCategorie, setNomCategorie] = useState('');
  
  const [nomProduit, setNomProduit] = useState('');
  
 
  const [ville, setVille] = useState('');
  const [pageBid, setPageBid] = useState(0); // New state for ads

  useEffect(() => {
    const getAllAcheteur = async () => {
      try {
        const res = await axios.get("http://localhost:8082/admin/users/Acheteur", {headers : {Authorization: `Bearer ${token}`}});
        console.log("Acheteur:", res.data);
        setAcheteur(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    
    const getAllVendeur = async () => {
      try {
        const res = await axios.get("http://localhost:8082/admin/users/Vendeur" , {headers : {Authorization: `Bearer ${token}`}});
        console.log("Vendeur:", res.data);
        setVendeur(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8082/api/categories/getAll', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Categories:", res.data);
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/products/all");
        console.log("Products:", res.data);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getAllQuestions = async()=>{
      try {
        const res = await axios.get('http://localhost:8082/api/questions', {headers : {Authorization: `Bearer ${token}`}})
        console.log("all questions:" , res.data)
        setQuestions(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    const getAllNotifications = async()=>{
      try {
        const res = await axios.get('http://localhost:8082/admin/noticationByLangue', {headers : {Authorization: `Bearer ${token}`}})
        console.log("all notifications:" , res.data , token)
        setNotifications(res.data)
      } catch (error) {
        console.log(error , token)
      }
    }
    const getMe = async()=>{
      try {
        const res = await axios.get('http://localhost:8082/api/auth/user/me', {headers : {Authorization: `Bearer ${token}`}})
        console.log("my account:" , res.data)
        setMe(res.data)
      } catch (error) {
        console.log(error , token)
      }
    }
    const getAllTuto = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/tuto/getAll");
        console.log("tutorial:", res.data);
        setTutotiel(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getCarteRechar = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/carte/getAll" , {
          headers: {
            'Authorization': `Bearer ${token}`, // Add token to headers
            'Content-Type': 'application/json'
          }
        });
        console.log("cartes:", res.data);
        setCarteRech(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllBids = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/bid/getAll");
        console.log("all bids:", res.data);
        setBids(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch all permissions
    const getAllPermissions = async () => {
      try {
        const res = await axios.get("http://localhost:8082/admin/permission/permissions");
        console.log("all permissions:", res.data);
        setPermissions(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllRoles = async () => {
      try {
        const res = await axios.get("http://localhost:8082/admin/role/allRoles");
        console.log("all roles:", res.data);
        setRoles(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:8082/admin/users/Admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("all Admins:", res.data);
        setAdmins(res.data);
      } catch (error) {
        console.log(error);
      }
    };

const getAllCommandes = async (filters = {}) => {
  try {
    const { statut, searchValue, page = 0, size = 10, sort = "id,asc" } = filters;

    // Construct query parameters
    const params = new URLSearchParams();
    if (statut) params.append("statut", statut);
    if (searchValue) params.append("searchValue", searchValue);
    params.append("page", page);
    params.append("size", size);
    params.append("sort", sort);

    const res = await axios.get(`http://localhost:8082/api/commandes/filter?${params.toString()}`);
    console.log("Filtered Commandes:", res.data.content);
    setCommandes(res.data.content);
  } catch (error) {
    console.error("Error fetching commandes:", error);
  }
};



    const getAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8082/admin/users/Acheteur");
        console.log("all Users:", res.data);
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    // const fetchAds = async () => {
    //   try {
    //     const res = await axios.get("http://localhost:8082/api/ads/getAll"); // Adjust API endpoint as needed
    //     console.log("Ads List:", res.data);
    //     setAdsList(res.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    getAllVendeur();
    getAllAcheteur();
    getAllUsers();
    getAllCommandes();
    getAllAdmin();
    getAllCategories();
    getAllProducts();
    getAllTuto();
    getAllBids();
    getCarteRechar();
    getAllQuestions();
    getAllPermissions(); // Fetch permissions
    getAllRoles();
    getAllNotifications();
    getMe();
    // fetchAds(); // Fetch ads here
  }, [token]);

  // Update category function
  const updateCategory = async (categoryId, updatedData) => {
    try {
      const res = await axios.put(`http://localhost:8082/api/categories/update/${categoryId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Category updated:", res.data);
      // Optionally update the local state to reflect the changes
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId ? { ...category, ...updatedData } : category
        )
      );
    } catch (error) {
      console.log("Error updating category:", error);
    }
  };

  // New function for fetching filtered categories
  const fetchFilteredCategories = async (filters) => {
    try {
      const { type, status, etat } = filters;
      const res = await axios.get(`http://localhost:8082/api/categories/filtred`, {
        params: { type, status, etat },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Filtered Categories:", res.data);
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

      
  useEffect(()=>{
    const getAllDemandesTransfert = async()=>{
      try {
        const res = await axios.get(`http://localhost:8082/api/demandeTransfert/filter?numTel=${numTel}&pseudo=${pseudo}&statusDemande=${statusDemande}&typeRecharge=${typeRecharge}&page=${pageTransfert}&size=${size}`, {headers : {Authorization: `Bearer ${token}`}})
        console.log("all demandes transferts:" , res.data , token)
        setDemandeT(res.data)
      } catch (error) {
        console.log(error , token)
      }
    }
    getAllDemandesTransfert()
  }, [pseudo , statusDemande , typeRecharge , pageTransfert , size , numTel ])

  const state = {
    Categories,
    fetchFilteredCategories, // Add the new method to the global state
    updateCategory, // Add the update function to the global state// Add the create product function to the global state
    Products,
    tutorials: tutoriel,
    bids,
    cartes: carteRech,
    Permissions: permissions, // Add permissions to global state
    Roles: roles,
    Users : users,
    Questions : questions,
    Vendeurs : Vendeur,
    Admins: admins,
    Commandes: commandes,
    Users: users,
    Annonces : annonces,
    demandesT : demandeT,
    notifications: notifications,
    Me : me,
    Bids : bids,
    adsList, 
    numTel,
    setnumTel,      
    pseudo,
    setpseudo,
    statusDemande,
    setstatusDemande,
    typeRecharge,
    settypeRecharge,
    pageTransfert,
    setpageTransfert,
    size,
    setSize,
    pseudoAds,
    setpseudoAds,
    numTelAds,
    setnumTelAds,
    actionAnnonceAds,
    setactionAnnonceAds,
    pageAds,
    setpageAds,
    userPseudo ,
    setUserPseudo,
    userStatus ,
    setUserStatus,
    pageUser,
    setpageUser,
    statusBid,
    setStatusBid,
    nomCategorie ,
    setNomCategorie,
    nomProduit ,
    setNomProduit,
    ville ,
    setVille,
    pageBid,
    setPageBid,
    // Add adsList to global state
  };
  useEffect(()=>{
    const getAllAnnonces = async()=>{
      try {
        const res = await axios.get(`http://localhost:8082/api/annonce/filter?pseudo=${pseudoAds}&numTel=${numTelAds}&actionAnnonce=${actionAnnonceAds}&page=${pageAds}`, {headers : {Authorization: `Bearer ${token}`}})
        console.log("all annonces:" , res.data)
        setAnnonces(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllAnnonces();
  },[pseudoAds , numTelAds , actionAnnonceAds ,pageAds ])

  useEffect(()=>{
    const getAllUsers = async()=>{
    console.log(userPseudo,userStatus , pageUser)
      try {
        const res = await axios.get(`http://localhost:8082/admin/filtredUser?pseudo=${userPseudo}&status=${userStatus}&page=${pageUser}&size=${size}`, {headers : {Authorization: `Bearer ${token}`}})
        console.log("all Users:" , res.data)
        setUsers(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllUsers();

  } , [userPseudo , userStatus , pageUser , size])
 
  useEffect(()=>{
    console.log(nomProduit)
    const getAllBids = async()=>{
      let url = `http://localhost:8082/api/bid/filter?nomProduit=${nomProduit}&nomCategorie=${nomCategorie}&ville=${ville}&page=${pageBid}&size=${size}`
      try {
        if(statusBid !== ""){
          url = url + `&status=${statusBid}`
        }

        const res = await axios.get(url, {headers : {Authorization: `Bearer ${token}`}})
        console.log("all bids:" , res.data)
        setBids(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getAllBids();

  } , [nomCategorie  , statusBid  , nomProduit , ville  , pageBid , size])

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
