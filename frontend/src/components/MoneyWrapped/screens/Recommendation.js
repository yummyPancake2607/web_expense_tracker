import React, { useRef, useState } from 'react';
import { motion } from "framer-motion";
import { FaShare, FaDownload, FaRedo, FaInstagram, FaFilePdf } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { InstaStoryCard, PDFReport } from '../SummaryExport';

export const RecommendationAndShare = ({ data, onReplay }) => {
    const instaRef = useRef(null);
    const pdfRef = useRef(null);
    const [exporting, setExporting] = useState(false);

    const handleShareInstagram = async () => {
        if (!instaRef.current) return;
        setExporting(true);
        try {
            const canvas = await html2canvas(instaRef.current, {
                scale: 2, // Higher quality
                useCORS: true,
                backgroundColor: null 
            });
            
            const image = canvas.toDataURL("image/png", 1.0);
            
            // Trigger download
            const link = document.createElement('a');
            link.href = image;
            link.download = `money-wrapped-story-${data.period}.png`;
            link.click();
            
            // If Web Share API is supported (mobile)
            if (navigator.share) {
                const blob = await (await fetch(image)).blob();
                const file = new File([blob], "money-wrapped-story.png", { type: "image/png" });
                try {
                    await navigator.share({
                        files: [file],
                        title: 'My Money Wrapped',
                        text: 'Check out my Money Personality!'
                    });
                } catch (e) { console.log('Share canceled'); }
            }
        } catch (e) {
            console.error("Export failed", e);
        } finally {
            setExporting(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!pdfRef.current) return;
        setExporting(true);
        try {
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [794, 1123] // A4 pixel dimensions at ~96 DPI
            });

            // Capture the entire PDF container
            // Since it may have multiple pages or just be one tall container, we can capture pages individually corresponding to .pdf-page class
            const pages = pdfRef.current.querySelectorAll('.pdf-page');
            
            for (let i = 0; i < pages.length; i++) {
                if (i > 0) doc.addPage();
                
                const canvas = await html2canvas(pages[i], {
                    scale: 2,
                    useCORS: true
                });
                
                const imgData = canvas.toDataURL('image/jpeg', 0.9);
                doc.addImage(imgData, 'JPEG', 0, 0, 794, 1123);
            }

            doc.save(`Money-Wrapped-Report-${data.period}.pdf`);
        } catch (e) {
            console.error("PDF Export failed", e);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '40px' }}>
            
            {/* Hidden Export Views */}
            <div style={{ position: 'absolute', top: -9999, left: -9999, visibility: 'visible' }}> 
                {/* Visibility must be visible for html2canvas to capture, but positioned off-screen */}
                <InstaStoryCard ref={instaRef} data={data} />
                <PDFReport ref={pdfRef} data={data} />
            </div>

            {/* Recommendation Part */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: '30px', textAlign: 'center' }}
            >
                <span style={{ fontSize: '1.2rem', fontWeight: '600', opacity: 0.9 }}>One fix to stay safe ✨</span>
                
                <motion.div 
                    className="wrapped-card" 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    style={{ 
                        marginTop: '15px', 
                        background: 'rgba(37, 99, 235, 0.4)',  // Blue tint
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(147, 197, 253, 0.3)',
                        textAlign: 'center',
                        justifyContent: 'center',
                        padding: '30px 20px'
                    }}
                >
                    <p style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1.4 }}>
                        {data.recommendation}
                    </p>
                </motion.div>
            </motion.div>

            {/* Share Section - Bottom Sheet Style */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 80 }}
                style={{ 
                    width: '100vw',
                    maxWidth: '100%', 
                    background: '#0f172a', 
                    padding: '30px 20px',
                    borderRadius: '24px 24px 0 0',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
                    position: 'absolute',
                    bottom: 0,
                    margin: 0
                }}
            >
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>Share Your Money Wrapped</h3>

                <button 
                    className="share-btn" 
                    onClick={handleShareInstagram}
                    disabled={exporting}
                    style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                >
                     <FaInstagram /> Share to Instagram Story
                </button>

                <button 
                    className="secondary-btn" 
                    onClick={handleDownloadPDF}
                    disabled={exporting}
                >
                    <FaFilePdf /> Download Report (PDF)
                </button>
                
                <button 
                    className="secondary-btn" 
                    onClick={(e) => { e.stopPropagation(); onReplay(); }}
                    style={{ border: 'none', marginTop: '5px', opacity: 0.7 }}
                >
                    <FaRedo /> Replay
                </button>
            </motion.div>
        </div>
    );
};

export default RecommendationAndShare;
