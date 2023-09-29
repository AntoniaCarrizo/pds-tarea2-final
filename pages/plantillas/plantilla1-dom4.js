import React, { useState, useEffect } from 'react';
import React from 'react';
const Plantilla1Dom4 = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [observedFrequency, setObservedFrequency] = useState(0);
  const [sourceFrequency, setSourceFrequency] = useState(0); 
  const [speedOfSound, setSpeedOfSound] = useState(343); 
  const [distance, setDistance] = useState(0); 
  const epsilon = 0.05;

  const hints = [
    'Utiliza la fórmula del efecto Doppler para calcular la velocidad de la ambulancia.',
    'Recuerda que la velocidad del observador y la velocidad de la fuente pueden ser negativas dependiendo de si se acercan o se alejan.',
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
   
    const velocityOfAmbulance =
      ((observedFrequency - sourceFrequency) / observedFrequency) * speedOfSound;

    setCorrectAnswer(velocityOfAmbulance.toFixed(2));
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
  

    const velocityOfAmbulance = ((svgObservedFrequency - svgSourceFrequency) / svgSourceFrequency) * svgSpeedOfSound;
  
  
    const scale = svgDistance > 300 ? 1 : svgDistance / 300;

    const observerX = 10 * scale;
    const ambulanceX = (100 + svgDistance) * scale;
    const textX = (50 * scale) + observerX;
    const pathX1 = observerX + 10;
    const pathX2 = ambulanceX - 10;
  
 
    const frequencyLineY = 40;
  
   
    const frequencyLineLength = (svgObservedFrequency - svgSourceFrequency) * 5;
  
    
    const svg = (
      <svg width={svgDistance * scale + 300} height="200" xmlns="http://www.w3.org/2000/svg">
        
        <line x1={textX} y1={frequencyLineY} x2={textX + frequencyLineLength} y2={frequencyLineY} stroke="orange" strokeWidth="2" />
  

       
        <line x1={pathX1} y1="100" x2={pathX2} y2="100" stroke="blue" strokeWidth="4" />
  
       
        <rect x={ambulanceX - 5} y="80" width="20" height="40" fill="red" />
  
        
        <circle cx={observerX} cy="100" r="5" fill="green" />
  
      
        <text x={observerX} y="120" fill="green">Obs.</text>
        <text x={ambulanceX - 20} y="140" fill="red">Ambulancia</text>
        <text x={textX} y="80" fill="blue">{`Distancia: ${svgDistance} m`}</text>
        <text x={textX} y={frequencyLineY - 5} fill="orange">{`Diferencia frecuencias: ${svgObservedFrequency - svgSourceFrequency} Hz`}</text>

      </svg>
    );
  
    return svg;
  };
  
  
  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4 text-blue-800">✏️ Pregunta de cálculo ✏️</h1>

      <br />

      <div className="bg-blue-200 text-lg text-blue-800 mx-4 p-4 rounded-lg">
        
        <p>
          Un observador está parado en la acera viendo pasar una ambulancia que se acerca a él con una sirena que emite un sonido a una frecuencia de {sourceFrequency} Hz. La velocidad de la luz en el aire es de aproximadamente {speedOfSound} metros por segundo. En el instante en que la ambulancia se encuentra a {distance} metros del observador, la frecuencia percibida de la sirena es de {observedFrequency} Hz. ¿Cuál es la velocidad de la ambulancia?
        </p>
      </div>
      {generateSVG()}

      <br />

      <div className="text-lg text-blue-800">
      
        <div>
          <p>Introduce la velocidad de la ambulancia (m/s):</p>
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

export default Plantilla1Dom4;
