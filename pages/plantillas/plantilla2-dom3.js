import React, { useState, useEffect } from 'react';

const Plantilla2Dom3 = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [frequency, setFrequency] = useState(0); 
  const [speedOfSound, setSpeedOfSound] = useState(0); 
  const epsilon = 0.05;

  const hints = [
    'Utiliza la fórmula de velocidad de onda para calcular la longitud de onda.',
    'Recuerda que la velocidad de onda es igual a la frecuencia multiplicada por la longitud de onda.',
  ];

  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);

  const generateRandomValues = () => {
    const minFrequency = 200; 
    const maxFrequency = 800; 
    const minSpeedOfSound = 300; 
    const maxSpeedOfSound = 400; 

    const randomFrequency = Math.floor(Math.random() * (maxFrequency - minFrequency + 1)) + minFrequency;
    const randomSpeedOfSound = Math.floor(Math.random() * (maxSpeedOfSound - minSpeedOfSound + 1)) + minSpeedOfSound;

    setFrequency(randomFrequency);
    setSpeedOfSound(randomSpeedOfSound);
  };


  const generateRandomQuestion = () => {
    generateRandomValues(); 

  
    const wavelength = speedOfSound / frequency;

    setCorrectAnswer(wavelength.toFixed(2));
    setCurrentHintIndex(0); 
    setIncorrectAttempts(0); 
    setIsCorrect(null); 
  };


  useEffect(() => {
    setCurrentHintIndex(0);
    setIncorrectAttempts(0);
    generateRandomQuestion();
  }, []);

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
  const waveLineLength = 200 + (frequency - 300) * 2;

 
  const diagramSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="200">
    
      <rect x="50" y="100" width="20" height="100" fill="brown" />
      <ellipse cx="60" cy="100" rx="15" ry="15" fill="brown" />
      <line x1="60" y1="115" x2="60" y2="150" stroke="black" strokeWidth="2" />

      
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
        </marker>
      </defs>

     
      <line
        x1="70"
        y1="125"
        x2={70 + waveLineLength/5}
        y2="125"
        stroke="blue"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />
      <text x={80 + waveLineLength/5} y="128" fill="blue">
        {`Frecuencia: ${frequency} Hz`}
      </text>
    </svg>
  );

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4 text-blue-800">✏️ Pregunta de cálculo ✏️</h1>

      <br />

      <div className="bg-blue-200 text-lg text-blue-800 mx-4 p-4 rounded-lg">
        
        <p>
          {`Un músico está tocando una flauta y produce una onda sonora con una frecuencia fundamental de ${frequency} Hz. Si la velocidad del sonido en el aire es de aproximadamente ${speedOfSound} metros por segundo, ¿cuál es la longitud de onda de la onda sonora que produce la flauta?`}
        </p>
      </div>
             
              {diagramSVG}

      <br />

      <div className="text-lg text-blue-800">
        
        <div>
          <p>Introduce la longitud de onda de la onda sonora (m):</p>
          <div className="flex items-center">
            <input
              className="bg-purple-100 rounded p-2"
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
            <span className="ml-2">m</span>
          </div>
      
          {isCorrect === false && renderHint()}
          {console.log(correctAnswer)}
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

export default Plantilla2Dom3;
