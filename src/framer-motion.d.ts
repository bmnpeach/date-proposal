declare module 'framer-motion' {
  import * as React from 'react';

  export interface MotionProps extends React.HTMLAttributes<HTMLElement> {
    initial?: Record<string, any>;
    animate?: Record<string, any>;
    exit?: Record<string, any>;
    whileHover?: Record<string, any>;
    whileTap?: Record<string, any>;
    whileInView?: Record<string, any>;
    transition?: Record<string, any>;
    layout?: boolean;
    layoutId?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const motion: {
    div: React.FC<MotionProps>;
    span: React.FC<MotionProps>;
    button: React.FC<MotionProps>;
    [tag: string]: React.FC<MotionProps>;
  };

  export const AnimatePresence: React.FC<{
    children?: React.ReactNode;
    mode?: 'sync' | 'wait' | 'popLayout';
  }>;

  export const domAnimations: any;
  export const createDomAnimationLibrary: any;
}
