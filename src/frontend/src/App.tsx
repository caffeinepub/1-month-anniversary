import { useCallback, useEffect, useRef, useState } from "react";

// ─── Floating Hearts Background ──────────────────────────────────────────────

function FloatingHearts() {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: Math.random() * 5 + 5,
    size: Math.random() * 20 + 20,
    delay: Math.random() * 8,
  }));

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-float-up select-none"
          style={{
            left: `${h.left}vw`,
            bottom: "-10vh",
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: 0,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

// ─── Confetti Canvas ──────────────────────────────────────────────────────────

function ConfettiCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#ff4757", "#2ed573", "#1e90ff", "#ffa502"];

    const pieces = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 0.2 - 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.y += p.speed;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20"
    />
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveButton = useCallback(() => {
    const btn = noBtnRef.current;
    const container = containerRef.current;
    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const maxX = containerRect.width - btnRect.width - 10;
    const maxY = containerRect.height - btnRect.height - 10;

    const randomX = Math.max(0, Math.random() * maxX);
    const randomY = Math.max(0, Math.random() * maxY);

    btn.style.left = `${randomX}px`;
    btn.style.top = `${randomY}px`;
    btn.style.right = "auto";
  }, []);

  const handleAccept = () => {
    setAccepted(true);
  };

  // Initialize "No" button position once
  useEffect(() => {
    moveButton();
  }, [moveButton]);

  const currentYear = new Date().getFullYear();

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ffeef0 0%, #ffdde1 60%, #ffc8cd 100%)",
      }}
    >
      <FloatingHearts />
      <ConfettiCanvas active={accepted} />

      {/* Main Apology Card */}
      {!accepted && (
        <div
          data-ocid="apology.main_card"
          className="animate-fade-in-up relative z-10 mx-4 w-[85%] max-w-[400px] rounded-[20px] bg-white px-8 py-8 text-center shadow-[0_10px_40px_rgba(255,71,87,0.15)]"
        >
          {/* Bouncing emoji */}
          <span
            className="animate-bounce-gentle mb-3 block text-[3.5rem] leading-none"
            aria-hidden="true"
          >
            🥺🐻
          </span>

          <h1
            className="mb-2 text-[2rem] font-black leading-tight tracking-wide"
            style={{
              color: "#ff4757",
              fontFamily: "'Fredoka One', 'Fraunces', Georgia, serif",
            }}
          >
            I messed up...
          </h1>

          <p
            className="mb-7 text-[1.05rem] leading-relaxed"
            style={{ color: "#555555", fontFamily: "inherit" }}
          >
            I know I was being silly. Please don&apos;t be mad at me forever?
          </p>

          {/* Button container */}
          <div
            ref={containerRef}
            className="relative mx-auto flex h-[60px] w-full items-start justify-start"
          >
            {/* Yes button */}
            <button
              data-ocid="apology.yes_button"
              type="button"
              onClick={handleAccept}
              className="relative z-10 cursor-pointer rounded-full border-none px-6 py-3 text-[1rem] font-black text-white transition-transform active:scale-95"
              style={{
                background: "#ff4757",
                boxShadow: "0 4px 15px rgba(255,71,87,0.35)",
                fontFamily: "'Fredoka One', 'Fraunces', Georgia, serif",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              Yes, I forgive you
            </button>

            {/* Runaway No button */}
            <button
              ref={noBtnRef}
              data-ocid="apology.no_button"
              type="button"
              onMouseOver={moveButton}
              onFocus={moveButton}
              onClick={moveButton}
              onTouchStart={moveButton}
              className="absolute right-0 z-[1] cursor-pointer rounded-full border-none px-6 py-3 text-[1rem] font-black transition-all duration-150"
              style={{
                background: "#dfe4ea",
                color: "#747d8c",
                fontFamily: "'Fredoka One', 'Fraunces', Georgia, serif",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              No
            </button>
          </div>
        </div>
      )}

      {/* Success Card */}
      {accepted && (
        <div
          data-ocid="apology.success_card"
          className="animate-fade-in-up relative z-10 mx-4 w-[85%] max-w-[400px] rounded-[20px] bg-white px-8 py-8 text-center shadow-[0_10px_40px_rgba(255,71,87,0.15)]"
        >
          <span
            className="animate-bounce-gentle mb-3 block text-[3.5rem] leading-none"
            aria-hidden="true"
          >
            🥰🎉
          </span>

          <h1
            className="mb-4 text-[2rem] font-black leading-tight tracking-wide"
            style={{
              color: "#ff4757",
              fontFamily: "'Fredoka One', 'Fraunces', Georgia, serif",
            }}
          >
            Yay! ❤️
          </h1>

          <p
            className="animate-pop-in mb-3 text-[1.4rem] font-black"
            style={{
              color: "#ff4757",
              fontFamily: "'Fredoka One', 'Fraunces', Georgia, serif",
            }}
          >
            Surely Maan Jao Nehal Jii
          </p>

          <p
            className="text-[1.05rem] leading-relaxed"
            style={{ color: "#555555" }}
          >
            I promise to make you smile more!
          </p>
        </div>
      )}

      {/* Footer */}
      <footer
        className="absolute bottom-4 z-10 text-center text-[0.7rem]"
        style={{ color: "rgba(100,40,50,0.5)" }}
      >
        © {currentYear}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
