import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import React from 'react';
const Plantilla2Dom2 = () => {
  const [property, setProperty] = useState(0); 
  const [variable1, setVariable1] = useState(0);
  const [variable2, setVariable2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const epsilon = 0.05;
  const propertyOptions = ['Frecuencia', 'Armónicos']; 
  const variableLabels = [
    ['Longitud de Onda (m)', 'Frecuencia (Hz)'],
    ['Frecuencia (Hz)', 'Velocidad (m/s)'],
    ['Longitud de Onda (m)', 'Velocidad (m/s)'],
  ];

  const [showNextTaskButton, setShowNextTaskButton] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  const hints = [
    [
      'En los modos de vibración de una cuerda, el número de armónico (n) está relacionado con la longitud de onda (λ) de la onda estacionaria que se forma en la cuerda. ¿Puedes encontrar una relación entre n y λ que te ayude a calcular la frecuencia?',
      ' Observa cómo se divide la longitud de la cuerda en el tercer armónico. ¿Puedes identificar cómo se relaciona esta división con la longitud de onda?',
    ],
  ];

  const [availableHints, setAvailableHints] = useState([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const generateRandomQuestion = () => {
    const randomQuestion = Math.floor(Math.random() * 2);
    const randomVariable1 = Math.random() * 100;
    const randomVariable2 = Math.random() * 100;

    switch (randomQuestion) {
      case 0:
        setProperty(0);
        setVariable1(randomVariable1);
        setVariable2(randomVariable2);
        setCorrectAnswer((randomVariable2 / (2 * randomVariable1 / 3)).toFixed(2)); 
        setAvailableHints([...Array(hints[0].length).keys()]); 
        break;

        default:
            setProperty(0);
            setVariable1(randomVariable1);
            setVariable2(randomVariable2);
            setCorrectAnswer((randomVariable2 / (2 * randomVariable1 / 3)).toFixed(2));
            setAvailableHints([...Array(hints[0].length).keys()]); 
            break;
    }
  };

  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: 'Cuerda',
        data: [{ x: variable1, y: 0 }, { x: variable1 / 10, y: 0 }], 
        backgroundColor: 'rgba(0, 0, 255, 0.2)', 
        borderColor: 'blue', 
        borderWidth: 2,
      },
    ],
  });

  const checkAnswer = () => {
    const userAnswerFloat = parseFloat(userAnswer);
    const correctAnswerFloat = parseFloat(correctAnswer);
    let correct = false;


    const calculatedFrequency = variable2 / (2 * variable1 / 3);

    if (Math.abs(userAnswerFloat - calculatedFrequency) < epsilon) {
      correct = true;
      setShowSubmitButton(false);
      localStorage.setItem('resultados', JSON.stringify('correcto'));
      localStorage.setItem('ultimaTarea', 'calculo');
      localStorage.setItem('cambio', 'si');
    } else {
     
      if (availableHints.length > 0) {
        const nextHintIndex = availableHints.shift();
        setCurrentHintIndex(nextHintIndex);
      }
    }

    setIsCorrect(correct);
  };


  useEffect(() => {
    setCurrentHintIndex(0);
    generateRandomQuestion();
  }, []);

  const renderHint = () => {
  
    const hintToShow = hints[property][currentHintIndex];

    return (
      hintToShow && (
        <div className="bg-yellow-100 rounded p-4 mt-2">
          <div className="text-red-500">{hintToShow}</div>
        </div>
      )
    );
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4 text-blue-800">✏️ Pregunta de cálculo ✏️</h1>

      <br />

      <div className="bg-blue-200 text-lg text-blue-800 mx-4 p-4 rounded-lg">
       
        <div className="bg-blue-200 text-lg text-blue-800 mx-4 p-4 rounded-lg">
        
          <p>
            En una cuerda de guitarra de {variable1.toFixed(2)} metro de longitud, se crea una onda estacionaria en su tercer armónico. Si la velocidad de propagación de las ondas en la cuerda es de {variable2.toFixed(2)} m/s, ¿cuál es la frecuencia de vibración (f) en este modo?
          </p>
        </div>
      </div>

      <svg width={variable1.toFixed(2) * 10} height="200">

  <line x1="0" y1="100" x2={variable1.toFixed(2) * 10} y2="100" stroke="black" strokeWidth="2" />
  <text x={variable1.toFixed(2)} y="140" fontSize="12" fill="black">L = {variable1.toFixed(2)} </text> 


  <circle cx={variable1.toFixed(2) * 5} cy="100" r="5" fill="red" />
  <circle cx={variable1.toFixed(2) * 8} cy="100" r="5" fill="red" />
  <text x={variable1.toFixed(2) * 5 - 5} y="95" fontSize="12" fill="black">Nodo</text>
  <text x={variable1.toFixed(2) * 8 - 5} y="95" fontSize="12" fill="black">Nodo</text>

  <path d={`M ${variable1.toFixed(2) * 5} 100 Q ${variable1.toFixed(2) * 6.5} 110, ${variable1.toFixed(2) * 8} 100 T ${variable1.toFixed(2) * 10} 100`} fill="none" stroke="green" strokeWidth="2" />
  <text x={variable1.toFixed(2) * 5 + 40} y="90" fontSize="12" fill="black">Onda</text>

 
  <text x={variable1.toFixed(2) * 6 - 5} y="120" fontSize="16" fill="black">λ</text>
  <text x={variable1.toFixed(2) * 6} y="145" fontSize="12" fill="black"></text>

 
  <text x={variable1.toFixed(2) * 3} y="170" fontSize="16" fill="black">v= {variable2.toFixed(2)}</text>
</svg>

      <br />
      <br />
      <div className="text-lg text-blue-800">
        
        {property === 0 && (
          <p>Introduce tu respuesta (Hz):</p>
        )}
        {property === 1 && (
          <p>Introduce tu respuesta (m):</p>
        )}
        <div className="flex items-center">
          <input
            className="bg-purple-100 rounded p-2"
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(parseFloat(e.target.value))}
          />
       
          <span className="ml-2">
            {property === 0 ? 'Hz' : property === 1 ? 'm' : 'm'}
          </span>
        </div>
      </div>
      {showSubmitButton && (
        <button className="bg-purple-200 rounded-full px-4 py-2 mt-4 text-blue-400" onClick={checkAnswer}>
          Entregar respuesta
        </button>
      )}
      {isCorrect !== null && (
        <div>
          <p className={`text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            Tu respuesta es {isCorrect ? 'correcta' : 'incorrecta'}
          </p>
          {renderHint()}
          {showNextTaskButton && (
            <button className={'bg-purple-200 rounded-full px-4 py-2 mt-4'} onClick={generateRandomQuestion}>
              Siguiente tarea
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Plantilla2Dom2;
