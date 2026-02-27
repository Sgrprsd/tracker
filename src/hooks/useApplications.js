"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/api";

export function useApplications(initialFilters = {}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
      });
      const query = params.toString();
      const data = await api.get(
        `/api/applications${query ? `?${query}` : ""}`,
      );
      setApplications(data.applications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const createApplication = async (appData) => {
    const data = await api.post("/api/applications", appData);
    setApplications((prev) => [data.application, ...prev]);
    return data.application;
  };

  const updateApplication = async (id, appData) => {
    const data = await api.put(`/api/applications/${id}`, appData);
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? data.application : app)),
    );
    return data.application;
  };

  const updateStatus = async (id, status) => {
    const data = await api.patch(`/api/applications/${id}/status`, { status });
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? data.application : app)),
    );
    return data.application;
  };

  const deleteApplication = async (id) => {
    await api.delete(`/api/applications/${id}`);
    setApplications((prev) => prev.filter((app) => app._id !== id));
  };

  return {
    applications,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchApplications,
    createApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
  };
}
