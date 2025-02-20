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
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props} className="bg-red-500 text-white shadow-lg">
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

      {/* ✅ Ensures Toast is always TOP-RIGHT on all screen sizes */}
      <ToastViewport 
  className="fixed sm:top-8 sm:right-2 top-4 right-2 
             w-40 h-24 max-w-md z-[100] 
             lg:w-80 lg:h-32"
/>
    </ToastProvider>
  )
}
