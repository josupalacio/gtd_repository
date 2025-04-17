import React, { useState, useEffect, useRef } from "react";

// Respuestas y lógica del bot
const prompts = [
  ["hi", "hey", "hello", "good morning", "good afternoon"],
  ["how are you", "how is life", "how are things"],
  ["what are you doing", "what is going on", "what is up"],
  ["how old are you"],
  ["who are you", "are you human", "are you bot", "are you human or bot"],
  ["who created you", "who made you"],
  ["your name please", "your name", "may i know your name", "what is your name", "what call yourself"],
  ["i love you"],
  ["happy", "good", "fun", "wonderful", "fantastic", "cool"],
  ["bad", "bored", "tired"],
  ["help me", "tell me story", "tell me joke"],
  ["ah", "yes", "ok", "okay", "nice"],
  ["bye", "good bye", "goodbye", "see you later"],
  ["what should i eat today"],
  ["bro"],
  ["what", "why", "how", "where", "when"],
  ["no", "not sure", "maybe", "no thanks"],
  [""],
  ["haha", "ha", "lol", "hehe", "funny", "joke"],
  ["flip a coin", "heads or tails", "tails or heads", "head or tails", "head or tail", "tail or heads", "tail or head"],
  ["beer", "buy me a beer", "want a beer"]
];

const replies = [
  ["¡Hola!", "¡Hey!", "¡Buenas!", "¡Qué tal!", "¡Hola hola!"],
  ["Bien... ¿y tú?", "Bastante bien, gracias", "Todo bien, ¿y tú?"],
  ["Nada en especial", "Pensando en IA", "Aquí, ayudando"],
  ["No tengo edad, ¡soy eterno!"],
  ["Soy un bot 🤖", "Soy una inteligencia artificial"],
  ["Fui creado por un desarrollador curioso..."],
  ["No tengo nombre aún 😅"],
  ["¡Yo también te quiero!"],
  ["¡Me alegra!", "¡Genial!"],
  ["¿Por qué te sientes así?", "¡Ánimo!", "Todo va a mejorar"],
  ["Claro, ¿te cuento un chiste? ¿o una historia?"],
  ["Dime más...", "Ajá..."],
  ["¡Adiós!", "Hasta luego 👋"],
  ["Pizza siempre es buena idea 🍕", "¿Y si pruebas sushi? 🍣"],
  ["¡Broooo!"],
  ["Buena pregunta 🤔"],
  ["Vale, está bien", "Lo entiendo"],
  ["¿Podrías repetirlo?"],
  ["😂", "😄 ¡Qué risa!"],
  ["Cara", "Cruz"],
  ["Podés invitarme un café mejor ☕"]
];

const alternative = ["No entiendo 🤔", "¿Podrías repetirlo?", "Interesante...", "Continúa..."];

const getBotResponse = (input) => {
  const cleaned = input.toLowerCase().replace(/[^\w\s]/gi, "");
  for (let i = 0; i < prompts.length; i++) {
    if (prompts[i].includes(cleaned)) {
      const resList = replies[i];
      return resList[Math.floor(Math.random() * resList.length)];
    }
  }
  return alternative[Math.floor(Math.random() * alternative.length)];
};

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Buenos días. ¿En qué puedo ayudarte hoy?";
    if (hour >= 12 && hour < 18) return "Buenas tardes. ¿En qué puedo ayudarte hoy?";
    return "Buenas noches. ¿En qué puedo ayudarte hoy?";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setBotTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages((prev) => [...prev, { from: "bot", text: botResponse }]);
      setBotTyping(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex-1 h-screen p-7 bg-white">
      <h1 style={{ userSelect: "none" }} className="text-2xl font-semibold text-center mb-4">
        {getGreeting()}
      </h1>

      <div className="flex flex-grow justify-center items-center">
        <div className="w-full max-w-md h-[400px] border rounded-lg p-4 overflow-y-auto space-y-2 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`rounded-xl px-4 py-2 text-sm ${
                  msg.from === "bot"
                    ? "bg-gray-300 text-black rounded-bl-none"
                    : "bg-blue-500 text-white rounded-br-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {botTyping && (
            <div className="flex justify-start">
              <img
                src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                alt="typing..."
                className="w-12"
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          className="border-2 border-gray-500 rounded-lg p-2 w-full"
          placeholder="Pregunta lo que quieras"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="border-2 border-gray-500 rounded-lg p-2 w-[40px] h-[40px] flex items-center justify-center"
        >
          💬
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
