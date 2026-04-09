import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Globe, MapPin } from "lucide-react";

export function Features() {
  return (
    <section className="py-24 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-surface-container border-outline-variant/30">
          <CardHeader>
            <Sparkles className="w-8 h-8 text-primary mb-4" />
            <CardTitle>AI Curator</CardTitle>
            <CardDescription>Smart insights to connect your work with global trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Logistics and supply chain made effortless.</p>
          </CardContent>
        </Card>
        
        <Card className="bg-surface-container border-outline-variant/30">
          <CardHeader>
            <Globe className="w-8 h-8 text-secondary mb-4" />
            <CardTitle>Global Marketplace</CardTitle>
            <CardDescription>Reach buyers everywhere without middleman friction.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">List your products and unlock dual-view dashboards.</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container border-outline-variant/30">
          <CardHeader>
            <MapPin className="w-8 h-8 text-secondary mb-4" />
            <CardTitle>Heritage Velocity</CardTitle>
            <CardDescription>Real-time heatmaps of craft demand natively mapped.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">See exactly where regional demand is soaring.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
