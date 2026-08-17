import React, { useEffect, useRef, useState } from "react";
import { getFaqs, getContact } from "../faqData.js";

export default function ChatPage() {
  const [faqs, setFaqs] = useState([]);
  const [contact, setContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [ended, setEnded] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    getFaqs().then(setFaqs).catch(console.error);
    getContact().then((c) => {
      setContact(c);
      setMessages([{ from: "bot", text: c.welcome_message }]);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  function askQuestion(item) {
    setMessages((m) => [...m, { from: "user", text: item.question }]);
    setTimeout(() => setMessages((m) => [...m, { from: "bot", text: item.answer }]), 450);
  }

  function askSomethingElse() {
    setMessages((m) => [...m, { from: "user", text: "Pertanyaan lain" }]);
    setTimeout(
      () =>
        setMessages((m) => [
          ...m,
          {
            from: "bot",
            text: `Untuk pertanyaan di luar daftar, langsung chat ${contact?.name} ya di ${contact?.phone} 🙏`,
          },
        ]),
      450
    );
  }

  function endChat() {
    setMessages((m) => [...m, { from: "bot", text: contact?.closing_message }]);
    setEnded(true);
  }

  function restartChat() {
    setMessages([{ from: "bot", text: contact?.welcome_message }]);
    setEnded(false);
  }

  return (
    <div className="chat-page">
      <div className="chat-card">
        <div className="chat-header">
          <img src="/logo.png" alt="Tatalogam Group" className="chat-logo" />
          <div className="chat-header-text">
            <span className="chat-title">HCM Assistant</span>
            <span className="chat-status">{ended ? "chat diakhiri" : "online"}</span>
          </div>
        </div>
        <div ref={scrollRef} className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.from}`}>
              {m.text}
            </div>
          ))}
        </div>
        {!ended && (
          <div className="chat-options">
            {faqs.filter((f) => f.active).map((f) => (
              <button key={f.id} onClick={() => askQuestion(f)}>
                {f.question}
              </button>
            ))}
            <button className="muted" onClick={askSomethingElse}>
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
