import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const token = Cookies.get("token");
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

  useEffect(() => {
    const getAllAcheteur = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/admin/users/Acheteur"
        );
        console.log("Acheteur:", res.data);
        setAcheteur(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllVendeur = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/admin/users/Vendeur"
        );
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
        const res = await axios.get(
          "http://localhost:8082/api/products/all"
        );
        console.log("Products:", res.data);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllTuto = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/api/tuto/getAll"
        );
        console.log("tutorial:", res.data);
        setTutotiel(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getCarteRechar = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/api/carte/getAll"
        );
        console.log("cartes:", res.data);
        setCarteRech(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllBids = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/bid/getAll");
        console.log("all bids:", res.data);
        setBids(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllPermissions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8082/admin/permissions"
        );
        console.log("all permissions:", res.data);
        setPermissions(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllRoles = async () => {
      try {
        const res = await axios.get("http://localhost:8082/admin/allRoles");
        console.log("all roles:", res.data);
        setRoles(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllAdmin = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8082/admin/users/Admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("all Admins:", res.data);
        setAdmins(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllCommandes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/api/commandes/toutes-les-commandes"
        );
        console.log("all Commandes:", res.data);
        setCommandes(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getAllUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/admin/users/Acheteur"
        );
        console.log("all Users:", res.data);
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch all data
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
    getAllPermissions();
    getAllRoles();
  }, [token]);

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

  const state = {
    Categories,
    fetchFilteredCategories, // Add the new method to the global state
    Products,
    tutorials: tutoriel,
    bids,
    cartes: carteRech,
    Permissions: permissions,
    Roles: roles,
    Admins: admins,
    Commandes: commandes,
    Users: users,
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
