import React, { useState, useEffect, useRef } from "react";

// Respuestas y lógica del bot
const prompts = [
  ["hola", "hey", "buenas", "buenos días", "buenas tardes"],
  ["cómo estás", "cómo va la vida", "cómo van las cosas"],
  ["qué haces", "qué pasa", "qué tal todo"],
  ["cuántos años tienes"],
  ["quién eres", "eres humano", "eres un bot", "eres humano o bot"],
  ["quién te creó", "quién te hizo"],
  ["tu nombre por favor", "tu nombre", "puedo saber tu nombre", "cómo te llamas", "cómo te llamas tú"],
  ["te quiero"],
  ["feliz", "bien", "divertido", "maravilloso", "fantástico", "genial"],
  ["mal", "aburrido", "cansado"],
  ["ayúdame", "cuéntame una historia", "cuéntame un chiste"],
  ["ah", "sí", "ok", "okay", "nice"],
  ["adiós", "hasta luego", "nos vemos", "chau"],
  ["qué debería comer hoy"],
  ["bro", "hermano"],
  ["qué", "por qué", "cómo", "dónde", "cuándo"],
  ["no", "no estoy seguro", "quizás", "no gracias"],
  [""],
  ["jaja", "ja", "lol", "jeje", "chistoso", "chiste"],
  ["lanza una moneda", "cara o cruz", "cruz o cara", "cara o sello", "sello o cara"],
  ["cerveza", "cómprame una cerveza", "quiero una cerveza"],
  ["quiero ser más productivo", "cómo mejorar mi productividad", "ayuda con mi productividad", "cómo enfocarme mejor", "tengo que estudiar y no me concentro"],
  ["qué hace tu app", "qué hace esta app", "en qué me ayuda esta app", "para qué sirve esta app", "qué beneficios tiene esta app"],
  ["dame un método de productividad", "un truco para ser productivo", "top 5 métodos de productividad", "mejores técnicas para estudiar"],
  ["cómo organizar mi día", "cómo planifico mi semana", "cómo dejo de procrastinar", "cómo empiezo una tarea difícil"],
  ["recomienda una rutina productiva", "qué rutina seguir para ser productivo", "rutina sencilla para productividad"],
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
  ["La pizza siempre es buena idea 🍕", "¿Y si probás sushi? 🍣"],
  ["¡Broooo!"],
  ["Buena pregunta 🤔"],
  ["Vale, está bien", "Lo entiendo"],
  ["¿Podrías repetirlo?"],
  ["😂", "😄 ¡Qué risa!"],
  ["Cara", "Cruz"],
  ["Podés invitarme un café mejor ☕"],
  [
    "¡Claro! Un buen comienzo es la técnica **Pomodoro**: 25 minutos de foco, 5 de descanso. ¿Quieres que te la configure?",
    "Puedes probar con dividir tus tareas en partes pequeñas. ¡Tu app te puede ayudar a organizarlas fácilmente!",
    "Empieza con lo más difícil del día: se llama la técnica del 'sapo 🐸'. ¡Hazlo primero y libera tu mente!",
    "Haz una lista de 3 cosas importantes para hoy. Nada más. Si las completas, el día fue productivo ✅"
  ],
  [
    "Esta app está pensada para ayudarte a concentrarte, organizar tareas y motivarte con recordatorios inteligentes 💡",
    "Te da métodos simples como Pomodoro, lista de tareas diarias, y reflexiones rápidas. ¡Todo para que no te distraigas!",
    "Está diseñada para que empieces con poco esfuerzo y veas resultados en tus hábitos. ¡La clave es la constancia!",
    "Te ayuda a dejar de perder el tiempo y tener claro en qué enfocarte cada día."
  ],
  [
    "Aquí van 5 top: 1) Pomodoro, 2) Eisenhower, 3) Bloques de tiempo, 4) Deep Work, 5) Tareas clave por día 🔑 ¿Cuál quieres probar?",
    "Prueba con la matriz de Eisenhower: clasifica tus tareas entre urgente / importante. ¡Te sorprenderá lo claro que queda todo!",
    "¿Te cuesta arrancar? Haz la técnica de los 2 minutos: si algo tarda menos de eso, ¡hazlo ya!",
    "Lo mejor es mantenerlo simple: empieza por planear mañana la noche anterior 🌙"
  ],
  [
    "Empieza el día con 3 prioridades. Luego, deja bloques de tiempo sin interrupciones para cada una 📅",
    "No busques motivación, busca acción. Haz una sola cosa durante 10 minutos. El movimiento genera motivación 💪",
    "Divide grandes tareas en mini-pasos. Tu app te puede ayudar a visualizarlos con claridad.",
    "Empieza con el primer paso, no con todo el camino. Esa es la clave para dejar de procrastinar 🔁"
  ],
  [
    "Rutina rápida: 1) Levántate sin mirar el móvil, 2) Agua + movimiento, 3) Revisa tu lista de 3 tareas top, 4) Enfócate por bloques.",
    "Haz una revisión semanal todos los domingos. Es simple y poderosa: evalúa qué funcionó y qué puedes mejorar.",
    "Empieza y termina tu día con claridad: define intenciones por la mañana y cierra el día reflexionando 5 minutos.",
    "Recuerda: la constancia supera la intensidad. Una rutina productiva no es perfecta, ¡es repetible!"
  ]
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
    <div className="flex flex-col max-h-[100vh]">
      {/* Titulo */}
      <h1 style={{ userSelect: "none" }} className="text-2xl font-semibold text-center mb-4">
        {getGreeting()}
      </h1>

      {/* Mensajes */}
      <div className="flex-1 flex justify-end">
        <div className="
          w-full
          border 
          rounded-lg
          p-4 
          overflow-y-auto 
          space-y-2 
          bg-gray-50
          h-[78vh]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`rounded-xl px-4 py-2 text-sm ${msg.from === "bot"
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

      {/* Input del usuario */}
      <div className="justify-end">
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            className="
            border-2 
            border-gray-300 
            bg-white rounded-lg 
            p-3 
            w-full
            "
            placeholder="Pregunta lo que quieras"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            className="
            border-2 
            border-gray-300 
            bg-white rounded-lg 
            p-2 
            flex 
            items-center 
            justify-center"
          >
            💬
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
