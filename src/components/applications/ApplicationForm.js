"use client";

import { useState, useEffect } from "react";
import {
  APPLICATION_STATUSES,
  APPLICATION_PRIORITIES,
  APPLICATION_TYPES,
} from "@/lib/validators";
import { STATUS_CONFIG, PRIORITY_CONFIG, TYPE_CONFIG } from "@/utils/constants";
import styles from "./ApplicationForm.module.css";

const emptyForm = {
  company: "",
  position: "",
  status: "wishlist",
  priority: "medium",
  jobUrl: "",
  location: "",
  type: "full-time",
  notes: "",
  appliedDate: "",
  interviewDate: "",
  followUpDate: "",
  salary: { min: "", max: "", currency: "INR" },
};

export default function ApplicationForm({ application, onSave, onClose }) {
  const isEdit = !!application;
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (application) {
      setForm({
        company: application.company || "",
        position: application.position || "",
        status: application.status || "wishlist",
        priority: application.priority || "medium",
        jobUrl: application.jobUrl || "",
        location: application.location || "",
        type: application.type || "full-time",
        notes: application.notes || "",
        appliedDate: application.appliedDate
          ? new Date(application.appliedDate).toISOString().split("T")[0]
          : "",
        interviewDate: application.interviewDate
          ? new Date(application.interviewDate).toISOString().split("T")[0]
          : "",
        followUpDate: application.followUpDate
          ? new Date(application.followUpDate).toISOString().split("T")[0]
          : "",
        salary: {
          min: application.salary?.min || "",
          max: application.salary?.max || "",
          currency: application.salary?.currency || "INR",
        },
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");

    if (name.startsWith("salary.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        salary: { ...prev.salary, [field]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Build payload
      const payload = {
        ...form,
        salary: {
          min: form.salary.min ? Number(form.salary.min) : 0,
          max: form.salary.max ? Number(form.salary.max) : 0,
          currency: form.salary.currency,
        },
        appliedDate: form.appliedDate
          ? new Date(form.appliedDate).toISOString()
          : "",
        interviewDate: form.interviewDate
          ? new Date(form.interviewDate).toISOString()
          : "",
        followUpDate: form.followUpDate
          ? new Date(form.followUpDate).toISOString()
          : "",
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEdit ? "Edit Application" : "New Application"}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          {/* Company & Position */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Company *</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g. Google"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Position *</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>
          </div>

          {/* Status & Priority */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={styles.select}
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s]?.label || s}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={styles.select}
              >
                {APPLICATION_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_CONFIG[p]?.label || p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Type */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g. Remote, Bangalore"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Job Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={styles.select}
              >
                {APPLICATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_CONFIG[t]?.label || t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job URL */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Job URL</label>
            <input
              name="jobUrl"
              value={form.jobUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://..."
              type="url"
            />
          </div>

          {/* Dates */}
          <div className={styles.sectionDivider}>Dates</div>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Applied Date</label>
              <input
                name="appliedDate"
                value={form.appliedDate}
                onChange={handleChange}
                className={styles.input}
                type="date"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Interview Date</label>
              <input
                name="interviewDate"
                value={form.interviewDate}
                onChange={handleChange}
                className={styles.input}
                type="date"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Follow-up Date</label>
            <input
              name="followUpDate"
              value={form.followUpDate}
              onChange={handleChange}
              className={styles.input}
              type="date"
            />
          </div>

          {/* Salary */}
          <div className={styles.sectionDivider}>Salary Range</div>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Min (₹)</label>
              <input
                name="salary.min"
                value={form.salary.min}
                onChange={handleChange}
                className={styles.input}
                type="number"
                min="0"
                placeholder="e.g. 800000"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Max (₹)</label>
              <input
                name="salary.max"
                value={form.salary.max}
                onChange={handleChange}
                className={styles.input}
                type="number"
                min="0"
                placeholder="e.g. 1500000"
              />
            </div>
          </div>

          {/* Notes */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Add any notes about this application…"
              rows={3}
            />
          </div>
        </form>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={saving}
            onClick={handleSubmit}
          >
            {saving ? "Saving…" : isEdit ? "Update" : "Create Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
