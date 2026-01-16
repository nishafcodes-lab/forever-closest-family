import { Heart, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GroupPhoto {
  group_name: string;
  photo_url: string | null;
}

const defaultGroups = [
  {
    name: "Late Lateefs",
    emoji: "😁",
    members: ["Saliha Afzal", "Ayeza Habib", "Esha Akbar", "Fizza Asghar", "Iqra Malik"],
    color: "from-sky/20 to-primary/20",
  },
  {
    name: "Friend Squad",
    emoji: "💕",
    members: ["Moniba Tahir", "Nida Arshad", "Zoya", "Tahira Mustaq"],
    color: "from-accent/20 to-rose/20",
  },
  {
    name: "Innocent Girls",
    emoji: "🌸",
    members: ["Maryam Asghar", "Ayeza Habib", "Maryam Akbar", "Iqra Ashraf"],
    color: "from-rose/20 to-primary/20",
  },
  {
    name: "CS Army",
    emoji: "🌟",
    members: ["Iqra Naz", "Maryam Fatime", "Iqra Arshad", "Esha Maqsood"],
    color: "from-gold/20 to-secondary/20",
  },
  {
    name: "V Close Group",
    emoji: "🌟",
    members: ["Syed Nishaf Hussan", "Haroon Hafeez", "M. Haris"],
    color: "from-secondary/20 to-sky/20",
  },
];

const GroupsSection = () => {
  const [photoUrls, setPhotoUrls] = useState<Record<string, string | null>>({});

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from("group_photos")
      .select("group_name, photo_url");

    if (data) {
      const urls: Record<string, string | null> = {};
      data.forEach((item: GroupPhoto) => {
        urls[item.group_name] = item.photo_url;
      });
      setPhotoUrls(urls);
    }
  };

  return (
    <section id="groups" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
            Student Groups
          </h2>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            Same vibes, different groups <Heart className="w-4 h-4 text-accent fill-accent" />
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {defaultGroups.map((group) => {
            const photoUrl = photoUrls[group.name];
            
            return (
              <div
                key={group.name}
                className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-500 hover:-translate-y-2"
              >
                {/* Photo or Placeholder */}
                <div className={`h-48 relative overflow-hidden ${!photoUrl ? `bg-gradient-to-br ${group.color}` : ''}`}>
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {group.emoji}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
                    {group.name} <span>{group.emoji}</span>
                  </h3>
                  <ul className="space-y-1.5">
                    {group.members.map((member) => (
                      <li key={member} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GroupsSection;
