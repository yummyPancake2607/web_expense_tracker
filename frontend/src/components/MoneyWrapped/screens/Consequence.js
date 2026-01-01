import React from 'react';
import { motion } from "framer-motion";

export const Consequence = ({ data }) => {
    return (
        <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.h2 
                className="wrapped-title" 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '2rem' }}
            >
                If this continues...
            </motion.h2>
            
            <motion.div 
                className="wrapped-card" 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                style={{ 
                    background: 'rgba(220, 38, 38, 0.2)', // Red tint
                    border: '2px solid rgba(254, 202, 202, 0.5)',
                    marginTop: '30px',
                    padding: '40px 20px',
                    flexDirection: 'column',
                    textAlign: 'center',
                    boxShadow: '0 0 50px rgba(220, 38, 38, 0.4)'
                }}
            >
                <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0, lineHeight: 1.4 }}>
                    Budget breaks in <br/>
                    <motion.span 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        style={{ fontSize: '4.5rem', color: '#fca5a5', display: 'inline-block', margin: '10px 0' }}
                    >
                        {data.risk.days_left} days
                    </motion.span> 
                    <span style={{ fontSize: '3rem', verticalAlign: 'middle', marginLeft: '10px' }}>⚠️</span>
                </h3>
                   
                 <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.3)', margin: '25px 0' }}></div>
                 
                 <span style={{ fontSize: '1.4rem', opacity: 0.9, fontWeight: '600' }}>
                    Buffer left: ₹{data.risk.buffer}
                 </span>
            </motion.div>
        </div>
    );
};

export default Consequence;
