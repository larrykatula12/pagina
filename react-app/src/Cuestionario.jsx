import React, { useState } from 'react';
import { cuestionarioData } from './preguntas';
import './Cuestionario.css';

export default function Cuestionario() {
  const [fase, setFase] = useState('inicio');
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');

  const { pregunta, opciones } = cuestionarioData[preguntaActual];

  const handleSeleccionarOpcion = (opcion) => {
    setOpcionSeleccionada(opcion);
  };

  const handleSiguientePregunta = () => {
    const siguienteIndex = preguntaActual + 1;

    if (siguienteIndex < cuestionarioData.length) {
      setPreguntaActual(siguienteIndex);
      setOpcionSeleccionada('');
    } else {
      setFase('resultado');
    }
  };

  const reiniciarCuestionario = () => {
    setFase('inicio');
    setPreguntaActual(0);
    setOpcionSeleccionada('');
  };

  const iniciarParticipacion = (participa) => {
    if (participa) {
      setFase('mensaje');
    } else {
      setFase('no');
    }
  };

  const comenzarCuestionario = () => {
    setFase('cuestionario');
    setPreguntaActual(0);
    setOpcionSeleccionada('');
  };

  if (fase === 'inicio') {
    return (
      <div className="cuestionario-container intro-container">
        <h2 className="pregunta-titulo">¿Quieres participar?</h2>
        <div className="intro-buttons">
          <button className="opcion-button" onClick={() => iniciarParticipacion(true)}>
            Sí
          </button>
          <button className="opcion-button" onClick={() => iniciarParticipacion(false)}>
            No
          </button>
        </div>
      </div>
    );
  }

  if (fase === 'mensaje') {
    return (
      <div className="cuestionario-container intro-container">
        <h2 className="pregunta-titulo">Adelante</h2>
        <p className="resultado-texto">Responde estas preguntas de forma sencilla y disfruta el cuestionario.</p>
        <button onClick={comenzarCuestionario} className="continuar-button">
          Comenzar cuestionario
        </button>
      </div>
    );
  }

  if (fase === 'no') {
    return (
      <div className="cuestionario-container resultado-container">
        <h2 className="resultado-titulo">Está bien, vas a participar igualmente</h2>
        <p className="resultado-texto">Responde estas preguntas de forma sencilla y disfruta el cuestionario.</p>
        <button onClick={comenzarCuestionario} className="continuar-button">
          Comenzar cuestionario
        </button>
      </div>
    );
  }

  if (fase === 'resultado') {
    return (
      <div className="cuestionario-container resultado-container">
        <h2 className="resultado-titulo">¡Muchas gracias!</h2>
        <p className="resultado-texto">Gracias por participar en el cuestionario.</p>
        <button onClick={reiniciarCuestionario} className="reintentar-button">
          Regresar al inicio
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
