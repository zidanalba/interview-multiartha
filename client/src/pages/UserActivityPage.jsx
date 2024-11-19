import React from "react";
import DataTableExample from "../components/DataTable";
import Header from "../components/Header";

const UserActivityPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="User Activity Log" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 xl:px-20">
        <DataTableExample />
      </main>
    </div>
  );
};

export default UserActivityPage;
