"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, className, ...props }) => (
        <Toast key={id} {...props} className={`text-white shadow-lg ${className || ""}`}>
          <div className="grid gap-1">
            {title && <ToastTitle className="text-white">{title}</ToastTitle>}
            {description && (
              <ToastDescription className="text-white">{description}</ToastDescription>
            )}
          </div>
          {action}
          <ToastClose className="text-white hover:text-gray-200" />
        </Toast>
      ))}

<ToastViewport className="fixed top-10 right-2 sm:top-8 lg:top-12 w-60 h-[90px] max-w-md z-[100]" />
    </ToastProvider>
  );
}
