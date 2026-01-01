import React from 'react';
import { motion } from "framer-motion";

const ProgressBar = ({ isActive, isCompleted, duration }) => {
    // Optimization: If completed, render static 100% width immediately to avoid animation lag.
    if (isCompleted) {
        return (
            <div className="progress-bar-bg">
                <div 
                    className="progress-bar-fill" 
                    style={{ width: '100%', background: 'white', height: '100%' }}
                />
            </div>
        );
    }

    return (
        <div className="progress-bar-bg">
            <motion.div 
                className="progress-bar-fill"
                initial={{ width: "0%" }}
                animate={{ width: isActive ? "100%" : "0%" }}
                transition={{ duration: isActive ? duration / 1000 : 0, ease: "linear" }}
                style={{ 
                    background: 'white',
                    height: '100%'
                }}
            />
        </div>
    );
};

export default ProgressBar;
