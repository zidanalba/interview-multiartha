import { motion } from "framer-motion";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";

const ProductsTable = ({
  data,
  title,
  columns,
  isAuthenticated,
  formData,
  setFormData,
  handleSubmit,
  isModalOpen,
  openModal,
  closeModal,
  isDeleteModalOpen,
  openDeleteModal,
  closeDeleteModal,
  handleDeleteUser,
  isEditModalOpen,
  openEditModal,
  closeEditModal,
  handleEditUser,
  handleSubmitEditUser,
}) => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleRoleChange = (role) => {
    setFormData((prevData) => {
      const updatedRoles = prevData.roles.includes(role)
        ? prevData.roles.filter((r) => r !== role) // Remove role if unchecked
        : [...prevData.roles, role]; // Add role if checked
      return { ...prevData, roles: updatedRoles };
    });
  };

  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
        <button
          className="rounded-md flex items-center border border-purple-400 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-purple-400 hover:text-purple-300 hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={openModal}
        >
          <Plus size={18} className="mr-1" />
          Create User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {!isAuthenticated ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-red-300">
                  Unauthorized
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-300">
                  There is no data.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.roles.join(", ")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => {
                        handleEditUser(item.id);
                        setSelectedUserId(item.id);
                        openEditModal();
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => {
                        openDeleteModal();
                        setSelectedUserId(item.id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* <Modal isOpen={isModalOpen} onClose={closeModal} title="Create User" formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} /> */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create User"
        footer={
          <>
            <button
              className="rounded-md flex items-center border border-gray-400 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-gray-400 hover:text-gray-300 hover:bg-slate-800 hover:border-slate-800 focus:text-gray-400 focus:bg-slate-800 active:text-gray-400 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="rounded-md flex items-center border border-blue-400 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-blue-400 hover:text-blue-300 hover:bg-slate-800 hover:border-slate-800 focus:text-blue-400 focus:bg-slate-800 active:text-red-400 active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </>
        }
        children={
          <>
            <div className="flex flex-wrap mx-3 mb-6">
              <div className="w-full px-3 mb-5">
                <label className="block text-gray-100 text-sm mb-2" for="username">
                  Email
                </label>
                <input
                  className="bg-gray-800 shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData((prevData) => ({ ...prevData, email: e.target.value }))}
                />
              </div>
              <div className="w-full px-3">
                <label className="block text-gray-100 text-sm mb-2" for="username">
                  Roles
                </label>
                <div className="flex">
                  {["Admin", "Seller", "Buyer"].map((role) => (
                    <div className="flex items-center me-4" key={role}>
                      <input
                        id={`checkbox-${role}`}
                        type="checkbox"
                        checked={formData.roles.includes(role)}
                        onChange={() => handleRoleChange(role)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor={`checkbox-${role}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {role}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        }
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirmation to Delete User"
        footer={
          <>
            <button
              className="rounded-md flex items-center border border-gray-400 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-gray-400 hover:text-gray-300 hover:bg-slate-800 hover:border-slate-800 focus:text-gray-400 focus:bg-slate-800 active:text-gray-400 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
            <button
              className="rounded-md flex items-center border border-red-400 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-red-400 hover:text-red-300 hover:bg-slate-800 hover:border-slate-800 focus:text-red-400 focus:bg-slate-800 active:text-red-400 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={() => handleDeleteUser(selectedUserId)}
            >
              Delete
            </button>
          </>
        }
        children={<p>Are you sure you want to delete this user?</p>}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit User"
        footer={
          <>
            <button
              className="rounded-md flex items-center border border-gray-400 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-gray-400 hover:text-gray-300 hover:bg-slate-800 hover:border-slate-800 focus:text-gray-400 focus:bg-slate-800 active:text-gray-400 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={closeEditModal}
            >
              Cancel
            </button>
            <button
              className="rounded-md flex items-center border border-blue-400 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-blue-400 hover:text-blue-300 hover:bg-slate-800 hover:border-slate-800 focus:text-blue-400 focus:bg-slate-800 active:text-red-400 active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={() => handleSubmitEditUser(selectedUserId)}
            >
              Submit
            </button>
          </>
        }
        children={
          <>
            <div className="flex flex-wrap mx-3 mb-6">
              <div className="w-full px-3 mb-5">
                <label className="block text-gray-100 text-sm mb-2" for="username">
                  Email
                </label>
                <input
                  className="bg-gray-800 shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData((prevData) => ({ ...prevData, email: e.target.value }))}
                />
              </div>
              <div className="w-full px-3">
                <label className="block text-gray-100 text-sm mb-2" for="username">
                  Roles
                </label>
                <div className="flex">
                  {["Admin", "Seller", "Buyer"].map((role) => (
                    <div className="flex items-center me-4" key={role}>
                      <input
                        id={`checkbox-${role}`}
                        type="checkbox"
                        checked={formData.roles.includes(role)}
                        onChange={() => handleRoleChange(role)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor={`checkbox-${role}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {role}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        }
      />
    </motion.div>
  );
};

export default ProductsTable;
