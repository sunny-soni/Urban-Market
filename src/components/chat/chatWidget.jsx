import { useState, useRef, useEffect } from "react";
import { IoChatbubbleEllipses, IoClose, IoSend } from "react-icons/io5";
import api from "../../api/axios";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you shop today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasNotif(false);
  };

  const url = import.meta.env.VITE_API_URL;

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    const history = [...messages, userMsg];

    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${url}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error("Server error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ") && !line.includes("[DONE]")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.text) {
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = {
                    ...copy[copy.length - 1],
                    content: copy[copy.length - 1].content + parsed.text,
                  };
                  return copy;
                });
              }
            } catch (e) {
              // skip malformed lines
            }
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      // Show error message in chat instead of crashing
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: "Sorry, something went wrong. Please try again.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  // --- all your existing JSX below unchanged ---
  return (
    <div
      style={{
        position: "fixed",
        bottom: "25px",
        right: "25px",
        zIndex: 9999,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "85px",
          right: "0",
          width: "360px",
          height: "520px",
          background: "#fff",
          borderRadius: "28px",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transformOrigin: "bottom right",
          transform: isOpen
            ? "scale(1) translateY(0)"
            : "scale(0) translateY(100px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#4F46E5",
            color: "#fff",
            padding: "24px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h4
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: "800",
                letterSpacing: "-0.02em",
              }}
            >
              Urban Market Assistant
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                opacity: 0.7,
                marginTop: "4px",
              }}
            >
              AI Powered Support
            </p>
          </div>
          <button
            onClick={toggleChat}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              borderRadius: "12px",
              padding: "8px",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            background: "#F9FAFB",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#4F46E5" : "#E5E7EB",
                color: m.role === "user" ? "#fff" : "#1F2937",
                padding: "12px 18px",
                borderRadius: "20px",
                borderBottomRightRadius: m.role === "user" ? "4px" : "20px",
                borderBottomLeftRadius: m.role === "user" ? "20px" : "4px",
                maxWidth: "80%",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              {m.content || "..."}
            </div>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            padding: "15px",
            background: "#fff",
            borderTop: "1px solid #F3F4F6",
            display: "flex",
            gap: "8px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="How can I help?"
            style={{
              flex: 1,
              padding: "12px 18px",
              borderRadius: "14px",
              border: "1px solid #E5E7EB",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <button
            onClick={send}
            disabled={loading}
            style={{
              background: loading ? "#a5b4fc" : "#4F46E5",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              padding: "0 16px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              transition: "background 0.2s",
            }}
          >
            <IoSend size={18} />
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="chat-fab"
        style={{
          width: "68px",
          height: "68px",
          borderRadius: "34px",
          background: "#4F46E5",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 30px rgba(79, 70, 229, 0.4)",
          position: "relative",
          transition: "transform 0.2s",
        }}
      >
        {isOpen ? <IoClose size={32} /> : <IoChatbubbleEllipses size={32} />}
        {hasNotif && !isOpen && (
          <span
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              width: "16px",
              height: "16px",
              background: "#EF4444",
              borderRadius: "50%",
              border: "3px solid #fff",
            }}
          />
        )}
      </button>

      <style>{`
        .chat-fab:active { transform: scale(0.9); }
        .chat-fab:hover { transform: scale(1.05); }
        @keyframes ripple {
          0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
          100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }
        .chat-fab { animation: ripple 2s infinite; }
      `}</style>
    </div>
  );
}
