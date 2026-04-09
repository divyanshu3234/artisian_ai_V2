"use client";

import Image from "next/image";
import { 
  Menu, Bell, Mic, TrendingUp, Share2, Pen, Eye, MousePointerClick, 
  Sparkles, User, LayoutDashboard, Wallet, Store, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TopNavbar from "@/components/layout/top-nav";
import BottomNavbar from "@/components/layout/bottom-nav";

// Supabase & Components
import { createClient } from "@/lib/supabase/client";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  ModalDoneButton,
} from "@/components/ui/animated-modal";
import AudioDescriptionRecorder from "@/components/audioDescriptionRecorder";
import UploadPicture from "@/components/ui/uploadPicture";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [userName, setUserName] = useState("Artisan");
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productPhoto: null as File | null,
    description: "",
  });

  const fetchProducts = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("❌ Error fetching user:", userError);
      return;
    }
    
    // Attempt to get name from metadata
    if (user.user_metadata?.first_name) {
      setUserName(user.user_metadata.first_name);
    } else if (user.email) {
      setUserName(user.email.split('@')[0]);
    }

    const { data: sellerData, error: sellerError } = await supabase
      .from("sellers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (sellerError || !sellerData) {
      console.error("❌ Error fetching seller:", sellerError);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", sellerData.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You must be logged in as a seller to add a product.");
        return;
      }

      const { data: seller, error: sellerError } = await supabase
        .from("sellers")
        .select("id, is_seller")
        .eq("user_id", user.id)
        .single();

      if (sellerError || !seller) {
        alert("You are not registered as a seller.");
        return;
      }

      if (!seller.is_seller) {
        alert("Your seller account is not verified yet.");
        return;
      }

      let photoUrl: string | null = null;
      if (formData.productPhoto) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-photos")
          .upload(`products/${Date.now()}-${formData.productPhoto.name}`, formData.productPhoto);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("product-photos")
          .getPublicUrl(uploadData.path);

        photoUrl = publicUrlData.publicUrl;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("products")
        .insert([{
            name: formData.productName,
            price: parseFloat(formData.productPrice),
            description: formData.description,
            image_url: photoUrl,
            user_id: user.id,
            seller_id: seller.id,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Handle AI Route Logic silently
      if (inserted) {
        try {
          const res = await fetch("/api/protected", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: inserted.id, image_url: inserted.image_url }),
          });
          const result = await res.json();
          console.log("AI route result:", result);
        } catch (err) {
          console.error("❌ Failed to call AI route:", err);
        }
      }

      await fetchProducts();
      setFormData({ productName: "", productPrice: "", productPhoto: null, description: "" });
      alert("✅ Product added successfully!");

    } catch (err) {
      console.error("❌ Error submitting form:", err);
      alert("Failed to add product. Check console for details.");
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: seller } = await supabase
        .from("sellers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!seller) return;

      const { error: deleteError, count } = await supabase
        .from("products")
        .delete({ count: "exact" })
        .eq("id", productId)
        .eq("seller_id", seller.id);

      if (!deleteError && count !== 0) {
        alert("✅ Product deleted automatically via Artisan AI.");
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen font-sans text-foreground">
      <TopNavbar />

      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        {/* Hero: The Genie Hub */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tighter text-foreground">Namaste, <span className="capitalize">{userName}</span></h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                Your AI Genie has prepared new content based on your recent terracotta workshop. Ready to share your craft with the world?
              </p>
            </div>
            
            <Modal>
              <ModalTrigger className="group flex items-center gap-4 bg-primary-gradient text-white px-8 py-5 rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-transform border-none">
                <div className="bg-[#FFB300] p-3 rounded-full shadow-[0_0_15px_rgba(255,179,0,0.4)] group-hover:scale-110 transition-transform">
                  <Mic className="text-black" fill="currentColor" />
                </div>
                <span className="font-serif font-bold text-lg tracking-tight">Record Your Story</span>
              </ModalTrigger>
              <ModalBody>
                <ModalContent>
                  <form className="flex flex-col gap-6 p-2 w-full max-w-md mx-auto">
                    <h2 className="text-2xl font-serif font-bold text-foreground">
                      Let&apos;s upload a new craft
                    </h2>
                    
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="Title of Craft (e.g. Royal Blue Pottery)"
                      className="w-full p-4 rounded-xl border border-outline-variant/30 bg-surface text-foreground focus:outline-none focus:border-primary transition-colors text-lg font-serif"
                    />

                    <div className="w-full flex items-center rounded-xl border border-outline-variant/30 bg-surface text-foreground focus-within:border-primary transition-colors pr-2">
                      <span className="pl-4 pr-1 text-muted-foreground font-serif">₹</span>
                      <input
                        type="number"
                        name="productPrice"
                        value={formData.productPrice}
                        onChange={handleChange}
                        placeholder="Price"
                        className="w-full p-4 bg-transparent text-lg font-serif focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col items-center bg-surface-container rounded-xl p-6 border border-dashed border-outline-variant/30">
                      <UploadPicture onFileSelect={(file) => setFormData({ ...formData, productPhoto: file })} />
                    </div>

                    <div className="bg-surface-container rounded-xl p-4 shadow-inner">
                      <AudioDescriptionRecorder
                        initialDescription={formData.description}
                        onChange={(value) => setFormData({ ...formData, description: value })}
                      />
                    </div>
                  </form>
                </ModalContent>
                <ModalFooter className="gap-4">
                  <ModalDoneButton className="bg-primary hover:bg-primary-container text-white" onSubmit={handleSubmit} />
                </ModalFooter>
              </ModalBody>
            </Modal>

          </div>

          {/* Bento Grid - AI Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-surface-container-low p-8 rounded-[32px] relative overflow-hidden group shadow-sm border border-outline-variant/10">
              <div className="relative z-10">
                <span className="text-secondary font-serif font-bold text-xs uppercase tracking-[0.2em] mb-4 block">New Suggestion</span>
                <h3 className="text-3xl font-serif font-bold mb-4 leading-tight text-foreground">Create a Post <span className="text-primary font-sans text-2xl">| पोस्ट बनाएं</span></h3>
                <p className="text-muted-foreground mb-8 max-w-md">The AI noticed your &quot;Blue Pottery&quot; collection is trending in Jaipur. Let&apos;s create a localized ad campaign.</p>
                <button onClick={() => toast.success('Campaign concept generated! Check your email.')} className="bg-surface border border-outline-variant/30 text-foreground px-6 py-3 rounded-xl font-bold hover:bg-surface-container transition-colors shadow-sm">Generate Concept</button>
              </div>
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all"></div>
            </div>

            <div className="bg-indigo-400/5 p-8 rounded-[32px] border border-indigo-400/10 flex flex-col justify-between">
              <div>
                <TrendingUp className="text-indigo-400 w-10 h-10" />
                <h4 className="text-lg font-serif font-bold mt-4 text-foreground">Profile Reach</h4>
              </div>
              <div>
                <span className="text-4xl font-serif font-extrabold text-indigo-400">+12.4%</span>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">vs last week</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Feed / Ready to Post */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif font-bold tracking-tight text-foreground">Your Live Crafts</h3>
            <span className="text-secondary text-sm font-bold cursor-pointer hover:underline">View All Gallery</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length === 0 ? (
               <div className="col-span-full py-12 flex flex-col items-center justify-center bg-surface-container rounded-3xl border border-dashed border-outline-variant/30">
                 <Sparkles className="w-12 h-12 text-primary/30 mb-4" />
                 <h4 className="font-serif font-bold text-muted-foreground mb-2">No Crafts Yet...</h4>
                 <p className="text-sm text-foreground/60">Be the first to upload and let our AI curate your gallery.</p>
               </div>
            ) : null}

            {products.map((product) => (
              <div key={product.id} className="group bg-surface-container rounded-[24px] overflow-hidden border border-outline-variant/10 shadow-sm transition-all hover:translate-y-[-4px]">
                <div className="h-72 overflow-hidden relative bg-surface-container-low">
                  {product.image_url ? (
                    <img 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      src={product.image_url}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container">
                      <Image className="opacity-20" src="/globe.svg" width={100} height={100} alt="Placeholder" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary tracking-widest uppercase">
                    ₹{product.price}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4">
                      <h4 className="font-serif font-bold text-lg text-foreground line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{product.description || "No description provided."}</p>
                    </div>
                    <Share2 className="text-secondary cursor-pointer shrink-0" />
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-outline-variant/10">
                    <button onClick={() => toast.success('Edit mode unlocked.')} className="flex-1 bg-primary/10 text-primary py-3 rounded-xl font-bold text-sm tracking-tight active:scale-95 transition-all hover:bg-primary/20">Edit Item</button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="px-4 border border-outline-variant/30 text-destructive rounded-xl hover:bg-destructive/10 hover:border-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNavbar />
    </div>
  );
}
