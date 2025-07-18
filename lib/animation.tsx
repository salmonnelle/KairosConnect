"use client";

import React, { useState, useEffect, ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

// Animation types
export type AnimationType = "fade" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "zoom" | "none";

// Simple animation component to replace AnimatePresence
export const AnimatePresence = ({ children, mode }: { children: ReactNode; mode?: string }) => {
  return <>{children}</>;
};

// Motion component props
export interface MotionProps {
  animate?: any;
  initial?: any;
  exit?: any;
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string;
  };
  variants?: any;
  className?: string;
  style?: React.CSSProperties;
  whileHover?: any; // Support for whileHover prop
  children?: ReactNode;
  [key: string]: any;
}

// Helper function to create motion components with hover support
function createMotionComponent<T extends ElementType>(Component: T) {
  return function MotionComponent({
    children,
    animate,
    initial,
    exit,
    transition = {},
    variants,
    className,
    style,
    whileHover,
    ...props
  }: MotionProps) {
    const [isVisible, setIsVisible] = useState(!initial);
    const [isHovered, setIsHovered] = useState(false);
    const delay = transition?.delay || 0;
    const duration = transition?.duration || 300;
    
    useEffect(() => {
      if (animate) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, delay);
        return () => clearTimeout(timer);
      }
    }, [animate, delay]);
    
    const getClasses = () => {
      if (typeof animate === "object" && animate.opacity !== undefined) {
        // Handle opacity animation
        return cn(
          "transition-opacity",
          `duration-${duration}`,
          animate.opacity === 1 ? "opacity-100" : "opacity-0",
          className
        );
      }
      
      return cn(
        "transition-all",
        `duration-${duration}`,
        isVisible ? "opacity-100" : "opacity-0",
        className
      );
    };
    
    // Handle hover styles
    const getHoverStyles = () => {
      if (isHovered && whileHover) {
        const hoverStyles: React.CSSProperties = {};
        
        // Handle scale transform
        if (whileHover.scale) {
          hoverStyles.transform = `scale(${whileHover.scale})`;
        }
        
        return hoverStyles;
      }
      
      return {};
    };
    
    const combinedStyle = {
      ...style,
      transitionDelay: `${delay}ms`,
      ...getHoverStyles(),
    };
    
    // Handle mouse events for hover effects
    const handleMouseEnter = () => {
      if (whileHover) {
        setIsHovered(true);
      }
    };
    
    const handleMouseLeave = () => {
      if (whileHover) {
        setIsHovered(false);
      }
    };
    
    // Remove whileHover from props to avoid React DOM warning
    const safeProps = { ...props } as any;
    delete safeProps.whileHover;
    
    return (
      <Component 
        className={getClasses()} 
        style={combinedStyle} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...safeProps}
      >
        {children}
      </Component>
    );
  };
}

// Create motion components using the helper function
const MotionDiv = createMotionComponent('div');
const MotionSpan = createMotionComponent('span');
const MotionSection = createMotionComponent('section');
const MotionNav = createMotionComponent('nav');
const MotionHeader = createMotionComponent('header');
const MotionFooter = createMotionComponent('footer');
const MotionArticle = createMotionComponent('article');
const MotionAside = createMotionComponent('aside');
const MotionH1 = createMotionComponent('h1');
const MotionH2 = createMotionComponent('h2');
const MotionH3 = createMotionComponent('h3');
const MotionH4 = createMotionComponent('h4');
const MotionH5 = createMotionComponent('h5');
const MotionH6 = createMotionComponent('h6');
const MotionP = createMotionComponent('p');
const MotionUl = createMotionComponent('ul');
const MotionOl = createMotionComponent('ol');
const MotionLi = createMotionComponent('li');
const MotionA = createMotionComponent('a');
const MotionButton = createMotionComponent('button');

// Export motion object with components
export const motion = {
  div: MotionDiv,
  span: MotionSpan,
  section: MotionSection,
  nav: MotionNav,
  header: MotionHeader,
  footer: MotionFooter,
  article: MotionArticle,
  aside: MotionAside,
  h1: MotionH1,
  h2: MotionH2,
  h3: MotionH3,
  h4: MotionH4,
  h5: MotionH5,
  h6: MotionH6,
  p: MotionP,
  ul: MotionUl,
  ol: MotionOl,
  li: MotionLi,
  a: MotionA,
  button: MotionButton,
};

// Export m as an alias for motion
export const m = motion;

// Export AnimationPresence as both names for backward compatibility
export const AnimationPresence = AnimatePresence;
