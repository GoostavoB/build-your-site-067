import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";
import MetaTags from "@/components/SEO/MetaTags";
import SchemaMarkup from "@/components/SEO/SchemaMarkup";

export default function HowToTrackCryptoTrades() {
  return (
    <>
      <MetaTags
        title="How to Track Crypto Trades in 2025: Complete Guide"
        description="Learn 3 ways to track crypto trades. Screenshot upload recommended. Free: 5 uploads | Pro: $12/mo | Elite: $25/mo"
        keywords="how to track crypto trades, crypto trade tracking"
      />
      <SchemaMarkup />

      <div className="min-h-screen bg-background">
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              How to Track Crypto Trades<br />
              <span className="text-primary">3 Methods Compared</span>
            </h1>
            <Link to="/auth">
              <Button size="lg">Try Screenshot Method Free</Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
