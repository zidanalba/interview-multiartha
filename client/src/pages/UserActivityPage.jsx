import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTableExample from "../components/DataTable";
import Header from "../components/Header";

const UserActivityPage = (isAuthenticated) => {
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      const response = await axios.get("http://127.0.0.1:5000/logs/", {
        // params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setData(response.data); // Ensure fallback to an empty array
      console.log(response.data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="User Activity Log" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
        <DataTableExample data={data} />
      </main>
    </div>
  );
};

export default UserActivityPage;
