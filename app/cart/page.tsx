"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Script from "next/script";
import toast from "react-hot-toast";
import { 
  Trash2, ArrowRight, MessageSquare, ShoppingBag, 
  ChevronLeft, Sparkles, CreditCard, ShieldCheck 
} from "lucide-react";
import { useCart, CartItem } from "@/contexts/CartContext";
import TopNavbar from "@/components/layout/top-nav";
import BottomNavbar from "@/components/layout/bottom-nav";

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getCartTotal();

  const handleCheckoutAll = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
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
        description: `Order for ${cart.length} items`,
        order_id: order.id,
        handler: function (response: any) {
          toast.success(`Payment successful! Order ID: ${response.razorpay_payment_id}`);
          clearCart();
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

  return (
    <div className="bg-surface font-sans text-foreground min-h-screen">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <TopNavbar />

      <main className="pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <Link href="/market" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
              <ChevronLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tighter text-foreground uppercase flex items-center gap-4">
              My Cart <span className="text-primary font-sans">({cart.length})</span>
            </h1>
          </div>
          
          {cart.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="text-primary w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">Artisan-Direct Protection Enabled</p>
              </div>
            </div>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-surface-container rounded-[32px] border border-outline-variant/20 p-16 text-center space-y-8 shadow-sm">
            <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-20" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-serif font-black">Your cart is feeling light</h2>
              <p className="text-muted-foreground max-w-md mx-auto">Explore hand-curated treasures from India's master artisans and add them here to start a conversation.</p>
            </div>
            <Link href="/market" className="inline-flex items-center gap-3 bg-primary-gradient text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
              Browse Market <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="bg-surface-container rounded-[32px] p-6 border border-outline-variant/20 shadow-sm transition-all hover:shadow-md group">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Item Image */}
                    <div className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden relative border border-outline-variant/10 shrink-0">
                      <Image 
                        src={item.image_url} 
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-2xl font-serif font-black group-hover:text-primary transition-colors">{item.name}</h3>
                            <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em] mt-1 shrink-0">MASTER ARTISAN SERIES</p>
                          </div>
                          <span className="text-2xl font-serif font-black text-foreground">₹{item.price}</span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-8">
                        <Link 
                          href={`/checkout/${item.id}`}
                          className="flex items-center gap-2 bg-secondary/10 text-secondary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-secondary/20 transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Negotiate & Buy
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-2 text-muted-foreground hover:text-destructive px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Summary Card */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="bg-surface-container-high rounded-[32px] p-8 border border-outline-variant/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
                
                <h2 className="text-xl font-bold font-serif mb-8 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Order Summary
                </h2>

                <div className="space-y-6">
                  <div className="space-y-4 border-b border-outline-variant/10 pb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
                      <span className="font-bold">₹{total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-bold text-emerald-500 uppercase tracking-tighter">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platform Fee</span>
                      <span className="font-bold text-emerald-500">₹0</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-8 pt-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Grand Total</p>
                      <p className="text-3xl font-serif font-black text-primary mt-1">₹{total}</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <button 
                      onClick={handleCheckoutAll}
                      disabled={isProcessing}
                      className="w-full py-5 rounded-2xl bg-primary-gradient text-white font-serif font-extrabold text-xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                    >
                      <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                      {isProcessing ? "Processing..." : "Checkout All"}
                    </button>
                    
                    <Link 
                      href="/market"
                      className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
                    >
                      Browse More Masterpieces
                    </Link>
                  </div>

                  <div className="mt-8 pt-8 border-t border-outline-variant/10">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-widest font-black text-center justify-center">
                      <span>SECURE TRANSACTION</span>
                      <span className="h-1 w-1 bg-muted-foreground rounded-full"></span>
                      <span>RAZORPAY VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNavbar />
    </div>
  );
}
