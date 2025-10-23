import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ImageHoverPreview = ({ 
    src, 
    alt, 
    className = "", 
    style = {}, 
    maxPreviewSize = { width: 400, height: 300 },
    children 
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
    const [imageDimensions, setImageDimensions] = useState({ width: 300, height: 200 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const triggerRef = useRef(null);
    const previewRef = useRef(null);
    const imageRef = useRef(null);

    const calculateOptimalSize = useCallback((naturalWidth, naturalHeight) => {
        const maxWidth = maxPreviewSize.width;
        const maxHeight = maxPreviewSize.height;
        
        // If image is smaller than max size, use natural dimensions
        if (naturalWidth <= maxWidth && naturalHeight <= maxHeight) {
            return { width: naturalWidth, height: naturalHeight };
        }
        
        // Calculate aspect ratio
        const aspectRatio = naturalWidth / naturalHeight;
        
        // Determine which dimension to constrain by
        let width, height;
        
        if (naturalWidth / maxWidth > naturalHeight / maxHeight) {
            // Width is the constraining factor
            width = maxWidth;
            height = maxWidth / aspectRatio;
        } else {
            // Height is the constraining factor
            height = maxHeight;
            width = maxHeight * aspectRatio;
        }
        
        return { width: Math.round(width), height: Math.round(height) };
    }, [maxPreviewSize]);

    // Load image to get natural dimensions
    useEffect(() => {
        if (!src) return;
        
        setImageLoaded(false); // Reset loading state
        
        const img = new Image();
        img.onload = () => {
            const optimalSize = calculateOptimalSize(img.naturalWidth, img.naturalHeight);
            setImageDimensions(optimalSize);
            setImageLoaded(true);
        };
        img.onerror = () => {
            setImageLoaded(false);
        };
        img.src = src;
    }, [src, calculateOptimalSize]);

    const handleMouseEnter = useCallback((e) => {
        if (!src || !imageLoaded) return;
        
        // Prevent any potential scrolling behavior
        e.preventDefault();
        
        const rect = e.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const previewWidth = imageDimensions.width + 16; // Add padding
        const previewHeight = imageDimensions.height + 16; // Add padding
        
        // Check if we're inside a dropdown that's positioned "up"
        const dropdownMenu = e.currentTarget.closest('.dropdown-menu');
        const isDropdownUp = dropdownMenu && dropdownMenu.classList.contains('dropdown-menu-up');
        
        let x = rect.right + 10; // Default: to the right of the trigger
        let y = rect.top;
        
        // Adjust positioning for dropdown-up scenario
        if (isDropdownUp) {
            // For dropdowns positioned up, prefer showing preview to the left to avoid conflicts
            if (rect.left - previewWidth - 10 > 20) {
                x = rect.left - previewWidth - 10; // Show on left if there's space
            } else {
                x = rect.right + 10; // Show on right as fallback
            }
            
            // For dropdown-up, ensure preview doesn't interfere with dropdown positioning
            const dropdownRect = dropdownMenu.getBoundingClientRect();
            // Keep preview above the dropdown bottom edge but below the top
            y = Math.max(20, Math.min(rect.top, dropdownRect.top - previewHeight - 10));
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
    }, [src, imageLoaded, imageDimensions]);

    const handleMouseLeave = useCallback(() => {
        setShowPreview(false);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!showPreview || !src || !imageLoaded) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const previewWidth = imageDimensions.width + 16; // Add padding
        const previewHeight = imageDimensions.height + 16; // Add padding
        
        let x = rect.right + 10;
        let y = e.clientY - (previewHeight / 2); // Center vertically on cursor
        
        // Check boundaries
        if (x + previewWidth > viewportWidth - 20) {
            x = rect.left - previewWidth - 10;
        }
        
        if (y + previewHeight > viewportHeight - 20) {
            y = viewportHeight - previewHeight - 20;
        }
        
        if (y < 20) {
            y = 20;
        }
        
        setPreviewPosition({ x, y });
    }, [showPreview, src, imageLoaded, imageDimensions]);

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
                // Only prevent scroll if the event is not within the dropdown
                const dropdownMenu = e.target.closest('.dropdown-menu');
                if (!dropdownMenu) {
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
                className={`image-hover-trigger ${className}`}
                style={{ 
                    ...style,
                    position: 'relative',
                    cursor: src ? 'pointer' : 'default',
                    transition: 'background-color 0.2s ease',
                    ...(showPreview && src ? { backgroundColor: 'rgba(0, 123, 255, 0.1)' } : {})
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {children}
            </div>
            
            {showPreview && src && imageLoaded && createPortal(
                <>
                    <div 
                        className="image-preview-backdrop"
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
                        className="image-hover-preview"
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
                            width: `${imageDimensions.width + 16}px`,
                            height: `${imageDimensions.height + 16}px`,
                            maxWidth: `${window.innerWidth - 40}px`, // Ensure it never exceeds viewport
                            maxHeight: `${window.innerHeight - 40}px`, // Ensure it never exceeds viewport
                            overflow: 'hidden', // Prevent content overflow
                            pointerEvents: 'none',
                            willChange: 'transform', // Optimize for positioning changes
                            transform: 'translateZ(0)', // Force hardware acceleration
                            boxSizing: 'border-box' // Include padding and border in width/height calculations
                        }}
                    >
                        <img
                            ref={imageRef}
                            src={src}
                            alt={alt}
                            style={{
                                width: `${imageDimensions.width}px`,
                                height: `${imageDimensions.height}px`,
                                maxWidth: '100%', // Ensure image doesn't exceed container
                                maxHeight: '100%', // Ensure image doesn't exceed container
                                objectFit: 'contain',
                                borderRadius: '4px',
                                display: 'block'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        
                        {/* Image dimensions display */}
                        <div 
                            style={{
                                position: 'absolute',
                                bottom: '4px',
                                right: '4px',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                color: 'white',
                                padding: '2px 6px',
                                fontSize: '10px',
                                borderRadius: '3px',
                                fontFamily: 'monospace',
                                lineHeight: '1.2'
                            }}
                        >
                            {imageRef.current?.naturalWidth || 0} × {imageRef.current?.naturalHeight || 0}
                        </div>
                    </div>
                </>,
                document.body // Render at document body level, outside dropdown
            )}
        </>
    );
};

export default ImageHoverPreview;
