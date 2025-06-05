"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Thank you for your order!</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Your order has been placed successfully. You can view your orders in your profile.
      </p>
      <Link href="/profile">
        <Button>Go to Profile</Button>
      </Link>
    </div>
  );
}
