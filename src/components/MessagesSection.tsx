import { MessageCircle, Heart, Quote, Send, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
}

const MessagesSection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    message: "",
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("id, author_name, message, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6);

    if (data && !error) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author_name.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name and message");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("messages").insert({
      author_name: formData.author_name.trim(),
      author_email: formData.author_email.trim() || null,
      message: formData.message.trim(),
      status: "pending",
    });

    if (error) {
      toast.error("Failed to submit message. Please try again.");
    } else {
      toast.success("Message submitted! It will appear after approval.");
      setFormData({ author_name: "", author_email: "", message: "" });
      setDialogOpen(false);
    }
    setSubmitting(false);
  };

  return (
    <section id="messages" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">From The Heart</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">
            Messages & Wishes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Words from our hearts to yours
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <AnimatedSection className="text-center text-muted-foreground mb-12">
            <p>No messages yet. Be the first to share your thoughts!</p>
          </AnimatedSection>
        ) : (
          <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-12">
            {messages.map((msg) => (
              <StaggerItem key={msg.id}>
                <motion.div
                  className="group glass-card rounded-2xl p-8 card-shadow relative h-full"
                  whileHover={{ y: -8, boxShadow: "var(--shadow-hover)" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 10 }}
                  >
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
                  </motion.div>
                  <h4 className="font-display text-lg font-semibold text-primary mb-4">
                    {msg.author_name}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{msg.message}"
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Send Message CTA */}
        <AnimatedSection delay={0.2}>
          <motion.div 
            className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto"
            whileHover={{ boxShadow: "var(--shadow-hover)" }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 mx-auto mb-4 text-accent" />
            </motion.div>
            <h3 className="font-display text-2xl font-semibold mb-3">
              Share Your Message
            </h3>
            <p className="text-muted-foreground mb-6">
              Have something special to say to your classmates or teachers? We'd love to hear from you!
            </p>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button className="inline-flex items-center gap-2 px-6 py-3 rounded-full">
                    <MessageCircle className="w-4 h-4" />
                    Send a Message
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display">Share Your Message</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Input
                      placeholder="Your Name *"
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Input
                      type="email"
                      placeholder="Your Email (optional)"
                      value={formData.author_email}
                      onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                      className="rounded-xl"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Textarea
                      placeholder="Your message... *"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button type="submit" className="w-full rounded-xl" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Message
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <p className="text-xs text-muted-foreground text-center">
                    Messages will be reviewed before appearing on the site.
                  </p>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default MessagesSection;
