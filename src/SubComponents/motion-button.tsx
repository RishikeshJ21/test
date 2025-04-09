"use client";
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Button, ButtonProps } from "./button";

// Create props interface that extends ButtonProps and adds motion properties
export interface MotionButtonProps extends ButtonProps {
  whileHover?: MotionProps["whileHover"];
  whileTap?: MotionProps["whileTap"];
  animate?: MotionProps["animate"];
  initial?: MotionProps["initial"];
  transition?: MotionProps["transition"];
  variants?: MotionProps["variants"];
  whileInView?: MotionProps["whileInView"];
  viewport?: MotionProps["viewport"];
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ whileHover, whileTap, animate, initial, transition, variants, whileInView, viewport, ...props }, ref) => {
    return (
      <motion.div
        whileHover={whileHover}
        whileTap={whileTap}
        animate={animate}
        initial={initial}
        transition={transition}
        variants={variants}
        whileInView={whileInView}
        viewport={viewport}
      >
        <Button ref={ref} {...props} />
      </motion.div>
    );
  }
);
MotionButton.displayName = "MotionButton";

export { MotionButton };
