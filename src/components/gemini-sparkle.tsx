import { useId } from "react";

type Props = {
  className?: string;
  gradient?: boolean;
  size?: number | string;
};

export function GeminiSparkle({
  className = "",
  gradient = true,
  size,
}: Props) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {gradient && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4285f4" />
            <stop offset="40%" stopColor="#9b72cb" />
            <stop offset="75%" stopColor="#d96570" />
            <stop offset="100%" stopColor="#ff8f43" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2.5c.4 3.7 1.3 5.7 2.7 7 1.4 1.4 3.4 2.3 7 2.7-3.7.4-5.7 1.3-7 2.7-1.4 1.4-2.3 3.4-2.7 7-.4-3.7-1.3-5.7-2.7-7-1.4-1.4-3.4-2.3-7-2.7 3.7-.4 5.7-1.3 7-2.7 1.4-1.4 2.3-3.4 2.7-7Z"
        fill={gradient ? `url(#${id})` : "currentColor"}
      />
    </svg>
  );
}
