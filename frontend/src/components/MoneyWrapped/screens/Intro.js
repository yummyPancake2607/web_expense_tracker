import React from 'react';
import { motion } from "framer-motion";

export const Intro = ({ data }) => (
    <div style={{ textAlign: 'center' }}>
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <h1 className="wrapped-title">Your Money<br/>Wrapped</h1>
        </motion.div>

        <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
            style={{ width: '60px', height: '4px', background: 'white', margin: '24px auto', borderRadius: '2px' }}
        />

        <motion.h2 
            className="wrapped-subtitle" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
        >
            {data.period}
        </motion.h2>

        <motion.p 
            className="wrapped-subtitle" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            style={{ marginTop: '20px', fontSize: '1rem', fontWeight: '400' }}
        >
            A 60-second story of<br/>how your money behaved
        </motion.p>
    </div>
);

export default Intro;
