"use client";

import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { updateTermsAction } from "@/actions/admin-terms";
import { DEFAULT_TERMS_MARKDOWN } from "@/data/default-terms";
import { Button } from "@/components/ui/button";
import {
  Save,
  CheckCircle2,
  RotateCcw,
  Eye,
  Edit3,
  Columns,
  ExternalLink,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  FileText,
} from "lucide-react";

export function TermsEditorClient({
  initialContent,
}: {
  initialContent: string;
}) {
  const [content, setContent] = useState<string>(initialContent);
  const [viewMode, setViewMode] = useState<"both" | "edit" | "preview">("both");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || "text"}${suffix}`;
    const newContent =
      text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + replacement.length - suffix.length
      );
    }, 0);
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        "Opravdu chcete načíst výchozí znění obchodních podmínek? Vaše případné neuložené úpravy budou přepsány."
      )
    ) {
      setContent(DEFAULT_TERMS_MARKDOWN);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    setError(null);

    const res = await updateTermsAction(content);
    if (res.success) {
      setFeedback("Obchodní podmínky byly úspěšně uloženy a publikovány.");
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setError(res.error || "Chyba při ukládání podmínek.");
    }
    setIsSaving(false);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="space-y-6">
      {/* Top Banner Notifications */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <a
            href="/obchodni-podminky"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline flex items-center gap-1 hover:text-emerald-900"
          >
            <span>Zobrazit na webu</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2 animate-fade-in shadow-xs">
          <span>{error}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-[#E8D9CE] shadow-xs overflow-hidden flex flex-col">
        {/* Toolbar Header */}
        <div className="p-4 border-b border-[#F0E4DC] bg-[#FAF7F4] flex flex-wrap items-center justify-between gap-3">
          {/* Quick Format Buttons */}
          <div className="flex items-center flex-wrap gap-1">
            <button
              type="button"
              onClick={() => insertFormatting("## ")}
              title="Nadpis sekce (H2)"
              className="p-2 rounded-xl text-[#4A3A31] hover:bg-white hover:shadow-xs transition text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Heading2 className="w-4 h-4 text-[#A87938]" />
              <span className="hidden sm:inline">Nadpis</span>
            </button>

            <button
              type="button"
              onClick={() => insertFormatting("### ")}
              title="Podnadpis (H3)"
              className="p-2 rounded-xl text-[#4A3A31] hover:bg-white hover:shadow-xs transition text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Heading3 className="w-4 h-4 text-[#A87938]" />
              <span className="hidden sm:inline">Podnadpis</span>
            </button>

            <div className="h-5 w-px bg-[#E8D9CE] mx-1" />

            <button
              type="button"
              onClick={() => insertFormatting("**", "**")}
              title="Tučné písmo"
              className="p-2 rounded-xl text-[#4A3A31] hover:bg-white hover:shadow-xs transition cursor-pointer"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormatting("*", "*")}
              title="Kurzíva"
              className="p-2 rounded-xl text-[#4A3A31] hover:bg-white hover:shadow-xs transition cursor-pointer"
            >
              <Italic className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-[#E8D9CE] mx-1" />

            <button
              type="button"
              onClick={() => insertFormatting("- ")}
              title="Odrážkový seznam"
              className="p-2 rounded-xl text-[#4A3A31] hover:bg-white hover:shadow-xs transition cursor-pointer"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormatting("1. ")}
              title="Číslovaný seznam"
              className="p-2 rounded-xl text-[#4A3A31] hover:bg-white hover:shadow-xs transition cursor-pointer"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormatting("[", "](https://)")}
              title="Odkaz"
              className="p-2 rounded-xl text-[#4A3A31] hover:bg-white hover:shadow-xs transition cursor-pointer"
            >
              <LinkIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormatting("> ")}
              title="Zvýrazněný blok"
              className="p-2 rounded-xl text-[#4A3A31] hover:bg-white hover:shadow-xs transition cursor-pointer"
            >
              <Quote className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-[#E8D9CE] mx-1" />

            <button
              type="button"
              onClick={handleResetToDefault}
              title="Obnovit výchozí vzor podmínek"
              className="p-2 rounded-xl text-[#7D6B62] hover:text-[#C88D9A] hover:bg-white hover:shadow-xs transition text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Výchozí vzor</span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-[#EFE9E3] p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === "edit"
                  ? "bg-white text-[#4A3A31] shadow-xs"
                  : "text-[#7D6B62] hover:text-[#4A3A31]"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Pouze editor</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("both")}
              className={`hidden lg:flex px-3 py-1.5 rounded-xl text-xs font-semibold items-center gap-1.5 transition cursor-pointer ${
                viewMode === "both"
                  ? "bg-white text-[#4A3A31] shadow-xs"
                  : "text-[#7D6B62] hover:text-[#4A3A31]"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Rozdělené</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === "preview"
                  ? "bg-white text-[#4A3A31] shadow-xs"
                  : "text-[#7D6B62] hover:text-[#4A3A31]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Náhled</span>
            </button>
          </div>
        </div>

        {/* Content Body: Editor & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#F0E4DC] min-h-[600px]">
          {/* Textarea Editor */}
          {(viewMode === "both" || viewMode === "edit") && (
            <div
              className={`flex flex-col p-4 sm:p-6 ${
                viewMode === "edit" ? "lg:col-span-2" : ""
              }`}
            >
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Zde pište nebo vložte text obchodních podmínek..."
                className="w-full flex-1 min-h-[550px] p-4 font-mono text-xs sm:text-sm text-[#4A3A31] bg-[#FDFBF9] border border-[#E8D9CE] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#C88D9A] leading-relaxed resize-y"
              />
              <div className="flex items-center justify-between text-[11px] text-[#7D6B62] pt-3 px-1">
                <span>Podporuje formátování Markdown</span>
                <span>
                  {charCount.toLocaleString("cs-CZ")} znaků ·{" "}
                  {wordCount.toLocaleString("cs-CZ")} slov
                </span>
              </div>
            </div>
          )}

          {/* Live Preview */}
          {(viewMode === "both" || viewMode === "preview") && (
            <div
              className={`p-6 sm:p-8 overflow-y-auto max-h-[700px] bg-white ${
                viewMode === "preview" ? "lg:col-span-2" : ""
              }`}
            >
              <div className="pb-4 mb-4 border-b border-[#F0E4DC] flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-[#A87938]">
                  Živý náhled stránky
                </span>
                <span className="text-[11px] text-[#7D6B62]">
                  Přesně takto uvidí zákazník
                </span>
              </div>

              <div className="text-sm text-[#4A3A31] leading-relaxed space-y-4">
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
                      <li className="text-sm text-[#4A3A31]">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-[#4A3A31]">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-[#7D6B62]">{children}</em>
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
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar with Actions */}
        <div className="p-4 sm:p-6 border-t border-[#F0E4DC] bg-[#FAF7F4] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#7D6B62]">
            <FileText className="w-4 h-4 text-[#C88D9A]" />
            <span>Změny se ihned po uložení projeví na celém webu.</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/obchodni-podminky"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl border border-[#E8D9CE] text-xs font-semibold text-[#4A3A31] hover:bg-white transition flex items-center gap-2"
            >
              <span>Náhled na webu</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#7D6B62]" />
            </a>

            <Button
              type="button"
              variant="gold"
              size="lg"
              onClick={handleSave}
              isLoading={isSaving}
              className="font-bold shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Uložit obchodní podmínky
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
