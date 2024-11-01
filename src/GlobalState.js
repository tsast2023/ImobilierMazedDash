import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const token = Cookies.get("token");
  const [demandeT , setDemandeT] = useState();
  const [pseudo , setpseudo] = useState("");
  const [statusDemande , setstatusDemande] = useState("");
  const [typeRecharge , settypeRecharge] = useState("");
  const [pageTransfert , setpageTransfert] = useState(0);
  const [numTel , setnumTel] = useState("");
  const [questions , setQuestions]= useState();
  const [Categories, setCategories] = useState([]);
  const [Acheteur, setAcheteur] = useState([]);
  const [Vendeur, setVendeur] = useState([]);
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
  const [adsList, setAdsList] = useState([]); // New state for ads

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

    // Updated API for commandes (getCommandeByUser)
    const getAllCommandes = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/commandes");
        console.log("all Commandes:", res.data);
        setCommandes(res.data);
      } catch (error) {
        console.log(error);
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
    const fetchAds = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/ads/getAll"); // Adjust API endpoint as needed
        console.log("Ads List:", res.data);
        setAdsList(res.data);
      } catch (error) {
        console.log(error);
      }
    };
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
    fetchAds(); // Fetch ads here
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
        const res = await axios.get(`http://localhost:8082/api/demandeTransfert/filter?numTel=${numTel}&pseudo=${pseudo}&statusDemande=${statusDemande}&typeRecharge=${typeRecharge}&page=${pageTransfert}`, {headers : {Authorization: `Bearer ${token}`}})
        console.log("all demandes transferts:" , res.data , token)
        setDemandeT(res.data)
      } catch (error) {
        console.log(error , token)
      }
    }
    getAllDemandesTransfert();
  }, [pseudo , statusDemande , typeRecharge , pageTransfert ])

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
    Questions : questions,
    Admins: admins,
    Commandes: commandes,
    Users: users,
    demandesT : demandeT,
    adsList, // Add adsList to global state
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
