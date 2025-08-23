import React from "react";
import './App.css';
import { motion } from "framer-motion";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import {
  FaGithub,
  FaTwitter,
  FaGlobe,
  FaEnvelope
} from "react-icons/fa";
import Dashboard from "./Dashboard"; // ✅ import real Dashboard.js

// Features for homepage
const features = [
  { icon: "📅", title: "Effortless Expense Logging", description: "Log purchases quickly with date, category, amount and notes." },
  { icon: "📊", title: "Instant Visual Reports", description: "Pie and bar charts reveal trends by category and monthly spending." },
  { icon: "🎯", title: "Set Budgets & Alerts", description: "Create category goals. Get alerted before overspending." },
  { icon: "🔒", title: "Private. Secure. Yours.", description: "No ads. No selling your data. Info is stored securely." },
  { icon: "⚡", title: "Lightning Search", description: "Find any expense instantly by keyword, category, or date." },
  { icon: "💻", title: "Open Source", description: "Fork or self-host. Clean API & schema for builders." },
];

const sectionFadeIn = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.13, duration: 0.7, type: "spring", stiffness: 60 },
  }),
};

function BackgroundBlobs() {
  return (
    <div className="blobs-bg">
      <svg className="bl-1" viewBox="0 0 400 400">
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="85%">
            <stop offset="0%" stopColor="#58a6ffcc" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="220" rx="170" ry="115" fill="url(#g1)" />
      </svg>
      <svg className="bl-2" viewBox="0 0 360 360">
        <defs>
          <radialGradient id="g2" cx="50%" cy="50%" r="85%">
            <stop offset="0%" stopColor="#b27cffbb" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <ellipse cx="180" cy="140" rx="95" ry="92" fill="url(#g2)" />
      </svg>
      <svg className="bl-3" viewBox="0 0 300 300">
        <defs>
          <radialGradient id="g3" cx="50%" cy="50%" r="98%">
            <stop offset="0%" stopColor="#21262dac" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <ellipse cx="150" cy="108" rx="128" ry="58" fill="url(#g3)" />
      </svg>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="navbar glass-nav navbar-fun">
      <div className="navbar-inner">
        <div className="logo logo-animated">
          <span className="logo-sparkle">💸</span>
          <span className="logo-text logo-gradient">Expense Tracker</span>
        </div>
        <div className="navbar-right">
          <a href="#about" className="nav-link-underline">About</a>
          <a href="#features" className="nav-link-underline">Features</a>
          <SignInButton mode="modal"><button className="nav-btn nav-signin">Sign In</button></SignInButton>
          <SignUpButton mode="modal"><button className="nav-btn nav-signup">Sign Up</button></SignUpButton>
        </div>
      </div>
    </nav>
  );
}

function AnimatedLines() {
  return (
    <svg className="hero-lines" viewBox="0 0 550 60" fill="none">
      <defs>
        <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#58a6ff" />
          <stop offset="100%" stopColor="#b27cff" />
        </linearGradient>
      </defs>
      <path
        d="M10,40 Q100,27 180,42 T350,45 T540,28"
        stroke="url(#heroLine)"
        strokeWidth="5"
        fill="none"
        opacity="0.55"
        style={{ filter: "blur(0.5px) drop-shadow(0 3px 20px #58a6ff44)" }}
      >
        <animate
          attributeName="d"
          values="
          M10,40 Q100,27 180,42 T350,45 T540,28;
          M10,32 Q100,47 180,27 T350,55 T540,28;
          M10,40 Q100,27 180,42 T350,45 T540,28"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

function HeroSection() {
  return (
    <header className="hero-section hero-no-card">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
      >
        <h1 className="hero-title hero-rainbow animate-gradient">
          <span className="hero-accent-pop">Track</span> your 
          <span className="hero-gradient"> Expenses, </span><br />
          <span className="hero-accent-blue">Control</span> your life.
        </h1>
        <p className="hero-subtitle hero-fun-desc">
          Simple. Private. Your finances, visualized & understood.
        </p>
        <SignUpButton mode="modal">
          <button className="hero-btn hero-fun-btn">🚀 Get Started Free</button>
        </SignUpButton>
        <AnimatedLines />
      </motion.div>
    </header>
  );
}

function Features() {
  return (
    <section className="features-section" id="features">
      <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}
        variants={sectionFadeIn} custom={0}>
        <span className="section-icon">✨</span>
        <h2>Features</h2>
      </motion.div>
      <div className="feature-grid">
        {features.map((f, i) => (
          <motion.div key={f.title} className="cool-card"
            initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={i} variants={sectionFadeIn}
          >
            <div className="card-bar" />
            <div style={{ fontSize: "2rem", marginBottom: 10 }}>{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-desc">{f.description}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about">
      <motion.div className="section-header" initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.4 }} variants={sectionFadeIn} custom={0}>
        <span className="section-icon">💡</span>
        <h2>About Expense Tracker</h2>
      </motion.div>
      <motion.div className="cool-card about-card-glass"
        initial="hidden" whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionFadeIn} custom={1}>
        <p><b>Life’s busy. Tracking spending shouldn’t be hard.</b><br />
          Expense Tracker is designed for clarity, privacy, and modern simplicity.</p>
        <ul className="about-bullets">
          <li>✨ 100% Open Source</li>
          <li>🔒 Privacy-focused</li>
          <li>🖥️ Built by devs for everyone</li>
          <li>♥ Zero ads, Zero clutter</li>
        </ul>
        <div className="about-social">
          <a href="https://github.com/your-github"><FaGithub/></a>
          <a href="https://yourdomain.com"><FaGlobe/></a>
          <a href="https://twitter.com/yourhandle"><FaTwitter/></a>
          <a href="mailto:you@example.com"><FaEnvelope/></a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer glass-footer">
      <div className="footer-inner">
        <div className="footer-social-row">
          <a href="https://github.com/your-github"><FaGithub/></a>
          <a href="https://yourdomain.com"><FaGlobe/></a>
          <a href="https://twitter.com/yourhandle"><FaTwitter/></a>
          <a href="mailto:you@example.com"><FaEnvelope/></a>
        </div>
        <div className="footer-link-row">
          <span>© {new Date().getFullYear()} Expense Tracker. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <SignedOut>
        <BackgroundBlobs />
        <Navbar />
        <HeroSection />
        <Features />
        <About />
        <Footer />
      </SignedOut>

      <SignedIn>
        <Dashboard /> {/* ✅ Now using proper Dashboard.js */}
      </SignedIn>
    </>
  );
}

export default App;