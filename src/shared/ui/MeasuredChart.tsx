import { useEffect, useRef, useState, type ReactNode } from "react";

type ChartSize = {
  width: number;
  height: number;
};

type MeasuredChartProps = {
  className?: string;
  fallbackWidth?: number;
  fallbackHeight: number;
  children: (size: ChartSize) => ReactNode;
};

function getSafeSize(
  element: HTMLDivElement,
  fallbackWidth: number,
  fallbackHeight: number,
): ChartSize {
  const rect = element.getBoundingClientRect();

  return {
    width: rect.width > 0 ? rect.width : fallbackWidth,
    height: rect.height > 0 ? rect.height : fallbackHeight,
  };
}

export const MeasuredChart = ({
  className,
  fallbackWidth = 640,
  fallbackHeight,
  children,
}: MeasuredChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<ChartSize>({
    width: fallbackWidth,
    height: fallbackHeight,
  });

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateSize = () => {
      setSize(getSafeSize(element, fallbackWidth, fallbackHeight));
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [fallbackHeight, fallbackWidth]);

  return (
    <div ref={containerRef} className={className}>
      {children(size)}
    </div>
  );
};
