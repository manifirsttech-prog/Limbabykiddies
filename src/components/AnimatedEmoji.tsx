import { motion } from 'framer-motion';

interface AnimatedEmojiProps {
  emoji: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'bounce' | 'float' | 'spin' | 'pulse' | 'wiggle';
  delay?: number;
}

export default function AnimatedEmoji({
  emoji,
  className = '',
  size = 'md',
  animation = 'bounce',
  delay = 0,
}: AnimatedEmojiProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
  };

  const animations = {
    bounce: {
      animate: { y: [0, -15, 0] },
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
    float: {
      animate: { y: [0, -10, 0], rotate: [0, 5, -5, 0] },
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    },
    spin: {
      animate: { rotate: 360 },
      transition: { duration: 2, repeat: Infinity, ease: 'linear' },
    },
    pulse: {
      animate: { scale: [1, 1.2, 1] },
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
    wiggle: {
      animate: { rotate: [0, -10, 10, -10, 0] },
      transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <motion.span
      className={`inline-block ${sizeClasses[size]} ${className}`}
      animate={animations[animation].animate}
      transition={{ ...animations[animation].transition, delay }}
      role="img"
      aria-hidden="true"
    >
      {emoji}
    </motion.span>
  );
}
