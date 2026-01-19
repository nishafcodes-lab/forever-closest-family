import { Heart, Sparkles, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { FloatingParticles } from "@/components/ui/floating-particles";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
      {/* Floating Particles */}
      <FloatingParticles count={30} />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            y: [-20, 20, -20],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{ 
            y: [20, -20, 20],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 backdrop-blur-sm border border-primary/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Class of 2021-2025</span>
          </motion.div>

          <motion.h1 
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <span className="gradient-text">BSCS Reunion</span>
          </motion.h1>

          <motion.h2 
            className="font-display text-2xl md:text-4xl text-foreground/80 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Batch 2021–2025
          </motion.h2>

          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Government Graduate College Khanpur
            <br />
            <span className="text-sm">Affiliated with KFUEIT</span>
          </motion.p>

          <motion.div 
            className="flex items-center justify-center gap-2 text-accent font-medium text-lg md:text-xl mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span>"The Worst Class of the Whole College"</span>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              😎
            </motion.span>
          </motion.div>

          <motion.p 
            className="text-muted-foreground flex items-center justify-center gap-2 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            But the Best in Memories 
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-5 h-5 text-accent fill-accent" />
            </motion.div>
          </motion.p>

          <motion.div 
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.a
              href="#about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px hsl(var(--primary) / 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Our Journey
            </motion.a>
            <motion.a
              href="#reunion"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary rounded-full font-medium backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
              whileTap={{ scale: 0.98 }}
            >
              Reunion Details
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        >
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronDown className="w-6 h-6" />
          </a>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
