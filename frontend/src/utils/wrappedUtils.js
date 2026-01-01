export const getCredibilityBadge = (data) => {
    const p = data.personality.label;
    // synthesize specific badges based on personality type
    if (p.includes("Entertainment")) return "Peak spending: 10 PM – 2 AM";
    if (p.includes("Food")) return "Top 15% Restaurant Spender";
    if (p.includes("Saver")) return "Saved 20% more than average";
    if (p.includes("Shopper")) return "Weekend-heavy spender";
    if (p.includes("Travel")) return "Most active region: International";
    
    // Default fallback
    return "Top 20% Budget Keeper";
};

export const getPunchyCopy = (label, originalDesc) => {
    // Map personality labels to punchy 2-liners
    if (label.includes("Entertainment")) {
        return "Day you saves.\nNight you spends.";
    }
    if (label.includes("Food")) {
        return "Your kitchen stays clean.\nYour delivery apps don't.";
    }
    if (label.includes("Saver")) {
        return "You treat your savings\nlike a high score.";
    }
    if (label.includes("Shopper")) {
        return "Add to cart now.\nThink about it never.";
    }
    
    // Fallback: Try to split original description or just return it
    return originalDesc.length > 50 ? "Your money reflects\nwho you truly are." : originalDesc;
};

export const getIcon = (label) => {
    if (label.includes("Entertainment")) return "🧠";
    if (label.includes("Food")) return "🍔";
    if (label.includes("Saver")) return "🐷";
    if (label.includes("Shopper")) return "🛍️";
    if (label.includes("Travel")) return "✈️";
    return "✨";
};

export const getGradientClass = (label) => {
    if (label.includes("Entertainment")) return "gradient-purple";
    if (label.includes("Food")) return "gradient-red";
    if (label.includes("Saver")) return "gradient-green";
    return "gradient-blue";
};
