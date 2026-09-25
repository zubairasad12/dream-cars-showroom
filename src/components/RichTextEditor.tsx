'use client';

import React, { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImagePlus,
  Table,
  Heading2,
  Heading3,
  Type,
  Undo2,
  Trash2,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onStatsChange?: (stats: { words: number; readingTime: number }) => void;
}

export default function RichTextEditor({ value, onChange, onStatsChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  // Set initial content only once (avoid caret jumps on re-render)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computeStats = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(' ').filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.round(words / 200));
    if (onStatsChange) onStatsChange({ words, readingTime });
  };

  const emitChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    onChange(html);
    computeStats(html);
  };

  const exec = (command: string, arg?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, arg);
    emitChange();
  };

  const formatBlock = (tag: string) => exec('formatBlock', tag);

  const addLink = () => {
    const url = window.prompt('Enter link URL (https://...)');
    if (url && url.trim()) {
      exec('createLink', url.trim());
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append('files', files[i]);
      }
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Image upload failed');

      if (json.urls && Array.isArray(json.urls)) {
        json.urls.forEach((url: string) => {
          exec('insertHTML', `<img src="${url}" alt="Article illustration" style="max-width:100%;border-radius:16px;" />`);
        });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const insertTable = () => {
    exec(
      'insertHTML',
      `<table style="border-collapse:collapse;width:100%;margin:16px 0;"><thead><tr><th style="border:1px solid #30302D;padding:10px;text-align:left;">Column 1</th><th style="border:1px solid #30302D;padding:10px;text-align:left;">Column 2</th><th style="border:1px solid #30302D;padding:10px;text-align:left;">Column 3</th></tr></thead><tbody><tr><td style="border:1px solid #30302D;padding:10px;">Data</td><td style="border:1px solid #30302D;padding:10px;">Data</td><td style="border:1px solid #30302D;padding:10px;">Data</td></tr><tr><td style="border:1px solid #30302D;padding:10px;">Data</td><td style="border:1px solid #30302D;padding:10px;">Data</td><td style="border:1px solid #30302D;padding:10px;">Data</td></tr></tbody></table><p><br/></p>`
    );
  };

  const clearFormatting = () => exec('removeFormat');

  const toolBtn =
    'p-2 rounded-lg text-[#A6A39C] hover:text-[#F4F2ED] hover:bg-[#30302D] transition-colors disabled:opacity-40';
  const blockBtn =
    'px-2.5 py-2 rounded-lg text-[#A6A39C] hover:text-[#F4F2ED] hover:bg-[#30302D] transition-colors text-xs font-bold disabled:opacity-40';

  return (
    <div className="rounded-2xl border border-[#30302D] bg-[#151514] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2.5 border-b border-[#30302D] bg-[#1D1C19]">
        <button type="button" onClick={() => formatBlock('h2')} className={blockBtn} title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => formatBlock('h3')} className={blockBtn} title="Heading 3">
          <Heading3 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => formatBlock('p')} className={blockBtn} title="Paragraph">
          <Type className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-[#30302D] mx-1" />

        <button type="button" onClick={() => exec('bold')} className={toolBtn} title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('italic')} className={toolBtn} title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => formatBlock('blockquote')} className={toolBtn} title="Quote">
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-[#30302D] mx-1" />

        <button type="button" onClick={() => exec('insertUnorderedList')} className={toolBtn} title="Bullet list">
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => exec('insertOrderedList')} className={toolBtn} title="Numbered list">
          <ListOrdered className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-[#30302D] mx-1" />

        <button type="button" onClick={addLink} className={toolBtn} title="Add link">
          <Link2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className={toolBtn}
          title="Insert image"
          disabled={uploadingImage}
        >
          <ImagePlus className={`w-4 h-4 ${uploadingImage ? 'animate-pulse text-[#C8A96B]' : ''}`} />
        </button>
        <button type="button" onClick={insertTable} className={toolBtn} title="Insert table">
          <Table className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-[#30302D] mx-1" />

        <button type="button" onClick={() => exec('undo')} className={toolBtn} title="Undo">
          <Undo2 className="w-4 h-4" />
        </button>
        <button type="button" onClick={clearFormatting} className={toolBtn} title="Clear formatting">
          <Trash2 className="w-4 h-4" />
        </button>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Editor surface */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        role="textbox"
        aria-multiline="true"
        aria-label="Article content editor"
        data-placeholder="Start writing your article here... Use the toolbar above for headings, lists, quotes, links, images and tables."
        className="article-content min-h-[320px] max-h-[70vh] overflow-y-auto px-5 py-4 text-sm text-[#F4F2ED] focus:outline-none prose-editor"
      />
    </div>
  );
}
