import React from 'react';
import { motion } from "framer-motion";
import { FaPlay, FaMoon, FaBolt } from 'react-icons/fa'; // Assuming react-icons is installed, otherwise use emojis

// Fallback to emojis if react-icons is not desired, but package.json has it! "react-icons": "^5.5.0"
// Actually, simple emojis might be safer and faster to implement visually matching the image without guessing icon names. 
// The image has: 
// - Entertainment (Clapperboard?) -> 🎬 or similar
// - Night (Moon) -> 🌙
// - Weekend (Lightning?) -> ⚡

export const Patterns = ({ data }) => {
    const icons = ["🎬", "🌙", "⚡"]; // Matching the design roughly

    return (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 20px' }}>
             <motion.h2 
                className="wrapped-title" 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '2rem', marginBottom: '30px' }}
            >
                Spending Patterns
            </motion.h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {data.patterns.map((text, idx) => (
                    <motion.div 
                        key={idx} 
                        className="wrapped-card" 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (idx * 0.2), type: "spring", stiffness: 100 }}
                    >
                        <span className="wrapped-card-icon">{icons[idx] || "📊"}</span>
                        <span className="wrapped-card-text">{text}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Patterns;
