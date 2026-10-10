import React from "react";
import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { db } from "@/lib/db";
import { DEFAULT_TERMS_MARKDOWN } from "@/data/default-terms";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "Obchodní podmínky – MoodBox Bloom",
  description: "Všeobecné obchodní podmínky e-shopu MoodBox Bloom.",
};

export default async function TermsPage() {
  const storeSetting = await db.storeSetting.findUnique({
    where: { id: "default" },
  });

  const markdownContent =
    storeSetting?.termsAndConditions?.trim() || DEFAULT_TERMS_MARKDOWN;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8D9CE] text-xs font-semibold text-[#A87938]">
          <FileText className="w-3.5 h-3.5" />
          <span>Právní informace</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31]">
          Obchodní podmínky
        </h1>
        <p className="text-xs text-[#7D6B62]">
          Platné a účinné od 18. 8. 2026
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-6 text-sm text-[#4A3A31] leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4A3A31] mt-8 mb-3 pb-2 border-b border-[#F0E4DC]">
                {children}
              </h2>
            ),
            h2: ({ children }) => (
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#4A3A31] mt-6 mb-2.5 pt-2">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-serif text-base font-bold text-[#4A3A31] mt-4 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-sm text-[#4A3A31] leading-relaxed my-2.5">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1 text-[#7D6B62] my-3 ml-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1 text-[#7D6B62] my-3 ml-2">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-sm text-[#4A3A31]">
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-bold text-[#4A3A31]">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-[#7D6B62]">
                {children}
              </em>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C88D9A] underline hover:text-[#B67886] transition"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <div className="p-4 rounded-2xl bg-[#FFF4E5] border border-[#FFE0B2] text-xs text-[#4A3A31] space-y-1.5 my-4">
                {children}
              </div>
            ),
            hr: () => <hr className="my-6 border-[#F0E4DC]" />,
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
