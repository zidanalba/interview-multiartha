import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductsTable from "../components/ProductsTable";

const UserPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = async (page = 1, rowsPerPage = 10) => {
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
      setData(response.data.data);
    } catch (error) {
      console.log("Gagal mengambil data", error);
    }
  };
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="User" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
        <ProductsTable />
      </main>
    </div>
  );
};

export default UserPage;
