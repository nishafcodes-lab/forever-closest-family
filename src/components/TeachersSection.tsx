import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SkeletonTeacherCard } from "@/components/ui/skeleton-card";

interface Teacher {
  id: string;
  name: string;
  role: string;
  designation: string | null;
  photo_url: string | null;
  description: string | null;
}

const defaultEmojis = ["👔", "📚", "💫", "🌟", "✨", "🏆", "🎯", "💻"];

const TeachersSection = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const { data, error } = await supabase
      .from("teachers")
      .select("*")
      .order("created_at", { ascending: true });

    if (data && !error) {
      setTeachers(data);
    }
    setLoading(false);
  };

  const getEmoji = (index: number) => defaultEmojis[index % defaultEmojis.length];

  return (
    <section id="teachers" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-medium">Our Mentors</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
            Teachers & Mentors
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The guiding lights who shaped our journey and made us who we are today
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonTeacherCard key={i} />
            ))}
          </div>
        ) : teachers.length === 0 ? (
          <AnimatedSection className="text-center text-muted-foreground">
            <p>No teachers added yet. Check back soon!</p>
          </AnimatedSection>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher, index) => (
              <StaggerItem key={teacher.id}>
                <motion.div
                  className="group glass-card rounded-2xl p-6 card-shadow h-full"
                  whileHover={{ y: -12, boxShadow: "var(--shadow-hover)" }}
                  transition={{ duration: 0.3 }}
                >
                  {teacher.photo_url ? (
                    <motion.div 
                      className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <img
                        src={teacher.photo_url}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl ring-4 ring-primary/10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {getEmoji(index)}
                    </motion.div>
                  )}
                  <h3 className="font-display text-lg font-semibold text-center mb-1 group-hover:text-primary transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {teacher.role}
                  </p>
                  {teacher.designation && (
                    <p className="text-xs text-muted-foreground/70 text-center mt-1">
                      {teacher.designation}
                    </p>
                  )}
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <AnimatedSection className="mt-12 text-center" delay={0.3}>
          <motion.p 
            className="text-muted-foreground italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            "A teacher affects eternity; they can never tell where their influence stops."
          </motion.p>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default TeachersSection;
