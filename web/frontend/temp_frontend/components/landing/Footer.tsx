// frontend/components/landing/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="text-center py-12 px-4 border-t border-gray-900">
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-400 mb-6">
          Have questions? Sign up above or email Kyle directly at{" "}
          <Link href="mailto:kyle@intelvis.ai" className="text-blue-500 underline hover:text-blue-400 font-medium">
            kyle@intelvis.ai
          </Link>
        </p>
        <div className="text-sm text-gray-500">
          <p>IntelVis © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}