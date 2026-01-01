import React, { forwardRef } from 'react';
import './export-styles.css';

// --- INSTAGRAM STORY CARD ---
export const InstaStoryCard = forwardRef(({ data }, ref) => {
    if (!data) return null;
    
    // Import logic helper directly inside component to avoid top-level relative import issues if any
    const getCredibilityBadge = (d) => {
        const p = d.personality.label;
        if (p.includes("Entertainment")) return "Peak spending: 10 PM – 2 AM";
        if (p.includes("Food")) return "Top 15% Restaurant Spender";
        if (p.includes("Saver")) return "Saved 20% more than average";
        if (p.includes("Shopper")) return "Weekend-heavy spender";
        if (p.includes("Travel")) return "Most active region: International";
        return "Top 20% Budget Keeper";
    };

    const getPunchyCopy = (label, desc) => {
         if (label.includes("Entertainment")) return "Day you saves.\nNight you spends.";
         if (label.includes("Food")) return "Your kitchen stays clean.\nYour delivery apps don't.";
         if (label.includes("Saver")) return "You treat your savings\nlike a high score.";
         if (label.includes("Shopper")) return "Add to cart now.\nThink about it never.";
         return desc.length > 50 ? "Your money reflects\nwho you truly are." : desc;
    };

    const getIcon = (label) => {
        if (label.includes("Entertainment")) return "🧠";
        if (label.includes("Food")) return "🍔";
        if (label.includes("Saver")) return "🐷";
        if (label.includes("Shopper")) return "🛍️";
        if (label.includes("Travel")) return "✈️";
        return "✨";
    };

    const getGradientClass = (label) => {
        if (label.includes("Entertainment")) return "gradient-purple";
        if (label.includes("Food")) return "gradient-red";
        if (label.includes("Saver")) return "gradient-green";
        return "gradient-blue";
    };

    const badge = getCredibilityBadge(data);
    const punchyCopy = getPunchyCopy(data.personality.label, data.personality.description);
    const unicodeIcon = getIcon(data.personality.label);
    const gradient = getGradientClass(data.personality.label);

    const periodStr = data.period.includes("20") ? data.period : `December ${new Date().getFullYear()}`; 

    return (
        <div ref={ref} className={`insta-story-container ${gradient}`}>
            
            {/* ZONE 1: IDENTITY */}
            <div className="story-header">
                <div className="insta-emoji">{unicodeIcon}</div>
                <div className="credibility-badge">{badge}</div>
            </div>

            {/* ZONE 2: PERSONALITY */}
            <div className="story-hero">
                <h1 className="insta-title">
                    {data.personality.label.replace(" ", "\n")}
                </h1>
                
                <p className="insta-subtitle">
                    {punchyCopy}
                </p>
            </div>

            {/* ZONE 3: CONTEXT */}
            <div className="story-footer">
                <div className="footer-line"></div>
                <div className="footer-brand">Money Wrapped</div>
                <div className="footer-brand" style={{ fontSize: '32px', marginTop: '15px' }}>
                    {periodStr}
                </div>
                <div className="footer-tagline">Not advice. Just clarity.</div>
            </div>
        </div>
    );
});

// --- PDF REPORT ---
export const PDFReport = forwardRef(({ data }, ref) => {
    if (!data) return null;

    const formatCurrency = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

    return (
        <div ref={ref} className="pdf-container">
            {/* PAGE 1 */}
            <div className="pdf-page">
                <div className="pdf-header">
                    <div className="pdf-logo">💸 COINZO</div>
                    <div className="pdf-date">{data.period}</div>
                </div>

                <div className="pdf-hero">
                    <h1>Your Money Wrapped</h1>
                    <div className="pdf-big-number">{formatCurrency(data.total_spent)}</div>
                    <p style={{ color: '#64748b', fontSize: '18px' }}>Total spent this month</p>
                </div>

                <div className="pdf-card">
                    <div className="pdf-section-title">🧠 Money Personality</div>
                    <h2 style={{ fontSize: '28px', margin: '10px 0', color: '#1e293b' }}>{data.personality.label}</h2>
                    <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.6 }}>{data.personality.description}</p>
                </div>

                <div className="pdf-card">
                    <div className="pdf-section-title">📊 Spending Patterns</div>
                    {data.patterns.slice(0, 3).map((p, i) => (
                        <div key={i} className="pdf-insight-item">
                            <div className="pdf-icon">🔹</div>
                            <div>{p}</div>
                        </div>
                    ))}
                </div>
                
                <div className="pdf-footer">
                    Generated by COINZO • page 1 of 2
                </div>
            </div>

            {/* PAGE 2 */}
            <div className="pdf-page">
                <div className="pdf-header">
                    <div className="pdf-logo">💸 COINZO</div>
                    <div className="pdf-date">{data.period}</div>
                </div>

                <div className="pdf-card" style={{ borderColor: '#fca5a5', background: '#fff5f5' }}>
                    <div className="pdf-section-title" style={{ color: '#b91c1c' }}>⚠️ Risk Projection</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#991b1b', marginBottom: '10px' }}>
                        Buffer runs out in {data.risk.days_left} days
                    </div>
                    <p style={{ color: '#7f1d1d' }}>
                        Based on your current spending velocity, you are projected to hit your budget limit before the month ends.
                        Current buffer remaining: <strong>₹{data.risk.buffer}</strong>.
                    </p>
                </div>

                <div className="pdf-card" style={{ borderColor: '#93c5fd', background: '#eff6ff' }}>
                    <div className="pdf-section-title" style={{ color: '#1d4ed8' }}>✨ Recommendation</div>
                    <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af' }}>
                        {data.recommendation}
                    </p>
                    <p style={{ fontSize: '14px', marginTop: '10px', color: '#3b82f6' }}>
                        Applying this one change could extend your budget by ~15%.
                    </p>
                </div>

                <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center' }}>
                    <h3 style={{ color: '#0f172a', fontSize: '24px' }}>Keep tracking. Stay in control.</h3>
                    <p style={{ color: '#64748b' }}>See you next month!</p>
                </div>

                <div className="pdf-footer">
                    Generated by COINZO • page 2 of 2
                </div>
            </div>
        </div>
    );
});
