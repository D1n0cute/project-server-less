// frontend/Wall.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import "./Wall.css";

/* ── Types ── */
interface Message {
  id: number;
  content: string;
  color_idx: number;
  pos_x: number;
  pos_y: number;
  created_at: string;
}

/* ── Config ── */
const API = "http://localhost:8000/api";

const COLORS = [
  { bg: "rgba(124,92,191,0.35)",  text: "#e2d4ff", border: "rgba(167,139,250,0.4)"  },
  { bg: "rgba(56,189,248,0.25)",  text: "#bae6fd", border: "rgba(56,189,248,0.35)"  },
  { bg: "rgba(244,114,182,0.25)", text: "#fbcfe8", border: "rgba(244,114,182,0.35)" },
  { bg: "rgba(52,211,153,0.25)",  text: "#a7f3d0", border: "rgba(52,211,153,0.35)"  },
  { bg: "rgba(251,191,36,0.2)",   text: "#fde68a", border: "rgba(251,191,36,0.35)"  },
  { bg: "rgba(251,113,133,0.25)", text: "#fecdd3", border: "rgba(251,113,133,0.35)" },
];

/* ── Helpers ── */
function randomPos() {
  const padding = 8;
  return {
    pos_x: parseFloat((padding + Math.random() * (100 - padding * 2)).toFixed(2)),
    pos_y: parseFloat((padding + Math.random() * (100 - padding * 2)).toFixed(2)),
  };
}

function showToast(msg: string) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ── Component ── */
export default function Wall() {
  const [messages, setMessages]   = useState<Message[]>([]);
  const [text, setText]           = useState("");
  const [sending, setSending]     = useState(false);
  const colorCounter              = useRef(0);

  /* Fetch all messages on mount */
  useEffect(() => {
    fetch(`${API}/messages`)
      .then((r) => r.json())
      .then((data: Message[]) => setMessages(data))
      .catch(() => showToast("ไม่สามารถโหลดข้อความได้"));
  }, []);

  /* Render a bubble for each message */
  const renderBubble = useCallback((msg: Message, animate = true) => {
    const wall = document.getElementById("wall");
    if (!wall) return;

    const c   = COLORS[msg.color_idx % COLORS.length];
    const el  = document.createElement("div");
    el.className = "msg-bubble";
    el.textContent = msg.content;
    el.style.cssText = `
      left: ${msg.pos_x}%;
      top:  ${msg.pos_y}%;
      background: ${c.bg};
      color: ${c.text};
      border: 1px solid ${c.border};
      animation: ${animate ? "floatIn 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none"};
      opacity: ${animate ? "0" : "0.82"};
    `;
    wall.appendChild(el);

    if (animate) {
      el.addEventListener("animationend", () => {
        el.style.opacity = "0.82";
        el.style.animation = "none";
      }, { once: true });
    }
  }, []);

  /* Render existing messages (no animation) */
  useEffect(() => {
    messages.forEach((m) => renderBubble(m, false));
  }, [messages, renderBubble]);

  /* Stars */
  useEffect(() => {
    const container = document.getElementById("stars");
    if (!container || container.childElementCount > 0) return;
    for (let i = 0; i < 90; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${1.5 + Math.random() * 3}s;`;
      container.appendChild(s);
    }
  }, []);

  /* Send message */
  const handleSend = async () => {
    const content = text.trim();
    if (!content) return;

    const color_idx = colorCounter.current % COLORS.length;
    colorCounter.current++;
    const { pos_x, pos_y } = randomPos();

    setSending(true);
    try {
      const res = await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, color_idx, pos_x, pos_y }),
      });

      if (!res.ok) throw new Error();
      const saved: Message = await res.json();

      renderBubble(saved, true);
      setMessages((prev) => [...prev, saved]);
      setText("");
    } catch {
      showToast("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="stars-bg" id="stars" />
      <div id="wall" />

      <div className="overlay">
        <div className="card">
          <h2 className="card-title">ส่งกำลังใจให้โลก</h2>
          <p className="card-sub">
            พิมพ์ข้อความกำลังใจ แล้วมันจะลอยอยู่บนกำแพงนี้ตลอดไป
          </p>

          <textarea
            id="msg-input"
            placeholder="วันนี้คุณทำได้ดีมากแล้ว..."
            maxLength={80}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
          />

          <button id="send-btn" onClick={handleSend} disabled={sending || !text.trim()}>
            {sending ? "กำลังส่ง..." : "ส่งออกไป ✦"}
          </button>

          <p className="count-label">{messages.length} ข้อความบนกำแพง</p>
        </div>
      </div>
    </>
  );
}
