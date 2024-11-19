import React from "react";
import DataTableExample from "../components/DataTable";
import Header from "../components/Header";

const UserPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="User" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
        <DataTableExample />
      </main>
    </div>
  );
};

export default UserPage;
