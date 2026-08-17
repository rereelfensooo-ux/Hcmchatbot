import React, { useEffect, useRef, useState } from "react";
import { getFaqs, getContact } from "../faqData.js";

export default function ChatPage() {
  const [faqs, setFaqs] = useState([]);
  const [contact, setContact] = useState(null);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Halo! Aku HCM Assistant Tatalogam 👋 Pilih pertanyaan di bawah ya." },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    getFaqs().then(setFaqs).catch(console.error);
    getContact().then(setContact).catch(console.error);
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

  return (
    <div className="chat-page">
      <div className="chat-card">
        <div className="chat-header">HCM Assistant</div>
        <div ref={scrollRef} className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.from}`}>
              {m.text}
            </div>
          ))}
        </div>
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
      </div>
    </div>
  );
}
