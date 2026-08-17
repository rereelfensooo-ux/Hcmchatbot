import React, { useEffect, useRef, useState } from "react";
import { getFaqs, getContact } from "../faqData.js";

function timeNow() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const [faqs, setFaqs] = useState([]);
  const [contact, setContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [ended, setEnded] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    getFaqs().then(setFaqs).catch(console.error);
    getContact().then((c) => {
      setContact(c);
      setMessages([{ from: "bot", text: c.welcome_message, time: timeNow() }]);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  // Munculin bubble "sedang mengetik..." dulu sebelum jawaban bot benar-benar muncul
  function botReply(text, delay = 900) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text, time: timeNow() }]);
    }, delay);
  }

  function askQuestion(item) {
    setMessages((m) => [...m, { from: "user", text: item.question, time: timeNow() }]);
    botReply(item.answer);
  }

  function askSomethingElse() {
    setMessages((m) => [...m, { from: "user", text: "Pertanyaan lain", time: timeNow() }]);
    botReply(`Untuk pertanyaan di luar daftar, langsung chat ${contact?.name} ya di ${contact?.phone} 🙏`);
  }

  function endChat() {
    setMessages((m) => [...m, { from: "bot", text: contact?.closing_message, time: timeNow() }]);
    setEnded(true);
  }

  function restartChat() {
    setMessages([{ from: "bot", text: contact?.welcome_message, time: timeNow() }]);
    setEnded(false);
  }

  return (
    <div className="chat-page">
      <div className="chat-card">
        <div className="chat-header">
          <img src="/logo.png" alt="Tatalogam Group" className="chat-logo" />
          <div className="chat-header-text">
            <span className="chat-title">HCM Assistant</span>
            <span className="chat-status">
              <span className={`status-dot ${ended ? "" : "pulse"}`} />
              {ended ? "chat diakhiri" : typing ? "mengetik..." : "online"}
            </span>
          </div>
        </div>
        <div ref={scrollRef} className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.from}`}>
              <span className="bubble-text">{m.text}</span>
              <span className="bubble-time">{m.time}</span>
            </div>
          ))}
          {typing && (
            <div className="bubble bot typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
        </div>
        {!ended && (
          <div className="chat-options">
            {faqs.filter((f) => f.active).map((f) => (
              <button key={f.id} onClick={() => askQuestion(f)} disabled={typing}>
                {f.question}
              </button>
            ))}
            <button className="muted" onClick={askSomethingElse} disabled={typing}>
              Pertanyaan lain
            </button>
          </div>
        )}
        <div className="chat-footer">
          {ended ? (
            <button className="restart-btn" onClick={restartChat}>
              Mulai chat baru
            </button>
          ) : (
            <button className="end-btn" onClick={endChat}>
              Akhiri chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
