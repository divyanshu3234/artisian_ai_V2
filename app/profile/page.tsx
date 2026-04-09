"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import TopNavbar from "@/components/layout/top-nav";
import BottomNavbar from "@/components/layout/bottom-nav";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useProfile } from "@/contexts/ProfileContexts";
import UploadPicture from "@/components/ui/uploadPicture";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  ModalDoneButton,
} from "@/components/ui/animated-modal";
import { 
  Bell, UserCircle, Camera, Pen, MapPin, Palette,
  Quote, Box, Star, Save, LogOut, Globe, Share2 
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const { profilePicture, setProfilePicture } = useProfile();
  
  const [profile, setProfile] = useState({
    name: "Artisan",
    location: "",
    primary_craft: "",
    story: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          name: user.user_metadata?.first_name || user.user_metadata?.name || user.email?.split('@')[0] || "Artisan",
          location: user.user_metadata?.location || "Khurja, Uttar Pradesh, India",
          primary_craft: user.user_metadata?.primary_craft || "Blue Pottery & Terracotta Sculpting",
          story: user.user_metadata?.story || `"Born into a lineage of potters spanning seven generations in Khurja, I see clay not as dirt, but as the memory of the earth."`
        });
      }
    };
    fetchProfile();
  }, [supabase]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profile.name,
          location: profile.location,
          primary_craft: profile.primary_craft,
          story: profile.story
        }
      });
      if (error) throw error;
      toast.success("Profile saved securely to Supabase!");
    } catch (err: any) {
      toast.error("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    try {
      toast.loading("Uploading picture...", { id: "avatar-upload" });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthenticated");

      // Upload to Storage
      const fileName = `avatars/${Date.now()}-${avatarFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-photos")
        .upload(fileName, avatarFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("product-photos")
        .getPublicUrl(uploadData.path);
      const photoUrl = publicUrlData.publicUrl;

      // Update sellers table securely
      await supabase.from("sellers").update({ profile_picture: photoUrl }).eq("user_id", user.id);

      // Update user metadata 
      await supabase.auth.updateUser({
        data: { avatar_url: photoUrl }
      });

      setProfilePicture(photoUrl);

      toast.success("Profile picture updated!", { id: "avatar-upload" });
      setAvatarFile(null); // reset
    } catch (err: any) {
      toast.error("Failed to upload: " + err.message, { id: "avatar-upload" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Successfully logged out");
    router.push("/");
  };
  
  return (
    <div className="bg-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <TopNavbar />

      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto relative overflow-hidden">
        {/* Background Texture Decor */}
        <div className="absolute top-20 -right-20 w-96 h-96 opacity-10 pointer-events-none">
          <Image 
            className="w-full h-full object-contain filter grayscale" 
            alt="Intricate traditional Indian pottery textures" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmdmOxkQCGV7O4a7I2A37b7oGAKZRVh10iQQVJXDotqakGyUDrU-ltripQjDoMRHxD-wjV8RnL4uit1q3sUmDzoxivSWVOdzx7Q46NyvwWyaaRCb67KRuT9gKN2OKc1WIaLUbw1i1L6B4ThygnRGS5G0fq0yTkP2f_qNo1R9EeoDcFEz8e76OIYIyEuMZWCW982ulzPhPyFlh_OHIhbsWyJbQDt5pgeEPW8zn5nJrokJGMYa5-l5pl12Tscz-PzMJbiNCOerknVHh3"
            width={384}
            height={384}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
          {/* Left/Main Column: Profile Branding */}
          <div className="md:col-span-7 space-y-8">
            <section className="bg-surface-container-low rounded-xl p-1 overflow-hidden shadow-ambient">
              <div className="relative group">
                <Image 
                  className="w-full aspect-[4/3] object-cover rounded-xl transition-all duration-700" 
                  alt="Professional portrait of a senior Indian artisan" 
                  src={profilePicture || "https://lh3.googleusercontent.com/aida-public/AB6AXuBHWTTicrkwdlHSFAhD1EVIVrCRMgeUc8HBfOQuW4de8qDK2yCWTy1JXpdPXyceNkbGnlD0AEVXQvrda3WQ6kzx335FPqkOmP_JPllGLtVNP2YDjrTts1oelvU0-NKnjbdPeQzej96BoDlxtKfL1gD59zlfaKzr5U9tKSp_aDd6W70GdIWl8xkx1YTEo4T9KQ1kdCZaGPSjnA1UrfSthXhOYkHw3RWNXaF-n4UH_daIT1B4Y_2JdJfP1twJCjWIejqeBYcYQycnn4mC"}
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-start p-8">
                  <Modal>
                    <ModalTrigger className="flex items-center gap-3 bg-primary-gradient text-white px-6 py-3 rounded-full font-bold hover:opacity-90 active:scale-95 transition-all shadow-[0_0_15px_rgba(226,114,91,0.5)]">
                      <Camera className="w-5 h-5" />
                      Set Avatar Picture (कैमरा खोलें)
                    </ModalTrigger>
                    <ModalBody>
                      <ModalContent>
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-6 text-center">
                          Upload Profile Picture
                        </h2>
                        <div className="flex justify-center p-4">
                          <UploadPicture onFileSelect={(file) => setAvatarFile(file)} />
                        </div>
                      </ModalContent>
                      <ModalFooter className="gap-4">
                        <ModalDoneButton className="bg-primary hover:bg-primary-container text-white" onSubmit={handleUploadAvatar} />
                      </ModalFooter>
                    </ModalBody>
                  </Modal>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6">
              {/* Form Fields with Hindi/English hybrid prompts */}
              <div className="group border-b border-outline-variant/30 py-4 flex justify-between items-end hover:border-secondary transition-colors">
                <div className="space-y-1 w-full">
                  <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Artisan Name / नाम</label>
                  <input 
                    className="bg-transparent border-none p-0 text-3xl font-serif font-extrabold text-foreground focus:ring-0 w-full outline-none" 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <Pen className="text-border group-hover:text-secondary mb-2 w-5 h-5 flex-shrink-0" />
              </div>

              <div className="group border-b border-outline-variant/30 py-4 flex justify-between items-end hover:border-secondary transition-colors">
                <div className="space-y-1 w-full">
                  <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Location / स्थान</label>
                  <input 
                    className="bg-transparent border-none p-0 text-xl font-sans text-foreground focus:ring-0 w-full outline-none" 
                    type="text" 
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
                <MapPin className="text-border group-hover:text-secondary mb-2 w-5 h-5 flex-shrink-0" />
              </div>

              <div className="group border-b border-outline-variant/30 py-4 flex justify-between items-end hover:border-secondary transition-colors">
                <div className="space-y-1 w-full relative">
                  <label className="text-xs uppercase tracking-widest text-secondary font-semibold">Primary Craft / मुख्य शिल्प</label>
                  <input 
                    className="bg-transparent border-none p-0 text-xl font-sans text-foreground focus:ring-0 w-full outline-none" 
                    type="text" 
                    value={profile.primary_craft}
                    onChange={(e) => setProfile({ ...profile, primary_craft: e.target.value })}
                  />
                </div>
                <Palette className="text-border group-hover:text-secondary mb-2 w-5 h-5 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Right Column: Story & Stats */}
          <div className="md:col-span-5 space-y-8">
            {/* My Story Section */}
            <section className="bg-surface-container-low p-10 rounded-xl relative overflow-hidden group">
              <Quote className="absolute -top-4 -right-4 w-32 h-32 opacity-5 text-secondary" />
              <h3 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-2 relative z-10">
                My Story <span className="text-muted-foreground">/ मेरी कहानी</span>
              </h3>
              <div className="relative z-10 group/story border-b border-transparent hover:border-outline-variant/30 pb-2 transition-colors">
                <textarea 
                  className="bg-transparent text-lg leading-relaxed text-muted-foreground font-sans italic w-full resize-none outline-none overflow-hidden" 
                  rows={4}
                  value={profile.story}
                  onChange={(e) => setProfile({ ...profile, story: e.target.value })}
                />
                <Pen className="absolute right-0 bottom-4 text-transparent group-hover/story:text-border w-4 h-4 transition-colors" />
              </div>
            </section>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-surface-container p-8 rounded-xl flex flex-col justify-between aspect-square group hover:bg-secondary/5 transition-colors border border-outline-variant/10">
                <Box className="text-secondary w-10 h-10" />
                <div>
                  <p className="text-4xl font-serif font-extrabold text-foreground">42</p>
                  <p className="text-sm uppercase tracking-wider text-muted-foreground">Collections</p>
                </div>
              </div>

              <div className="bg-surface-container p-8 rounded-xl flex flex-col justify-between aspect-square group hover:bg-secondary/5 transition-colors border border-outline-variant/10">
                <Star className="text-secondary w-10 h-10" fill="currentColor" />
                <div>
                  <p className="text-4xl font-serif font-extrabold text-foreground">4.9</p>
                  <p className="text-sm uppercase tracking-wider text-muted-foreground">Global Rating</p>
                </div>
              </div>
            </div>

            {/* Heritage Accent Card */}
            <div className="bg-surface-container-lowest p-6 border border-outline-variant/30 rounded-xl flex items-center gap-6 shadow-sm">
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 grayscale">
                <Image 
                  className="w-full h-full object-cover" 
                  alt="Indian textile weaving pattern" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvjgIzyX4gYGIRium6egBWRsT-6l4SESQpnAzRu9cR-Vwn2MJ8kpOV4nDy6Tu4yOnRvzrxtCzKxf5yKQId8oEJGGqC2oZcmKMVSB-xavFuMaDPcq9272d0pPucT3RU2bMQffEo_rWs-f8u5ZJc6SE8YsRJNwN7z4iN0xILTPVgKiw3iLA9tTgjBbP3KX6dRWABv9T4IYIx_4_UxagUT1QeQvPsO4MNubeKyYmtGR-LGyEKb_t0mNaO-1SNC9cAJD2EMA6MGVLD0ZF5"
                  width={80}
                  height={80}
                />
              </div>
              <div>
                <h4 className="font-bold text-secondary">Heritage Verified</h4>
                <p className="text-sm text-muted-foreground">Authenticated AI Curator Stamp for &quot;Khurja Heritage&quot; preservation techniques.</p>
              </div>
            </div>

            {/* Global Actions */}
            <div className="flex flex-col gap-4 pt-4">
              <button disabled={isSaving} onClick={handleSaveProfile} className="w-full py-5 bg-primary-gradient text-white text-lg font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                <Save className="w-5 h-5" />
                {isSaving ? "Saving..." : "Save Profile Changes"}
              </button>
              <button onClick={handleLogout} className="w-full py-4 bg-transparent ghost-border hover:border-destructive hover:text-destructive text-foreground transition-all rounded-xl font-semibold flex items-center justify-center gap-3">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t ghost-border w-full">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full font-sans text-sm leading-relaxed max-w-7xl mx-auto">
          <div className="mb-8 md:mb-0">
            <div className="text-lg font-bold text-primary mb-2">Artisan AI</div>
            <p className="text-muted-foreground">© 2024 Artisan AI. The Digital Curator.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-muted-foreground hover:text-secondary transition-colors" href="#">Privacy Policy</a>
            <a className="text-muted-foreground hover:text-secondary transition-colors" href="#">Terms of Service</a>
            <a className="text-muted-foreground hover:text-secondary transition-colors" href="#">Artisan Portal</a>
            <a className="text-muted-foreground hover:text-secondary transition-colors" href="#">Support</a>
          </div>
          <div className="mt-8 md:mt-0 flex gap-6">
            <Globe className="text-muted-foreground/60 hover:text-secondary cursor-pointer" />
            <Share2 className="text-muted-foreground/60 hover:text-secondary cursor-pointer" />
          </div>
        </div>
      </footer>
      <BottomNavbar />
    </div>
  );
}
