import { useState, useRef, useEffect } from "react";

export default function DivExpand({ title, initOpen, children }) {
  const [open, setOpen] = useState(initOpen ?? false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0); // ✅ no <number>

  useEffect(() => {
    if (!contentRef.current) return;
    setHeight(open ? contentRef.current.scrollHeight : 0);
  }, [open, children]);

  // Resize observer for theme/layout changes
  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const ro = new ResizeObserver(() => {
      if (open) setHeight(el.scrollHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  return (
    <div>
      <button
        onClick={(e) => {
          setOpen((o) => !o);
          e.preventDefault();
        }}
        className="w-full font-semibold px-2 py-1 bg-gray-300 text-blue-800 rounded hover:bg-blue-700 hover:text-white transition flex items-start"
      >
        {open ? `${title} ▲` : `${title} ▼`}
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out mt-3 bg-gray-50 dark:bg-black"
        style={{ maxHeight: height }}
      >
        <div ref={contentRef} className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
