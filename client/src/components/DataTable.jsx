import React, { useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { AnimatePresence, motion } from "framer-motion";

const data = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 32 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 27 },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 45 },
  { id: 4, name: "Alice Williams", email: "alice@example.com", age: 19 },
  { id: 5, name: "Tom Davis", email: "tom@example.com", age: 35 },
  { id: 6, name: "Sara Lee", email: "sara@example.com", age: 28 },
];

createTheme(
  "solarized",
  {
    text: {
      primary: "#bac0cc",
      secondary: "#8f99a7",
      disabled: "##8f99a7",
    },
    background: {
      default: "#1c2634",
    },
    context: {
      background: "#E91E63",
      text: "##8f99a7",
    },
    divider: {
      default: "#2c3643",
    },
    button: {
      default: "#FFFFFF",
      focus: "rgba(255, 255, 255, .54)",
      hover: "rgba(255, 255, 255, .12)",
      disabled: "rgba(255, 255, 255, .18)",
    },
    selected: {
      default: "rgba(0, 0, 0, .7)",
      text: "#FFFFFF",
    },
    highlightOnHover: {
      default: "#18212f",
      text: "#FFFFFF",
    },
    striped: {
      default: "rgba(0, 0, 0, .87)",
      text: "#FFFFFF",
    },
  },
  "dark"
);

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Age",
    selector: (row) => row.age,
    sortable: true,
  },
];

const DataTableExample = () => {
  const [filterText, setFilterText] = useState("");

  const filteredData = data.filter((item) => item.name.toLowerCase().includes(filterText.toLowerCase()) || item.email.toLowerCase().includes(filterText.toLowerCase()));

  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Daftar Pengguna</h2>
      </div>
      <DataTable columns={columns} theme="solarized" data={filteredData} pagination highlightOnHover pointerOnHover className="table-transparent rounded-lg shadow-md" />
    </motion.div>
  );
};

export default DataTableExample;
