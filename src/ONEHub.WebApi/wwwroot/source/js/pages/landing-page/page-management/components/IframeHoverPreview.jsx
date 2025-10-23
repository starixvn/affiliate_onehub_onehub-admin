import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const IframeHoverPreview = ({ 
    src, 
    className = "", 
    style = {}, 
    maxPreviewSize = { width: 393, height: 852 }, // Mobile viewport dimensions from LandingPagePreview
    children 
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [iframeBlocked, setIframeBlocked] = useState(false);
    const triggerRef = useRef(null);
    const previewRef = useRef(null);
    const iframeRef = useRef(null);

    // Calculate responsive dimensions while maintaining aspect ratio
    const calculateOptimalSize = useCallback(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const maxWidth = Math.min(maxPreviewSize.width, viewportWidth * 0.8); // Max 80% of viewport width
        const maxHeight = Math.min(maxPreviewSize.height, viewportHeight * 0.8); // Max 80% of viewport height
        
        // Maintain 393:852 aspect ratio
        const aspectRatio = 393 / 852;
        
        let width, height;
        
        if (maxWidth / aspectRatio > maxHeight) {
            // Height is the constraining factor
            height = maxHeight;
            width = maxHeight * aspectRatio;
        } else {
            // Width is the constraining factor
            width = maxWidth;
            height = maxWidth / aspectRatio;
        }
        
        return { 
            width: Math.round(width), 
            height: Math.round(height) 
        };
    }, [maxPreviewSize]);

    const [iframeDimensions, setIframeDimensions] = useState(calculateOptimalSize);

    // Recalculate dimensions on window resize
    useEffect(() => {
        const handleResize = () => {
            setIframeDimensions(calculateOptimalSize());
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [calculateOptimalSize]);

    const handleMouseEnter = useCallback((e) => {
        if (!src) return;
        
        // Reset iframe state
        setIframeLoaded(false);
        setIframeBlocked(false);
        
        // Prevent any potential scrolling behavior
        e.preventDefault();
        
        const rect = e.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const previewWidth = iframeDimensions.width + 16; // Add padding
        const previewHeight = iframeDimensions.height + 16; // Add padding
        
        // Check if we're inside a table or dropdown
        const table = e.currentTarget.closest('table');
        const isInTable = !!table;
        
        let x = rect.right + 10; // Default: to the right of the trigger
        let y = rect.top;
        
        // Adjust positioning for table scenario
        if (isInTable) {
            // For tables, prefer showing preview to the right to avoid conflicts with table scrolling
            if (rect.right + previewWidth + 10 > viewportWidth - 20) {
                x = rect.left - previewWidth - 10; // Show on left if no space on right
            }
            
            // Vertically center on the row
            y = rect.top + (rect.height / 2) - (previewHeight / 2);
        }
        
        // Comprehensive boundary checking to prevent horizontal scroll
        
        // Check if preview would go off the right edge
        if (x + previewWidth > viewportWidth - 20) {
            x = rect.left - previewWidth - 10; // Try showing to the left
        }
        
        // If showing to the left would go off the left edge, constrain within viewport
        if (x < 20) {
            x = 20; // Minimum left margin
        }
        
        // Final check: if preview is still too wide for viewport, constrain to viewport
        if (x + previewWidth > viewportWidth - 20) {
            x = Math.max(20, viewportWidth - previewWidth - 20);
        }
        
        // Ensure preview never extends beyond viewport horizontally
        if (x + previewWidth > viewportWidth) {
            x = viewportWidth - previewWidth - 10;
        }
        
        // Absolute minimum: ensure x is never negative
        if (x < 0) {
            x = 10;
        }
        
        // Vertical boundary checking
        if (y + previewHeight > viewportHeight - 20) {
            y = viewportHeight - previewHeight - 20; // Adjust to fit
        }
        
        if (y < 20) {
            y = 20;
        }
        
        setPreviewPosition({ x, y });
        setShowPreview(true);
    }, [src, iframeDimensions]);

    const handleMouseLeave = useCallback(() => {
        setShowPreview(false);
    }, []);

    const handleIframeLoad = useCallback(() => {
        setIframeLoaded(true);
        setIframeBlocked(false);
    }, []);

    const handleIframeError = useCallback(() => {
        setIframeBlocked(true);
        setIframeLoaded(false);
    }, []);

    const handleOpenInNewTab = useCallback(() => {
        if (src) {
            window.open(src, '_blank');
        }
    }, [src]);

    // Close preview when clicking outside and prevent scroll issues
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showPreview && 
                triggerRef.current && 
                !triggerRef.current.contains(e.target) &&
                previewRef.current &&
                !previewRef.current.contains(e.target)) {
                setShowPreview(false);
            }
        };

        // Prevent scroll when preview is shown
        const preventScroll = (e) => {
            if (showPreview && previewRef.current) {
                // Only prevent scroll if the event is not within the table
                const table = e.target.closest('table');
                if (!table) {
                    e.preventDefault();
                }
            }
        };

        // Prevent horizontal scroll by constraining body overflow
        const preventHorizontalScroll = () => {
            if (showPreview) {
                document.body.style.overflowX = 'hidden';
            } else {
                document.body.style.overflowX = '';
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        if (showPreview) {
            document.addEventListener('wheel', preventScroll, { passive: false });
            document.addEventListener('touchmove', preventScroll, { passive: false });
            preventHorizontalScroll(); // Apply horizontal scroll prevention
        } else {
            preventHorizontalScroll(); // Remove horizontal scroll prevention
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('wheel', preventScroll);
            document.removeEventListener('touchmove', preventScroll);
            // Restore original overflow-x when component unmounts
            document.body.style.overflowX = '';
        };
    }, [showPreview]);

    return (
        <>
            <div
                ref={triggerRef}
                className={`iframe-hover-trigger ${className}`}
                style={{ 
                    ...style,
                    position: 'relative',
                    cursor: src ? 'pointer' : 'default',
                    transition: 'background-color 0.2s ease',
                    ...(showPreview && src ? { backgroundColor: 'rgba(0, 123, 255, 0.1)' } : {})
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>
            
            {showPreview && src && createPortal(
                <>
                    <div 
                        className="iframe-preview-backdrop"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 9999, // Just below the preview
                            pointerEvents: 'none'
                        }}
                    />
                    <div
                        ref={previewRef}
                        className="iframe-hover-preview"
                        style={{
                            position: 'fixed',
                            left: `${previewPosition.x}px`,
                            top: `${previewPosition.y}px`,
                            zIndex: 10000, // Higher than dropdown z-index (1050)
                            backgroundColor: 'white',
                            border: '2px solid #dee2e6',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            padding: '8px',
                            width: `${iframeDimensions.width + 16}px`,
                            height: `${iframeDimensions.height + 16}px`,
                            maxWidth: `${window.innerWidth - 40}px`, // Ensure it never exceeds viewport
                            maxHeight: `${window.innerHeight - 40}px`, // Ensure it never exceeds viewport
                            overflow: 'hidden', // Prevent content overflow
                            pointerEvents: 'auto', // Allow interactions with the preview
                            willChange: 'transform', // Optimize for positioning changes
                            transform: 'translateZ(0)', // Force hardware acceleration
                            boxSizing: 'border-box' // Include padding and border in width/height calculations
                        }}
                    >
                        {/* Mobile viewport container similar to LandingPagePreview */}
                        <div 
                            className="mobile-viewport-preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: '1px solid #dee2e6',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                position: 'relative',
                                backgroundColor: '#f8f9fa'
                            }}
                        >
                            <iframe
                                ref={iframeRef}
                                src={src}
                                title="Landing Page Preview"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    display: iframeLoaded ? 'block' : 'none'
                                }}
                                onLoad={handleIframeLoad}
                                onError={handleIframeError}
                                scrolling="no"
                            />
                            
                            {/* Loading state */}
                            {!iframeLoaded && !iframeBlocked && (
                                <div 
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ 
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#f8f9fa'
                                    }}
                                >
                                    <div className="text-center">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        <div style={{ fontSize: '12px', marginTop: '8px', color: '#6c757d' }}>
                                            Loading preview...
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>,
                document.body // Render at document body level, outside table
            )}
        </>
    );
};

export default IframeHoverPreview;
