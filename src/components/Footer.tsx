import { Heart, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex items-center justify-center gap-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <GraduationCap className="w-6 h-6" />
            <span className="font-display text-xl font-bold">BSCS Reunion</span>
          </motion.div>

          <h3 className="font-display text-lg font-semibold mb-2">
            Batch 2021–2025
          </h3>

          <p className="text-background/70 mb-4">
            Government Graduate College Khanpur
          </p>

          <motion.div 
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-background/80 italic">
              "Once the worst class, forever the closest family"
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-accent fill-accent" />
            </motion.div>
          </motion.div>

          <div className="border-t border-background/20 pt-6 mt-6">
            <p className="text-sm text-background/50">
              Designed with ❤️ by{" "}
              <Link 
                to="/admin-login" 
                className="text-background/80 font-medium hover:text-background transition-colors"
              >
                CS Coders
              </Link>
            </p>
            <p className="text-xs text-background/40 mt-2">
              © 2025 BSCS Reunion. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
