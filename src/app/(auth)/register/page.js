"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setFieldErrors({ password: "Password must be at least 6 characters" });
      setLoading(false);
      return;
    }

    try {
      await register(form.name, form.email, form.password);
      window.location.href = "/applications";
    } catch (err) {
      if (err.data?.errors) {
        setFieldErrors(
          Object.fromEntries(
            Object.entries(err.data.errors).map(([k, v]) => [
              k,
              Array.isArray(v) ? v[0] : v,
            ]),
          ),
        );
      } else {
        setError(err.data?.error || err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>📋</div>
          <h1 className={styles.brandName}>JobTracker</h1>
          <p className={styles.brandTagline}>
            Start tracking your applications
          </p>
        </div>

        <div className={styles.authCard}>
          <h2 className={styles.authTitle}>Create an account</h2>
          <p className={styles.authSubtitle}>Get started — it&apos;s free</p>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="name" className={styles.label}>
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className={styles.input}
                required
                autoFocus
              />
              {fieldErrors.name && (
                <span className={styles.fieldError}>{fieldErrors.name}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
                required
                autoComplete="email"
              />
              {fieldErrors.email && (
                <span className={styles.fieldError}>{fieldErrors.email}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                className={styles.input}
                required
                autoComplete="new-password"
              />
              {fieldErrors.password && (
                <span className={styles.fieldError}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                required
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <span className={styles.fieldError}>
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className={styles.authFooter}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
