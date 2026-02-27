"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import KanbanBoard from "@/components/applications/KanbanBoard";
import ApplicationForm from "@/components/applications/ApplicationForm";
import { useApplications } from "@/hooks/useApplications";
import { useToast } from "@/components/ui/Toast";

export default function ApplicationsPage() {
  const toast = useToast();
  const {
    applications,
    loading,
    error,
    setFilters,
    createApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
  } = useApplications();

  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [search, setSearch] = useState("");

  const handleSearch = (value) => {
    setSearch(value);
    setFilters((prev) => ({ ...prev, search: value || undefined }));
  };

  const handleAdd = () => {
    setEditingApp(null);
    setShowForm(true);
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setShowForm(true);
  };

  const handleSave = async (data) => {
    if (editingApp) {
      await updateApplication(editingApp._id, data);
      toast.success("Application updated successfully");
    } else {
      await createApplication(data);
      toast.success("Application created successfully");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this application?")) {
      await deleteApplication(id);
      toast.success("Application deleted");
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateStatus(id, status);
    toast.info(`Status changed to ${status}`);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingApp(null);
  };

  return (
    <>
      <TopBar
        title="Applications"
        subtitle={`${applications.length} total`}
        searchValue={search}
        onSearchChange={handleSearch}
        onAddClick={handleAdd}
        addLabel="New Application"
      />

      <div style={{ padding: "var(--space-6)", overflowX: "auto" }}>
        <KanbanBoard
          applications={applications}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>

      {showForm && (
        <ApplicationForm
          application={editingApp}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </>
  );
}
