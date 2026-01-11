"use client";

import { useEffect, useRef, useState } from "react";

type ProductDescriptionProps = {
  description?: string;
};

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [description]);

  if (!description) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Product Description
      </h2>

      {/* Text wrapper */}
      <div className="relative">
        <p
          ref={textRef}
          className={`text-base leading-relaxed text-gray-700 ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {description}
        </p>

        {/* Fade gradient */}
        {!expanded && isOverflowing && (
          <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {/* Toggle */}
      {isOverflowing && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-green-600 hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}
