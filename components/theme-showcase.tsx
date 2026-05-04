"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function ThemeShowcase() {
  return (
    <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto p-8">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Design System Tokens</h2>
          <p className="text-muted-foreground text-lg">
            Sistem desain premium berbasis palet Color Hunt dan shadcn/ui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <div className="h-24 w-full rounded-xl bg-background border flex items-end p-3">
              <span className="text-xs font-mono">Background</span>
            </div>
            <span className="text-sm font-medium">#1A1A1D</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-24 w-full rounded-xl bg-primary flex items-end p-3 text-primary-foreground">
              <span className="text-xs font-mono">Primary</span>
            </div>
            <span className="text-sm font-medium">#6A1E55</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-24 w-full rounded-xl bg-secondary flex items-end p-3 text-secondary-foreground">
              <span className="text-xs font-mono">Secondary</span>
            </div>
            <span className="text-sm font-medium">#3B1C32</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-24 w-full rounded-xl bg-accent flex items-end p-3 text-accent-foreground">
              <span className="text-xs font-mono">Accent</span>
            </div>
            <span className="text-sm font-medium">#A64D79</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold">Interactive Components</h3>
          <p className="text-muted-foreground">
            Verifikasi interaksi dan feedback visual pada komponen.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center bg-card p-8 rounded-2xl border shadow-sm">
          <Button variant="default" size="lg">
            Primary Action
          </Button>
          <Button variant="secondary" size="lg">
            Secondary
          </Button>
          <Button variant="outline" size="lg">
            Outline
          </Button>
          <Button variant="ghost" size="lg">
            Ghost
          </Button>
          <Button variant="destructive" size="lg">
            Destructive
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl border bg-card p-6 flex flex-col gap-4">
          <h4 className="text-xl font-bold">Premium Card</h4>
          <p className="text-muted-foreground leading-relaxed">
            Card ini menggunakan variabel <code className="text-primary">--card</code> dan 
            <code className="text-primary">--card-foreground</code> untuk memastikan kontras yang tepat 
            dalam mode gelap.
          </p>
          <div className="flex gap-2 pt-4">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Accent Button
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-secondary/30 p-6 flex flex-col gap-4 backdrop-blur-sm">
          <h4 className="text-xl font-bold">Secondary Surface</h4>
          <p className="text-muted-foreground leading-relaxed">
            Menggunakan latar belakang sekunder dengan transparansi untuk memberikan efek 
            kedalaman (depth) pada UI.
          </p>
          <div className="flex gap-2 pt-4">
            <Button variant="link" className="px-0">Learn more &rarr;</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
