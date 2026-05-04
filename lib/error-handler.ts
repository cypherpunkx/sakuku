import { toast } from "sonner";

/**
 * Global error handler utility to provide consistent error feedback.
 */
export const errorHandler = {
  /**
   * Log error to console and show a toast notification.
   */
  report: (error: unknown, title: string = "Terjadi Kesalahan") => {
    console.error(`[App Error] ${title}:`, error);

    const message = error instanceof Error ? error.message : "Sesuatu yang tidak terduga terjadi.";

    toast.error(title, {
      description: message,
      duration: 5000,
    });
  },

  /**
   * Specifically for form/validation errors.
   */
  validation: (message: string) => {
    toast.warning("Validasi Gagal", {
      description: message,
    });
  },

  /**
   * For successful operations.
   */
  success: (message: string) => {
    toast.success("Berhasil", {
      description: message,
    });
  }
};
