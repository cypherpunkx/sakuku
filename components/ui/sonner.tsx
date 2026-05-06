"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-emerald-500" />
        ),
        info: (
          <InfoIcon className="size-5 text-blue-500" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5 text-amber-500" />
        ),
        error: (
          <OctagonXIcon className="size-5 text-rose-500" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin text-primary" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background/40 group-[.toaster]:backdrop-blur-3xl group-[.toaster]:text-foreground group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-[28px] group-[.toaster]:p-5 group-[.toaster]:gap-4",
          title: "group-[.toast]:text-sm group-[.toast]:font-black group-[.toast]:tracking-tight",
          description: "group-[.toast]:text-muted-foreground/70 group-[.toast]:font-medium group-[.toast]:text-xs",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold rounded-xl",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-bold rounded-xl",
          closeButton: "group-[.toast]:bg-white/5 group-[.toast]:border-white/10 group-[.toast]:text-muted-foreground hover:group-[.toast]:bg-white/10 hover:group-[.toast]:text-white transition-colors",
          success: "group-[.toast]:border-emerald-500/20 group-[.toast]:bg-emerald-500/[0.03]",
          error: "group-[.toast]:border-rose-500/20 group-[.toast]:bg-rose-500/[0.03]",
          warning: "group-[.toast]:border-amber-500/20 group-[.toast]:bg-amber-500/[0.03]",
          info: "group-[.toast]:border-blue-500/20 group-[.toast]:bg-blue-500/[0.03]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
