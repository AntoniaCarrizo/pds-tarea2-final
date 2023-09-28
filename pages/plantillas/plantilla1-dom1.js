import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import Modal from 'react-modal';
import Chart from 'chart.js/auto';


const Plantilla1Dom1 = () => {
  const [property, setProperty] = useState(0);
  const [variable1, setVariable1] = useState(0);
  const [variable2, setVariable2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const epsilon = 0.05;
  const propertyOptions = ['Velocidad', 'Longitud de Onda', 'Frecuencia'];
  const variableLabels = [
    ['Longitud de Onda (m)', 'Frecuencia (Hz)'],
    ['Frecuencia (Hz)', 'Velocidad (m/s)'],
    ['Longitud de Onda (m)', 'Velocidad (m/s)'],
  ];

  const [showNextTaskButton, setShowNextTaskButton] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: 'Intersección valores',
        data: [{ x: 0, y: 0 }],
        backgroundColor: 'blue',
        borderColor: 'blue',
        borderWidth: 2,
      },
      {
        label: 'Recta',
        data: [],
        type: 'line',
        backgroundColor: 'rgba(255, 0, 0, 1)',
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  });

  const hints = [
    'Puedes calcular la velocidad utilizando la fórmula de una onda, que relaciona la velocidad, la longitud de onda y la frecuencia.',
    'Puedes calcular la velocidad utilizando la fórmula de una onda, que relaciona la velocidad, la longitud de onda y la frecuencia.',
    'Recuerda las relaciones fundamentales entre estas tres propiedades en las ondas. Por ejemplo, λ = v / f, donde λ es la Longitud de Onda, v es la Velocidad y f es la Frecuencia.',
    'La formula que relaciona las 3 variables es  λ = v / f,'
  ];

  const [hintIndex, setHintIndex] = useState(0);

  const generateRandomProperty = () => {
    const randomProperty = Math.floor(Math.random() * 3);
    setProperty(randomProperty);
  };

  const generateRandomValues = () => {
    const randomVariable1 = Math.random() * 100;
    const randomVariable2 = Math.random() * 100;

    setVariable1(randomVariable1);
    setVariable2(randomVariable2);

    setChartData({
      datasets: [
        {
          ...chartData.datasets[0],
          data: [{ x: randomVariable1, y: randomVariable2 }],
        },
        {
          ...chartData.datasets[1],
          data: [
            { x: 0, y: 0 },
            { x: randomVariable1, y: randomVariable2 },
          ],
        },
      ],
    });

    setUserAnswer('');
    setIsCorrect(null);
    setShowSubmitButton(true);
    setShowNextTaskButton(false);
  };

  const checkAnswer = () => {
    let correct = false;

    switch (property) {
      case 0:
        setCorrectAnswer(variable2 * variable1);
        console.log(correctAnswer);
        break;
      case 1:
        setCorrectAnswer(variable2 / variable1);
        console.log(correctAnswer);
        break;
      case 2:
        setCorrectAnswer(variable1 / variable2);
        console.log(correctAnswer);
        break;
      default:
        break;
    }

    const userAnswerFloat = parseFloat(userAnswer);
    const correctAnswerFloat = parseFloat(correctAnswer);

    if (Math.abs(userAnswerFloat - correctAnswerFloat) < epsilon) {
      correct = true;
      setShowSubmitButton(false);
      localStorage.setItem('resultados', JSON.stringify('incorrecto'));
      localStorage.setItem('ultimaTarea', 'calculo');
      localStorage.setItem('cambio', 'si');
    } else {
      setHintIndex(hintIndex + 1);
    }

    setIsCorrect(correct);
  };

  useEffect(() => {
    setHintIndex(0);
    generateRandomProperty();
    generateRandomValues();
  }, []);

  let xAxisLabel, yAxisLabel;

  switch (property) {
    case 0:
      xAxisLabel = 'Longitud de Onda (m)';
      yAxisLabel = 'Frecuencia (Hz)';
      break;
    case 1:
      xAxisLabel = 'Frecuencia (Hz)';
      yAxisLabel = 'Velocidad (m/s)';
      break;
    case 2:
      xAxisLabel = 'Longitud de Onda (m)';
      yAxisLabel = 'Velocidad (m/s)';
      break;
    default:
      break;
  }

  const renderHint = () => {
    const hintToShow = hints[hintIndex];

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
      <h3 className=" font-semibold mb-4 text-blue-800">Triángulo de relación</h3>
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">

  <line x1="50" y1="180" x2="150" y2="180" stroke="black" />
  <line x1="50" y1="40" x2="50" y2="180" stroke="black" />
  <line x1="50" y1="40" x2="150" y2="180" stroke="black" />
  {property !== 2 && <text x="100" y="200">f</text>}
  {property !== 0 && <text x="30" y="100">v</text>}
  {property !== 1 && <text x="110" y="110">λ</text>}
</svg>
      <div className="mt-4">
        <Scatter
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: xAxisLabel,
                },
              },
              y: {
                type: 'linear',
                position: 'left',
                title: {
                  display: true,
                  text: yAxisLabel,
                },
              },
            },
          }}
        />
      </div>
      <div className="bg-blue-300 rounded p-4 w-2/3 text-center">
        <div className="text-lg">
          Datos:
          <p>
            {xAxisLabel}: {variable1.toFixed(2)}
          </p>
          <p>
            {yAxisLabel}: {variable2.toFixed(2)}
          </p>
        </div>
      </div>
      <br />
      <div className="text-lg text-blue-800">
        Se pide calcular la siguiente propiedad según los datos entregados en el enunciado: {propertyOptions[property]}
      </div>
      <br />
      <div className="text-lg text-blue-800">
        Introduce tu respuesta ({property === 0 ? 'm/s' : property === 1 ? 'm' : 'Hz'}):
        <div className="flex items-center">
          <input
            className="bg-purple-100 rounded p-2"
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(parseFloat(e.target.value))}
          />
          <span className="ml-2">{property === 0 ? 'm/s' : property === 1 ? 'm' : 'Hz'}</span>
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
            <button className={'bg-purple-200 rounded-full px-4 py-2 mt-4'} onClick={handleSiguienteTarea}>
              Siguiente tarea
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Plantilla1Dom1;
