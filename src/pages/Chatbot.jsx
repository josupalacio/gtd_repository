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
            <h1 className="text-2xl font-semibold text-center">{getGreeting()}</h1>
            <input type="text"/>
        </div>
    );
};

export default ChatBot;