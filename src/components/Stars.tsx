import { useMemo } from "react";

const Stars = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 50}%`,
      size: Math.random() * 2 + 1,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 4}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-foreground/80 animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            "--twinkle-duration": star.duration,
            "--twinkle-delay": star.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default Stars;
