import Link from "next/link";
import { Crown, Award, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us — Shoe King",
  description: "Learn more about Shoe King's heritage, craftsmanship, and commitment to luxury footwear.",
};

export default function AboutPage() {
  return (
    <div style={{ padding: "80px 0", minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", padding: 12, borderRadius: "50%", background: "rgba(201,168,76,0.1)", marginBottom: 16 }}>
            <Crown size={36} color="var(--gold-400)" />
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: 16 }}>
            The Story Behind <span className="gold-gradient-text">Shoe King</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 650, margin: "0 auto" }}>
            Founded in 2010, Shoe King was born with a singular mission: to merge runway elegance with unmatched everyday comfort.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
          marginBottom: 60
        }}>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 28,
            textAlign: "center"
          }}>
            <Award size={32} color="var(--gold-400)" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Master Craftsmanship</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
              Every pair is inspected across 50+ quality checkpoints before it reaches your feet.
            </p>
          </div>

          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 28,
            textAlign: "center"
          }}>
            <ShieldCheck size={32} color="var(--gold-400)" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Authenticity Guaranteed</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
              100% genuine leathers and sustainably certified materials on all collections.
            </p>
          </div>

          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 28,
            textAlign: "center"
          }}>
            <HeartHandshake size={32} color="var(--gold-400)" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Royal Support</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
              Our dedicated concierge team is available 24/7 to assist with sizing and inquiries.
            </p>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/shop" className="btn btn-primary btn-lg">
            Explore Collection <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

