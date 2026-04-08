"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import { fallbackListings } from "@/lib/data/fallbacks";
import TopNavbar from "@/components/layout/top-nav";
import { 
  ArrowLeft, MessageSquare, Send, ShieldPlus, 
  ShoppingCart, Sparkles, AlertCircle, Info 
} from "lucide-react";

export default function CheckoutPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const supabase = createClient();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Negotiation State
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState([
    { sender: "system", text: "You are now connected securely defining the artisan." },
    { sender: "artisan", text: "नमस्ते (Hello). Has the product caught your eye?" }
  ]);

  useEffect(() => {
    const loadProduct = async () => {
      // 1. Check fallbacks
      const fallbackHit = fallbackListings.find(f => f.id === id);
      if (fallbackHit) {
        setProduct(fallbackHit);
        setLoading(false);
        return;
      }
      
      // 2. Check Database
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
        
      if (!error && data) {
        setProduct(data);
      } else {
        toast.error("Product not found.");
        router.push("/market");
      }
      setLoading(false);
    };
    
    if (id) loadProduct();
  }, [id, supabase, router]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatLog([...chatLog, { sender: "buyer", text: chatMessage }]);
    setChatMessage("");
    
    // Auto-reply mock
    setTimeout(() => {
      setChatLog(prev => [...prev, { 
        sender: "artisan", 
        text: "I can ship this right away after checkout! Ensure you use the Buy Now button when ready." 
      }]);
    }, 1500);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: product.price }),
      });

      const order = await res.json();

      if (order.error) {
        toast.error("Failed to initialize Razorpay: " + order.error);
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourTestKey",
        amount: order.amount,
        currency: order.currency,
        name: "Artisan AI",
        description: `Purchase: ${product.name}`,
        order_id: order.id,
        handler: function (response: any) {
          toast.success(`Payment successful! Order ID: ${response.razorpay_payment_id}`);
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        },
        theme: {
          color: "#E2725B",
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      
      razorpayInstance.on("payment.failed", function (response: any) {
        toast.error("Payment failed: " + response.error.description);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong processing payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-surface font-sans text-foreground min-h-screen pb-20">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <TopNavbar />
      
      <main className="pt-24 px-4 md:px-8 max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-bold tracking-widest uppercase">
          <ArrowLeft className="w-4 h-4" />
          Back to Market
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* LEFT: Negotiation / Artisan Chat */}
          <section className="lg:col-span-7 flex flex-col h-[700px]">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-3xl font-serif font-black flex items-center gap-3 text-primary">
                <MessageSquare className="w-8 h-8" />
                Artisan Room
              </h1>
            </div>

            <div className="bg-surface-container flex-1 rounded-[32px] overflow-hidden border border-outline-variant/20 shadow-sm flex flex-col">
              {/* Context Header */}
              <div className="bg-surface-container-low p-5 border-b border-outline-variant/10 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-foreground">Discussing: {product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">End-to-End Encrypted Verification</p>
                </div>
                <ShieldPlus className="text-emerald-500 w-6 h-6" />
              </div>

              {/* Chat Window */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-container-lowest">
                {chatLog.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "buyer" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${msg.sender === "system" ? "bg-primary/10 text-primary w-full text-center font-semibold uppercase tracking-widest text-xs" : msg.sender === "buyer" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-surface-container-high border border-outline-variant/20 rounded-bl-sm"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-surface-container-low border-t border-outline-variant/10 flex items-center gap-3">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Enquire about custom sizes, origins..."
                  className="flex-1 bg-surface border border-outline-variant/30 rounded-full px-5 py-3 outline-none focus:border-primary transition-colors text-sm"
                />
                <button 
                  onClick={handleSendMessage}
                  className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4 ml-[-2px]" />
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: Checkout & Summary */}
          <section className="lg:col-span-5 h-[700px] flex flex-col">
            <h2 className="text-xl font-bold font-serif mb-6 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
              Checkout Summary
            </h2>

            <div className="bg-surface-container rounded-[32px] p-8 border border-outline-variant/20 shadow-lg flex-1 flex flex-col">
              
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden mb-8 relative">
                <Image 
                  src={product.image_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBHWTTicrkwdlHSFAhD1EVIVrCRMgeUc8HBfOQuW4de8qDK2yCWTy1JXpdPXyceNkbGnlD0AEVXQvrda3WQ6kzx335FPqkOmP_JPllGLtVNP2YDjrTts1oelvU0-NKnjbdPeQzej96BoDlxtKfL1gD59zlfaKzr5U9tKSp_aDd6W70GdIWl8xkx1YTEo4T9KQ1kdCZaGPSjnA1UrfSthXhOYkHw3RWNXaF-n4UH_daIT1B4Y_2JdJfP1twJCjWIejqeBYcYQycnn4mC"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="text-2xl font-black font-serif text-foreground">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{product.description}</p>
                </div>
              </div>

              <div className="mt-auto space-y-6">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product Total</span>
                    <span className="font-bold">₹{product.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">Shipping <Info className="w-3 h-3" /></span>
                    <span className="font-bold text-emerald-500">Free</span>
                  </div>
                  <div className="border-t border-outline-variant/20 my-2"></div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-serif font-bold">Grand Total</span>
                    <span className="font-serif font-black text-primary text-2xl">₹{product.price}</span>
                  </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-5 rounded-2xl bg-primary-gradient text-white font-serif font-extrabold text-xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-transform duration-150 disabled:opacity-50 flex items-center justify-center gap-3 hover:shadow-primary/40"
                >
                  <Sparkles className="w-5 h-5" />
                  {isProcessing ? "Connecting to Razorpay..." : "Complete Purchase"}
                </button>

                <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1 uppercase tracking-widest font-bold">
                  <AlertCircle className="w-3 h-3" /> Payments Secured Directly via Razorpay
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
