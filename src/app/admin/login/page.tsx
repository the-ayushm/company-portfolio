import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="relative grid min-h-dvh place-items-center px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
