import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAlert } from "../components/AlertContext";
import { AlertCustomStyles } from "../components/AlertCustomStyles";
import Header from "../components/Header";
import Modal from "../components/Modal";
import ProductsTable from "../components/ProductsTable";
import { isTokenExpired, refreshToken } from "../utils";

const UserPage = (isAuthenticated) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]); // Initialized as an empty array
  const tableColumns = [{ name: "Id" }, { name: "Email" }, { name: "Roles" }, { name: "Actions" }];
  const [userFormData, setUserFormData] = useState({
    email: "",
    roles: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserFormData({
      email: "",
      roles: [],
    });
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setUserFormData({
      email: "",
      roles: [],
    });
  };

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

  const handleSubmit = async () => {
    let token = localStorage.getItem("access_token");

    if (isTokenExpired(token)) {
      token = await refreshToken();
      if (!token) {
        alert("Gagal memperbarui token. Silakan login kembali.");
        return;
      }
    }

    const payload = { ...userFormData };

    try {
      const response = await axios.post("http://localhost:5000/user/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      closeModal();
      setUserFormData({
        email: "",
        roles: [],
      });
      fetchData();
      showAlert("Data submitted successfully", "success");
      //   navigate("/admin/user-management");
    } catch (error) {
      showAlert("Error creating the user.", "error");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!id) return;
    let token = localStorage.getItem("access_token");

    if (isTokenExpired(token)) {
      token = await refreshToken();
      if (!token) {
        alert("Gagal memperbarui token. Silakan login kembali.");
        return;
      }
    }

    try {
      await axios.delete(`http://localhost:5000/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchData();
      closeDeleteModal();
      showAlert("Data deleted successfully", "success");
    } catch (error) {
      showAlert("Error when deleteing the user", "error");
    }
  };

  const handleEditUser = async (id) => {
    if (!id) return;
    let token = localStorage.getItem("access_token");

    if (isTokenExpired(token)) {
      token = await refreshToken();
      if (!token) {
        alert("Gagal memperbarui token. Silakan login kembali.");
        return;
      }
    }

    try {
      const response = await axios.get(`http://localhost:5000/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.data;
      setUserFormData(userData);
    } catch (error) {
      console.error("There was an error deleting the user!", error);
      showAlert("Error when fetching the user", "error");
    }
  };

  const handleSubmitEditUser = async (id) => {
    if (!id) return;
    let token = localStorage.getItem("access_token");

    if (isTokenExpired(token)) {
      token = await refreshToken();
      if (!token) {
        alert("Gagal memperbarui token. Silakan login kembali.");
        return;
      }
    }

    const payload = { ...userFormData };

    try {
      await axios.put(`http://localhost:5000/user/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchData();
      closeEditModal();
      showAlert("Data edited successfully", "success");
    } catch (error) {
      showAlert("Error when updating the user", "error");
    }
  };

  const { showAlert } = useAlert();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="User" isAuthenticated={isAuthenticated} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
        <ProductsTable
          data={data}
          title="User List"
          columns={tableColumns}
          isAuthenticated={isAuthenticated}
          formData={userFormData}
          setFormData={setUserFormData}
          handleSubmit={handleSubmit}
          isModalOpen={isModalOpen}
          openModal={openModal}
          closeModal={closeModal}
          isDeleteModalOpen={isDeleteModalOpen}
          openDeleteModal={openDeleteModal}
          closeDeleteModal={closeDeleteModal}
          handleDeleteUser={handleDeleteUser}
          isEditModalOpen={isEditModalOpen}
          openEditModal={openEditModal}
          closeEditModal={closeEditModal}
          handleEditUser={handleEditUser}
          handleSubmitEditUser={handleSubmitEditUser}
        />
      </main>
    </div>
  );
};

export default UserPage;
