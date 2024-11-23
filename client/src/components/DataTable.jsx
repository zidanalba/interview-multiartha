import React, { useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { AnimatePresence, motion } from "framer-motion";

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
    name: "User ID",
    selector: (row) => row.user_id,
    sortable: true,
  },
  {
    name: "Activity",
    selector: (row) => row.activity,
    sortable: true,
  },
  {
    name: "Timestamp",
    selector: (row) => row.timestamp,
    sortable: true,
  },
  {
    name: "IP Address",
    selector: (row) => row.ip_address,
    sortable: true,
  },
  {
    name: "User Agent",
    selector: (row) => row.user_agent,
    sortable: true,
  },
];

const DataTableExample = (data) => {
  const [filterText, setFilterText] = useState("");

  const dataDummy = [
    {
      user_id: 1,
      activity: "Successfully logged in",
      timestamp: "2024-11-21 09:26:39.441",
      ip_address: "127.0.0.1",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
    },
    { user_id: 2, activity: "Jane Smith", timestamp: "jane@example.com", ip_address: 27 },
    { user_id: 3, activity: "Bob Johnson", timestamp: "bob@example.com", ip_address: 45 },
    { user_id: 4, activity: "Alice Williams", timestamp: "alice@example.com", ip_address: 19 },
    { user_id: 5, activity: "Tom Davis", timestamp: "tom@example.com", ip_address: 35 },
    { user_id: 6, activity: "Sara Lee", timestamp: "sara@example.com", ip_address: 28 },
  ];
  console.log(data.data.data);
  const log_data = data.data.data;

  // console.log(data);

  return (
    <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Daftar Pengguna</h2>
      </div>
      <DataTable columns={columns} theme="solarized" data={log_data} pagination highlightOnHover pointerOnHover className="table-transparent rounded-lg shadow-md" />
    </motion.div>
  );
};

export default DataTableExample;
