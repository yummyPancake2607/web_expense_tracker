import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from "framer-motion";

export const BigNumber = ({ data }) => {
    const target = data.total_spent;
    
    // Spring animation for smooth counting
    const springValue = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        springValue.set(target);
    }, [target, springValue]);

    return (
        <div style={{ textAlign: 'center' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="wrapped-big-number"
            >
                <Counter value={springValue} />
            </motion.div>
            
            <motion.p 
                className="wrapped-subtitle" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{ marginTop: '10px', fontSize: '1.4rem' }}
            >
                That’s how much you spent this month 🚀
            </motion.p>
        </div>
    );
};

// Helper component to render the motion value
const Counter = ({ value }) => {
    const [displayValue, setDisplayValue] = React.useState(0);

    useEffect(() => {
        const unsubscribe = value.on("change", (latest) => {
            setDisplayValue(latest);
        });
        return unsubscribe;
    }, [value]);

    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(displayValue);
};

export default BigNumber;
