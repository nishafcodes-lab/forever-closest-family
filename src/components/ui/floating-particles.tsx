import { motion } from "framer-motion";

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
}

export const FloatingParticles = ({ 
  count = 20, 
  colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))"] 
}: FloatingParticlesProps) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * 8 + 4;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 15;
        const color = colors[i % colors.length];
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: color,
              opacity: 0.15,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};
