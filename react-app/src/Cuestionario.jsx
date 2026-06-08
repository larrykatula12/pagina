import React, { useState } from 'react';
import { cuestionarioData } from './preguntas';
import { guardarRespuestasEnFirebase } from './firebase-config';
import './Cuestionario.css';

export default function Cuestionario() {
  const [fase, setFase] = useState('inicio');
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [textoOtro, setTextoOtro] = useState('');
  const [respuestas, setRespuestas] = useState([]);
  const [errorServidor, setErrorServidor] = useState('');
  const [guardando, setGuardando] = useState(false);

  const { pregunta, opciones } = cuestionarioData[preguntaActual];
  const esPreguntaNombre = preguntaActual === 0;
  const esOpcionConTexto = opcionSeleccionada === 'Otra cosa' || opcionSeleccionada === 'Especifica otra hora';

  const handleSeleccionarOpcion = (opcion) => {
    setOpcionSeleccionada(opcion);
    setTextoOtro('');
  };

  const enviarRespuestasAlServidor = async (nuevasRespuestas) => {
    setGuardando(true);
    try {
      await guardarRespuestasEnFirebase(nuevasRespuestas);
      console.log('Respuestas guardadas exitosamente en Firebase');
    } catch (error) {
      console.error('Error al guardar:', error);
      setErrorServidor('Error al guardar las respuestas. Por favor intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleSiguientePregunta = async () => {
    const siguienteIndex = preguntaActual + 1;
    const nuevaRespuesta = {
      pregunta,
      respuesta: opcionSeleccionada,
      detalle: esOpcionConTexto ? textoOtro : '',
    };
    const siguientesRespuestas = [...respuestas, nuevaRespuesta];

    if (siguienteIndex < cuestionarioData.length) {
      setRespuestas(siguientesRespuestas);
      setPreguntaActual(siguienteIndex);
      setOpcionSeleccionada('');
      setTextoOtro('');
    } else {
      setRespuestas(siguientesRespuestas);
      await enviarRespuestasAlServidor(siguientesRespuestas);
      setFase('resultado');
    }
  };

  const reiniciarCuestionario = () => {
    setFase('inicio');
    setPreguntaActual(0);
    setOpcionSeleccionada('');
    setTextoOtro('');
    setRespuestas([]);
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
    setTextoOtro('');
    setRespuestas([]);
  };

  if (fase === 'inicio') {
    return (
      <div className="cuestionario-container intro-container">
        <h2 className="pregunta-titulo">¿Quieres salir conmigo?</h2>
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
        <h2 className="resultado-titulo">Está bien, vamos a salir igualmente</h2>
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
        <h2 className="resultado-titulo">¡Muchas gracias por aceptar!</h2>
        <p className="resultado-texto">Se te informara sobre los detalles del evento en el corto plazo.</p>
        <p className="resultado-texto">
          Tus respuestas fueron enviadas y guardadas en el servidor.
        </p>
        {errorServidor && <p className="resultado-error">{errorServidor}</p>}
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

      {esPreguntaNombre ? (
        <div className="input-otra-opcion">
          <label htmlFor="nombreUsuario" className="input-label">
            Agregar nombre
          </label>
          <input
            id="nombreUsuario"
            type="text"
            value={opcionSeleccionada}
            onChange={(e) => setOpcionSeleccionada(e.target.value)}
            placeholder="Escribe tu nombre..."
            className="texto-otro-input"
          />
        </div>
      ) : (
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
      )}

      {esOpcionConTexto && (
        <div className="input-otra-opcion">
          <label htmlFor="textoOtro" className="input-label">
            {opcionSeleccionada === 'Otra cosa'
              ? 'Escribe qué quieres comer:'
              : 'Especifica la hora:'}
          </label>
          <input
            id="textoOtro"
            type="text"
            value={textoOtro}
            onChange={(e) => setTextoOtro(e.target.value)}
            placeholder={opcionSeleccionada === 'Otra cosa' ? 'Escribe otra opción...' : 'Escribe la hora...'}
            className="texto-otro-input"
          />
        </div>
      )}

      <button
        onClick={handleSiguientePregunta}
        disabled={!opcionSeleccionada || (esOpcionConTexto && !textoOtro.trim())}
        className="continuar-button"
      >
        Continuar
      </button>
    </div>
  );
}
