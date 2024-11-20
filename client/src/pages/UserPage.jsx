import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Modal from "../components/Modal";
import ProductsTable from "../components/ProductsTable";

const UserPage = (isAuthenticated) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]); // Initialized as an empty array
  const tableColumns = [{ name: "Id" }, { name: "Email" }, { name: "Roles" }, { name: "Actions" }];

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    try {
      const params = {
        page: page,
        per_page: rowsPerPage,
      };
      const response = await axios.get("http://127.0.0.1:5000/user/", {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setData(response.data.data || []); // Ensure fallback to an empty array
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="User" isAuthenticated={isAuthenticated} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
        <ProductsTable data={data} title="User List" columns={tableColumns} isAuthenticated={isAuthenticated} />
      </main>
    </div>
  );
};

export default UserPage;
