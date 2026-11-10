"use client";
import { useState } from "react";
import { User, Package, Settings, LogOut, ChevronRight, Crown } from "lucide-react";
import styles from "./page.module.css";

const mockOrders = [
  { id: "#SK-1042", date: "Sep 18, 2026", status: "Delivered", items: 2, total: "$378.00", product: "Air Monarch Elite" },
  { id: "#SK-0987", date: "Sep 01, 2026", status: "In Transit", items: 1, total: "$215.00", product: "Velocity Pro X" },
  { id: "#SK-0856", date: "Aug 14, 2026", status: "Delivered", items: 3, total: "$602.00", product: "Crown Classic Oxford" },
];

const tabs = [
  { id: "orders", label: "My Orders", icon: <Package size={18} /> },
  { id: "profile", label: "Profile", icon: <User size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            <Crown size={28} />
          </div>
          <div>
            <h1 className={styles.name}>James Kingsley</h1>
            <p className={styles.email}>james.k@example.com</p>
            <span className="badge badge-gold" style={{ marginTop: 8, display: 'inline-flex' }}>
              👑 Royal Member
            </span>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Sidebar Nav */}
          <nav className={styles.nav}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.navBtn} ${activeTab === tab.id ? styles.navBtnActive : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
                <ChevronRight size={14} className={styles.chevron} />
              </button>
            ))}
            <button className={`${styles.navBtn} ${styles.logoutBtn}`}>
              <LogOut size={18} />
              Sign Out
            </button>
          </nav>

          {/* Content */}
          <div className={styles.content}>
            {activeTab === "orders" && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Order History</h2>
                <div className={styles.orders}>
                  {mockOrders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderLeft}>
                        <span className={styles.orderId}>{order.id}</span>
                        <span className={styles.orderProduct}>{order.product}</span>
                        <span className={styles.orderDate}>{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</span>
                      </div>
                        <div className={styles.orderRight}>
                        <span className={`${styles.orderStatus} ${order.status === "Delivered" ? styles.statusDelivered : styles.statusTransit}`}>
                          {order.status}
                        </span>
                        <span className={styles.orderTotal}>{order.total}</span>
                        <button className="btn btn-outline btn-sm">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Profile Information</h2>
                <form className={styles.profileForm}>
                  {[
                    { label: "Full Name", value: "James Kingsley", type: "text" },
                    { label: "Email Address", value: "james.k@example.com", type: "email" },
                    { label: "Phone Number", value: "+1 (555) 000-1234", type: "tel" },
                    { label: "Date of Birth", value: "1990-06-15", type: "date" },
                  ].map((field) => (
                    <div key={field.label} className={styles.fieldGroup}>
                      <label className={styles.label}>{field.label}</label>
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        className="input"
                      />
                    </div>
                  ))}
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </div>
            )}

            {activeTab === "settings" && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Account Settings</h2>
                <div className={styles.settingsList}>
                  {[
                    { label: "Email Notifications", desc: "Receive order updates and promotions via email", checked: true },
                    { label: "SMS Notifications", desc: "Get shipping updates via text message", checked: false },
                    { label: "Marketing Emails", desc: "Stay updated on new collections and offers", checked: true },
                    { label: "Two-Factor Authentication", desc: "Add an extra layer of security to your account", checked: false },
                  ].map((setting) => (
                    <div key={setting.label} className={styles.settingItem}>
                      <div>
                        <p className={styles.settingLabel}>{setting.label}</p>
                        <p className={styles.settingDesc}>{setting.desc}</p>
                      </div>
                      <label className={styles.toggle}>
                        <input type="checkbox" defaultChecked={setting.checked} className={styles.toggleInput} />
                        <span className={styles.toggleSlider} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
