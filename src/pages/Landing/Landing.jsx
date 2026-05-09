import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaExclamationTriangle, FaLaptop, FaCheckCircle, FaArrowRight } from 'react-icons/fa'
import './Landing.css'

const Landing = () => {
  const navigate = useNavigate()

  const handleStartQuiz = () => {
    navigate('/quiz')
  }

  return (
    <>
      <Helmet>
        <title>Computer Selector Helper — Encontrá tu laptop ideal</title>
        <meta name="description" content="Respondé unas preguntas y recibí una recomendación personalizada de laptop según tu presupuesto y necesidades reales." />
        <meta name="keywords" content="laptop, computadora, recomendación, comprar laptop, mejor laptop, asesor laptop" />
        <meta property="og:title" content="Computer Selector Helper — Encontrá tu laptop ideal" />
        <meta property="og:description" content="Respondé unas preguntas y recibí una recomendación personalizada de laptop según tu presupuesto y necesidades reales." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://computerselectorhelper.vercel.app/" />
        <meta property="og:image" content="https://computerselectorhelper.vercel.app/help.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Computer Selector Helper — Encontrá tu laptop ideal" />
        <meta name="twitter:description" content="Respondé unas preguntas y recibí una recomendación personalizada de laptop." />
      </Helmet>
      <div className="Landing">
        <h2>¿No sabés qué laptop elegir?</h2>
        <img className='Landing__img' src="/help.svg" alt="Asistente de ayuda para elegir laptop" />
      <p className="landing-subtitle">
        Respondé unas preguntas y recibí una recomendación personalizada según tu presupuesto y tus necesidades reales.
      </p>

      <div className="landing-benefits">
        <h2><FaCheckCircle /> ¿Por qué usar nuestro asistente?</h2>
        <ul>
          <li>✓ Elegí según tus necesidades reales, no por marca.</li>
          <li>✓ Evitá gastar de más (o de menos).</li>
          <li>✓ Ideal si no sabés de tecnología.</li>
        </ul>
      </div>

      <div className="landing-warnings">
        <h2><FaExclamationTriangle /> Errores comunes al comprar una laptop</h2>
        <ul>
          <li>❌ Comprar una máquina lenta por ahorrar de más.</li>
          <li>❌ Elegir por marca sin entender las specs.</li>
          <li>❌ No pensar en batería, peso o sistema operativo.</li>
        </ul>
      </div>

      <div className="landing-call-to-action">
        <h2><FaLaptop /> Encontrá tu laptop ideal</h2>
        <p>Usá nuestro asistente y descubrí opciones reales con explicación técnica clara.</p>
        <button onClick={handleStartQuiz} className="start-quiz-button">
          Empezar el cuestionario <FaArrowRight />
        </button>
      </div>
    </div>
    </>
  )
}

export default Landing
