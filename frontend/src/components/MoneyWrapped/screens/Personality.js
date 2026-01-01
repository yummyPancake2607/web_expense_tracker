import React from 'react';
import { motion } from "framer-motion";
import { getCredibilityBadge, getPunchyCopy, getIcon } from '../../../utils/wrappedUtils';

export const Personality = ({ data }) => {
    const badge = getCredibilityBadge(data);
    const punchyCopy = getPunchyCopy(data.personality.label, data.personality.description);
    const unicodeIcon = getIcon(data.personality.label);
    const periodStr = data.period.includes("20") ? data.period : `December ${new Date().getFullYear()}`; 

    return (
        <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            textAlign: 'center', 
            alignItems: 'center',
            padding: '20px 0'
        }}>
            
            {/* ZONE 1: IDENTITY */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                 <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    style={{ fontSize: '6rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}
                >
                    {unicodeIcon}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)',
                        padding: '8px 20px',
                        borderRadius: '30px',
                        marginTop: '15px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                >
                    {badge}
                </motion.div>
            </div>

            {/* ZONE 2: PERSONALITY (Hero) */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                <motion.h1 
                    className="wrapped-title" 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                    style={{ 
                        fontSize: '3.5rem', 
                        margin: '0', 
                        lineHeight: 1.05, 
                        fontWeight: '800',
                        letterSpacing: '-1px'
                    }}
                >
                    {data.personality.label.replace(" ", "\n")}
                </motion.h1>

                <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    style={{ height: '4px', width: '60px', background: 'rgba(255,255,255,0.6)', margin: '25px auto', borderRadius: '2px' }}
                />

                <motion.p 
                    className="wrapped-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '500', 
                        lineHeight: 1.4,
                        whiteSpace: 'pre-wrap',
                        maxWidth: '90%',
                        margin: '0 auto'
                    }}
                >
                    {punchyCopy}
                </motion.p>
            </div>

            {/* ZONE 3: CONTEXT (Footer) */}
            <motion.div 
                style={{ flex: '0 0 auto', opacity: 0.8 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <div style={{ width: '80px', height: '2px', background: 'rgba(255,255,255,0.4)', margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '700' }}>
                    Money Wrapped · {periodStr}
                </div>
            </motion.div>

        </div>
    );
};

export default Personality;
