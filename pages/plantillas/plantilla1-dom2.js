import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import React from 'react';

const Plantilla1Dom2 = () => {
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
      'Para calcular la frecuencia de la onda generada en el modo fundamental de una cuerda, puedes utilizar la fórmula básica de las ondas. La fórmula que relaciona la velocidad de propagación de la onda (v), la longitud de la cuerda (L) y la frecuencia (f).',
      'Si tienes problemas para calcular la frecuencia, recuerda que siempre puedes recurrir a la fórmula y realizar la operación paso a paso. Asegúrate de que tus unidades estén en metros y segundos para que el resultado esté en Hertz (Hz).',
    ],
    [
      'Puedes recordar que en el caso del modo fundamental, la cuerda vibra con una sola onda estacionaria. Para calcular la longitud de onda en el segundo armónico, deberás considerar cómo cambia el patrón de vibración.',
      'En el segundo armónico, la cuerda tendrá un patrón de vibración que incluye un nodo en el centro. Esto significa que la longitud de onda será diferente al modo fundamental. Puedes recordar que en el modo fundamental, la longitud de onda es igual a dos veces la longitud de la cuerda.',
    ],
  ];

  const questions = [
    `Pregunta sobre la frecuencia: Si la longitud de la cuerda es de ${variable1.toFixed(2)} m y la velocidad de propagación de las ondas es de ${variable2.toFixed(2)} m/s en su modo fundamental, ¿cuál es la frecuencia de la onda generada?`,
    'Pregunta sobre el número de armónicos: Si esta cuerda vibrara en su segundo armónico en lugar de en su modo fundamental, ¿cuál sería la longitud de onda de la onda estacionaria resultante?',
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
        setCorrectAnswer((randomVariable2 * randomVariable1).toFixed(2));
        setAvailableHints([...Array(hints[0].length).keys()]); 
        break;
      case 1:
        setProperty(1);
        setVariable1(randomVariable1);
        setVariable2(randomVariable2);
        setCorrectAnswer((2 * randomVariable1 / 2).toFixed(2));
        setAvailableHints([...Array(hints[1].length).keys()]); 
        break;
      default:
        break;
    }
  };
  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: 'Cuerda',
        data: [{ x: variable1, y: 0 }, { x: variable1/10, y: 0 }], 
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
    console.log(correctAnswerFloat);
    if (Math.abs(userAnswerFloat - correctAnswerFloat) < epsilon) {
      correct = true;
      setShowSubmitButton(false);
      localStorage.setItem('resultados', JSON.stringify('incorrecto'));
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
            Una cuerda de longitud {variable1.toFixed(2)} m está fija en ambos extremos y se encuentra bajo tensión. Cuando se genera una onda en esta cuerda, se forman patrones de ondas estacionarias. La velocidad de propagación de las ondas en la cuerda es {variable2.toFixed(2)} m/s, y la cuerda solo vibra en su modo fundamental.
          </p>
        </div>
        <p>{questions[property]}</p>
      </div>
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
      <div className="mt-6">
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'linear', 
                min: 0,
                max: variable1,
              },
              y: {
                type: 'linear',
                min: -0.1, 
                max: 0.1, 
                ticks: {
                  stepSize: 0.1, 
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Plantilla1Dom2;
