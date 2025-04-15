const ChatBot = () => {

    //Función que obtiene la hora actual
    const getGreeting = () => {
        const hour = new Date().getHours(); //devuelve la hora
        var saludo;

        if (hour >= 5 && hour < 12) {
            saludo = "Buenos dias";
        } else if (hour >= 12 && hour < 18) {
            saludo = "Buenas tardes";
        } else {
            saludo = "Buenas noches";
        }

        return saludo + " ¿En que puedo ayudarle hoy?";
    };

    return (
        <div className="flex-1 h-screen p-7">
            <h1 style={{ userSelect: "none" }} className="text-2xl font-semibold text-center">{getGreeting()}</h1>
            {/* Panel del chat*/}
            {/* Panel del chat */}
            <div className="flex flex-grow justify-center items-center mt-1">
                <div className="w-96 h-[400px] rounded-lg p-4 overflow-y-auto">
                    {/* Aquí irían los mensajes del chat */}
                </div>
            </div>

            {/* Input del usuario en la parte inferior */}
            <div className="mt-0 flex items-center space-x-2">
                <input
                    type="text"
                    className="border-2 border-gray-500 rounded-lg p-2 w-full"
                    placeholder="Pregunta lo que quieras"
                />
                <button className="border-2 border-gray-500 rounded-lg p-2 w-[40px] h-[40px] flex items-center justify-center">
                    💬
                </button>
            </div>
        </div>
    );
};

export default ChatBot;