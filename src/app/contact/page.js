"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import styles from "./page.module.css";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    { icon: <Mail size={20} />, label: "Email Us", value: "hello@shoeking.com", sub: "We reply within 24 hours" },
    { icon: <Phone size={20} />, label: "Call Us", value: "+1 (800) SHOE-KING", sub: "Mon–Fri, 9am–6pm EST" },
    { icon: <MapPin size={20} />, label: "Visit Us", value: "123 Crown Avenue, NY 10001", sub: "Open Mon–Sat, 10am–8pm" },
    { icon: <Clock size={20} />, label: "Live Chat", value: "Available 24/7", sub: "Fastest way to get help" },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>Get in Touch</p>
          <h1 className={styles.title}>
            We&apos;d Love to <span className="gold-gradient-text">Hear from You</span>
          </h1>
          <p className={styles.sub}>
            Whether it&apos;s a question about your order, a product inquiry, or just a kind word —
            our team is here for you.
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Contact Info Cards */}
          <div className={styles.infoCol}>
            {contactInfo.map((info) => (
              <div key={info.label} className={styles.infoCard}>
                <div className={styles.infoIcon}>{info.icon}</div>
                <div>
                  <h3 className={styles.infoLabel}>{info.label}</h3>
                  <p className={styles.infoValue}>{info.value}</p>
                  <p className={styles.infoSub}>{info.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Send a Message</h2>

            {sent ? (
              <div className={styles.successMsg}>
                <CheckCircle size={40} className={styles.successIcon} />
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. Our team will be in touch within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => setSent(false)}>
                  Send Another
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Your Name</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      className="input"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="input"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Subject</label>
                  <select
                    name="subject"
                    className="input"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a topic...</option>
                    <option value="order">Order Inquiry</option>
                    <option value="return">Return / Exchange</option>
                    <option value="product">Product Question</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className={`input ${styles.textarea}`}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
