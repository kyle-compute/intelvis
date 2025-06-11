// frontend/components/landing/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="text-center py-10 px-4 border-t border-gray-200 bg-white">
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-600 mb-4">
          IntelVis is currently in development. We’re building for real-world plant operations, not slide decks.
        </p>
        <p className="text-gray-600 mb-6">
          Want to help shape the product? Sign up above or email Kyle directly:{" "}
          <Link href="mailto:kyle@intelvis.ai" className="text-blue-600 underline hover:text-blue-700 font-medium">
            kyle@intelvis.ai
          </Link>
        </p>
        <div className="text-sm text-gray-500 border-t border-gray-200 pt-6 mt-6">
          <p>IntelVis © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}