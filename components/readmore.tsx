"use client";
import { useEffect, useRef, useState } from "react";

function ProductDescription({ description }: { description?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(
        textRef.current.scrollHeight > textRef.current.clientHeight
      );
    }
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
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm font-medium text-green-600 hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default ProductDescription;
