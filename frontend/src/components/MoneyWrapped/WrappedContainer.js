import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";

import Intro from './screens/Intro';
import BigNumber from './screens/BigNumber';
import Patterns from './screens/Patterns';
import Personality from './screens/Personality';
import Consequence from './screens/Consequence';
import RecommendationAndShare from './screens/Recommendation'; // Merged component
import ProgressBar from './ProgressBar';

import './money-wrapped.css';

// Screen Configuration
const SCREENS = [
    { component: Intro,    duration: 5000, bg: "gradient-blue" },
    { component: BigNumber, duration: 5000, bg: "gradient-dark" },
    { component: Patterns,  duration: 6000, bg: "gradient-green" },
    { component: Personality, duration: 7000, bg: "gradient-purple" },
    { component: Consequence, duration: 7000, bg: "gradient-red" },
    { component: RecommendationAndShare, duration: null, bg: "gradient-blue" } // Stops here
];

const WrappedContainer = ({ onClose }) => {
    const { getToken } = useAuth();
    const [step, setStep] = useState(0);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();
                const res = await fetch(`${API_URL}/wrapped`, {
                     headers: { Authorization: "Bearer " + token },
                });
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (e) {
                console.error("Failed to fetch wrapped data", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [getToken]);

    const goNext = () => {
        if (step < SCREENS.length - 1) {
            setStep(s => s + 1);
        } else {
            onClose();
        }
    };

    const goPrev = () => {
        if (step > 0) setStep(s => s - 1);
    };

    // Auto-advance logic
    useEffect(() => {
        if (!data || SCREENS[step].duration === null) return;
        
        const timer = setTimeout(() => {
            goNext();
        }, SCREENS[step].duration);

        return () => clearTimeout(timer);
    }, [step, data]);


    // Lock Body Scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleReplay = () => {
        setStep(0);
    };

    // Loading State
    if (loading) return (
        <div className="wrapped-overlay gradient-dark">
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="wrapped-title"
             >
                Loading...
             </motion.div>
        </div>
    );
    
    // Error State
    if (!data) return (
        <div className="wrapped-overlay gradient-dark">
            <div className="wrapped-title">No Data Found</div>
            <button className="secondary-btn" onClick={onClose} style={{maxWidth: '200px'}}>Close</button>
        </div>
    );

    const CurrentScreen = SCREENS[step].component;
    const currentBg = SCREENS[step].bg;

    return (
        <div className={`wrapped-overlay ${currentBg}`}>
            {/* Progress Bars */}
            <div className="wrapped-progress-container">
                {SCREENS.map((_, idx) => (
                    <ProgressBar 
                        key={idx} 
                        isActive={idx === step} 
                        isCompleted={idx < step} 
                        duration={SCREENS[idx].duration} 
                    />
                ))}
            </div>
            
            {/* Close Button UI */}
            <button className="wrapped-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button>

            {/* Tap Zones - Absolute positioning over everything */}
            <div className="tap-left" onClick={(e) => { e.stopPropagation(); goPrev(); }}></div>
            <div className="tap-right" onClick={(e) => { e.stopPropagation(); goNext(); }}></div>

            {/* Main Content with Transition */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={step}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="wrapped-content"
                >
                    <CurrentScreen data={data} onReplay={handleReplay} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default WrappedContainer;
