"use client";

import React, { useState, useRef, useEffect } from "react";

type StarRatingProps = {
  value?: number; // 0 - 5, can be 0.5 increments
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number; // pixel size of star (width & height)
  max?: number; // number of stars (default 5)
  className?: string;
};

// Default star SVG path (solid star)
const STAR_PATH =
  "M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.168L12 18.896 4.664 23.166l1.402-8.168L0.132 9.21l8.2-1.192L12 .587z";

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 24,
  max = 5,
  className = "",
}: StarRatingProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [internalValue, setInternalValue] = useState<number>(value);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const displayValue = hoverValue !== null ? hoverValue : internalValue;

  // Helper: clamp to 0..max and round to nearest 0.5
  const clampHalf = (v: number) => {
    const clamped = Math.max(0, Math.min(max, v));
    return Math.round(clamped * 2) / 2;
  };

  // Set new value and notify parent
  const setValue = (v: number) => {
    const v2 = clampHalf(v);
    setInternalValue(v2);
    onChange?.(v2);
  };

  // Mouse move over a star to detect half/full
  const handleMove = (e: React.MouseEvent, index: number) => {
    if (readOnly) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    const newHover = isHalf ? index + 0.5 : index + 1;
    setHoverValue(clampHalf(newHover));
  };

  const handleLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
  };

  const handleClick = (e: React.MouseEvent, index: number) => {
    if (readOnly) return;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    const newValue = isHalf ? index + 0.5 : index + 1;
    setValue(newValue);
  };

  // Keyboard support: left/right change by 0.5, Home/End, Enter to confirm (already updates on change)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly) return;
    let next = internalValue;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      next = clampHalf(internalValue + 0.5);
      setValue(next);
      e.preventDefault();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      next = clampHalf(internalValue - 0.5);
      setValue(next);
      e.preventDefault();
    } else if (e.key === "Home") {
      setValue(0);
      e.preventDefault();
    } else if (e.key === "End") {
      setValue(max);
      e.preventDefault();
    }
  };

  // For each star, compute fill percent: 0, 50, or 100
  const starFill = (i: number) => {
    const v = displayValue;
    if (v >= i + 1) return 100;
    if (v <= i) return 0;
    // between i and i+1 => must be 0.5
    return 50;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      ref={rootRef}
      className={`inline-flex items-center gap-1 ${className}`}
      role={readOnly ? undefined : "slider"}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={internalValue}
      tabIndex={readOnly ? -1 : 0}
      onKeyDown={handleKeyDown}
    >
      {Array.from({ length: max }).map((_, i) => {
        const fill = starFill(i); // 0 | 50 | 100
        const uid = `star-${i}-${Math.random().toString(36).slice(2, 8)}`;
        return (
          <button
            key={i}
            type="button"
            onMouseMove={(e) => handleMove(e, i)}
            onMouseLeave={handleLeave}
            onClick={(e) => handleClick(e, i)}
            disabled={readOnly}
            aria-label={`Set rating to ${i + 1} star${i + 1 > 1 ? "s" : ""}`}
            className={`relative p-0 border-0 bg-transparent cursor-${
              readOnly ? "default" : "pointer"
            } focus:outline-none`}
            style={{ width: size, height: size }}
          >
            <svg
              viewBox="0 0 24 24"
              width={size}
              height={size}
              aria-hidden="true"
              className="block"
            >
              <defs>
                <linearGradient id={`grad-${uid}`} x1="0" x2="1">
                  <stop offset="0%" stopColor="currentColor" />
                  <stop offset="100%" stopColor="currentColor" />
                </linearGradient>
                <clipPath id={`clip-${uid}`}>
                  <rect x="0" y="0" width={`${fill}%`} height="24" />
                </clipPath>
              </defs>

              {/* outline (background) */}
              <path
                d={STAR_PATH}
                fill="currentColor"
                className="text-gray-300"
                transform="scale(1) translate(0,0)"
              />

              {/* filled part clipped to percentage */}
              {fill > 0 && (
                <g clipPath={`url(#clip-${uid})`}>
                  <path
                    d={STAR_PATH}
                    fill="currentColor"
                    className="text-yellow-400"
                  />
                </g>
              )}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
