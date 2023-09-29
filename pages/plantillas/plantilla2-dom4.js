import React, { useState, useEffect } from 'react';

const Plantilla2Dom4 = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [observedFrequency, setObservedFrequency] = useState(0); 
  const [sourceFrequency, setSourceFrequency] = useState(0); 
  const [speedOfSound, setSpeedOfSound] = useState(343); 
  const [distance, setDistance] = useState(0);
  const epsilon = 0.05;

  const hints = [
    'Utiliza la fórmula del efecto Doppler para calcular la velocidad del sonido en el aire.',
    'En este caso, el coche de policía está estacionado, por lo que la velocidad del observador v0 y la velocidad de la fuente de sonido vs son 0, lo que facilita la formula',
  ];

  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);

  
  const generateRandomValues = () => {
   
    const randomSourceFrequency = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
    setSourceFrequency(randomSourceFrequency);

    const randomObservedFrequency = Math.floor(Math.random() * (900 - 400 + 1)) + 400;
    setObservedFrequency(randomObservedFrequency);

    const randomDistance = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
    setDistance(randomDistance);
  };

  const generateRandomQuestion = () => {
    generateRandomValues(); 
  };


  useEffect(() => {
    setCurrentHintIndex(0);
    setIncorrectAttempts(0);
    generateRandomQuestion();
  }, []);

  
  useEffect(() => {
    
    const velocityOfSound =
      ((observedFrequency - sourceFrequency) / sourceFrequency) * speedOfSound;

    setCorrectAnswer(velocityOfSound.toFixed(2));
    setCurrentHintIndex(0); 
    setIncorrectAttempts(0); 
    setIsCorrect(null); 
  }, [observedFrequency, sourceFrequency, speedOfSound]);

  const renderHint = () => {
  
    const hintToShow = hints[currentHintIndex];

    return (
      hintToShow && (
        <div className="bg-yellow-100 rounded p-4 mt-2">
          <div className="text-red-500">{hintToShow}</div>
        </div>
      )
    );
  };

  const checkAnswer = () => {
    const userAnswerFloat = parseFloat(userAnswer);
    const correctAnswerFloat = parseFloat(correctAnswer);
    console.log(correctAnswerFloat)
    let isAnswerCorrect = false;

    
    if (!isNaN(userAnswerFloat) && Math.abs(userAnswerFloat - correctAnswerFloat) < epsilon) {
      isAnswerCorrect = true;
      localStorage.setItem('resultados', JSON.stringify('correcto'));
      localStorage.setItem('ultimaTarea', 'calculo');
      localStorage.setItem('cambio', 'si');
    } else {
      
      setIncorrectAttempts(incorrectAttempts + 1);
      setCurrentHintIndex(Math.min(incorrectAttempts, hints.length - 1));
    }

    setIsCorrect(isAnswerCorrect);
  };

 
  const generateSVG = () => {
  
    const svgSourceFrequency = sourceFrequency;
    const svgSpeedOfSound = speedOfSound;
    const svgDistance = distance;
    const svgObservedFrequency = observedFrequency;

    
    const velocityOfCar = ((svgObservedFrequency - svgSourceFrequency) / svgSourceFrequency) * svgSpeedOfSound;

   
    const scale = svgDistance > 300 ? 1 : svgDistance / 300;

    
    const observerX = 10 * scale;
    const carX = (100 + svgDistance) * scale;
    const textX = (50 * scale) + observerX;
    const pathX1 = observerX + 10;
    const pathX2 = carX - 10;

 
    const frequencyLineY = 40;

   
    const frequencyLineLength = (svgObservedFrequency - svgSourceFrequency) * 5;

  
    return (
      <svg width={svgDistance * scale + 400} height="300" xmlns="http://www.w3.org/2000/svg">
        
        <line x1="0" y1="150" x2={svgDistance * scale + 300} y2="150" stroke="black" strokeWidth="2" />

   
        <rect x={carX - 10} y="120" width="20" height="10" fill="blue" />
        <text x={carX - 18} y="150" fill="blue"></text>

      
        <circle cx={carX} cy="125" r="5" fill="red" />
        <text x={carX - 15} y="110" fill="red">Fuente de Sonido</text>

   
        <circle cx={observerX} cy="150" r="5" fill="green" />
        <text x={observerX - 5} y="175" fill="green">Observador</text>

      
        <text x={carX + 20} y="135" fill="red">{`Frecuencia: ${svgSourceFrequency} Hz`}</text>

       
        <text x={observerX - 0} y="200" fill="green">{`Frecuencia percibida: ${svgObservedFrequency} Hz`}</text>

       
        <line x1={carX} y1="125" x2={observerX} y2="150" stroke="black" strokeWidth="1" />
        <text x={(carX + observerX) / 2 - 10} y="145" fill="black">{`${svgDistance} m`}</text>

       
        <text x="10" y="20" fill="black">{`Velocidad del sonido: ${speedOfSound} m/s`}</text>
      </svg>
    );
  };


  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4 text-blue-800">✏️ Pregunta de cálculo ✏️</h1>

      <br />

      <div className="bg-blue-200 text-lg text-blue-800 mx-4 p-4 rounded-lg">
   
        <p>
          Un coche de policía se encuentra estacionado en la orilla de una carretera recta. El coche tiene una sirena que emite un sonido a una frecuencia de {sourceFrequency} Hz. La velocidad del sonido en el aire es de aproximadamente {speedOfSound} metros por segundo. Cuando el conductor está a {distance} metros del coche de policía, percibe la frecuencia de la sirena como {observedFrequency} Hz debido al efecto Doppler. ¿Cuál es la velocidad del sonido en el aire en este lugar?
        </p>
      </div>
      
      {generateSVG()}

      <br />

      <div className="text-lg text-blue-800">
        
        <div>
          <p>Introduce la velocidad del sonido en el aire (m/s):</p>
          <div className="flex items-center">
            <input
              className="bg-purple-100 rounded p-2"
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
            <span className="ml-2">m/s</span>
          </div>
          
          {isCorrect === false && renderHint()}
        </div>

       
        <button
          className="bg-purple-200 rounded-full px-4 py-2 mt-4 text-blue-400"
          onClick={checkAnswer}
        >
          Enviar respuesta
        </button>

   
        {isCorrect !== null && (
          <p className={`text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrect ? 'Respuesta correcta' : 'Respuesta incorrecta'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Plantilla2Dom4;
