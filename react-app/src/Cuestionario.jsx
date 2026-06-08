import React, { useState } from 'react';
import { cuestionarioData } from './preguntas';
import './Cuestionario.css';

export default function Cuestionario() {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [puntaje, setPuntaje] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const { pregunta, opciones, respuestaCorrecta } = cuestionarioData[preguntaActual];

  const handleSeleccionarOpcion = (opcion) => {
    setOpcionSeleccionada(opcion);
  };

  const handleSiguientePregunta = () => {
    if (opcionSeleccionada === respuestaCorrecta) {
      setPuntaje(puntaje + 1);
    }

    const siguienteIndex = preguntaActual + 1;

    if (siguienteIndex < cuestionarioData.length) {
      setPreguntaActual(siguienteIndex);
      setOpcionSeleccionada('');
    } else {
      setMostrarResultado(true);
    }
  };

  const reiniciarCuestionario = () => {
    setPreguntaActual(0);
    setOpcionSeleccionada('');
    setPuntaje(0);
    setMostrarResultado(false);
  };

  if (mostrarResultado) {
    const porcentaje = Math.round((puntaje / cuestionarioData.length) * 100);
    let mensaje = '';

    if (porcentaje === 100) {
      mensaje = '¡Excelente! ¡Obtuviste una puntuación perfecta!';
    } else if (porcentaje >= 80) {
      mensaje = '¡Muy bien! ¡Gran desempeño!';
    } else if (porcentaje >= 60) {
      mensaje = 'Bien, puedes mejorar. ¡Intenta de nuevo!';
    } else {
      mensaje = 'Necesitas practicar más. ¡Vuelve a intentarlo!';
    }

    return (
      <div className="cuestionario-container resultado-container">
        <h2 className="resultado-titulo">¡Cuestionario Finalizado!</h2>
        <div className="resultado-score">{puntaje}/{cuestionarioData.length}</div>
        <p className="resultado-texto">Porcentaje: <strong>{porcentaje}%</strong></p>
        <p className="resultado-mensaje">{mensaje}</p>
        <button onClick={reiniciarCuestionario} className="reintentar-button">
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="cuestionario-container">
      <div className="progreso-container">
        <span className="progreso-texto">
          Pregunta {preguntaActual + 1} de {cuestionarioData.length}
        </span>
        <div className="progreso-bar">
          <div
            className="progreso-fill"
            style={{ width: `${((preguntaActual + 1) / cuestionarioData.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="pregunta-titulo">{pregunta}</h3>

      <div className="opciones-container">
        {opciones.map((opcion, index) => {
          const esSeleccionada = opcionSeleccionada === opcion;
          return (
            <button
              key={index}
              onClick={() => handleSeleccionarOpcion(opcion)}
              className={`opcion-button ${esSeleccionada ? 'seleccionada' : ''}`}
            >
              {opcion}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSiguientePregunta}
        disabled={!opcionSeleccionada}
        className="continuar-button"
      >
        Continuar
      </button>
    </div>
  );
}
