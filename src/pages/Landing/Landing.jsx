import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaLaptopCode, FaCheckCircle, FaArrowRight, FaShieldAlt, FaBolt, FaMicrochip, FaHistory, FaTrashAlt } from 'react-icons/fa'
import { getHistory, clearHistory } from '../../utils/historyStore'
import './Landing.css'

const BUDGET_LABELS = {
  low: 'Menos de $5,000',
  medium: '$5,000–$12,000',
  high: '$12,000–$25,000',
  premium: 'Más de $25,000',
}

const Landing = () => {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <>
      <Helmet>
        <title>Computer Selector Helper — Encontrá tu laptop ideal</title>
        <meta name="description" content="Respondé unas preguntas simples y recibí una recomendación experta de laptop basada en IA para tu presupuesto y uso real." />
      </Helmet>
      
      <div className="Landing">
        {/* Hero Section */}
        <section className="LandingHero">
          <div className="LandingHero__content">
            <div className="Badge">Asistente Inteligente</div>
            <h1 className="LandingHero__title">
              No compres por marca. <br />
              <span className="text-gradient">Elegí por rendimiento.</span>
            </h1>
            <p className="LandingHero__subtitle">
              Respondé unas preguntas simples y nuestro algoritmo te recomendará exactamente la laptop que necesitás. Sin tecnicismos ni gastar de más.
            </p>
            <div className="LandingHero__actions">
              <button onClick={() => navigate('/quiz')} className="BtnPrimary">
                Empezar el test gratis <FaArrowRight />
              </button>
            </div>
          </div>
          <div className="LandingHero__image">
            <img src="/help.svg" alt="Computer Selector AI Assistant" />
            <div className="FloatingCard FloatingCard--1">
              <FaCheckCircle className="icon-success" />
              <span>Análisis objetivo</span>
            </div>
            <div className="FloatingCard FloatingCard--2">
              <FaBolt className="icon-warning" />
              <span>Ahorrá dinero</span>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="LandingFeatures" aria-labelledby="landing-features-title">
          <h2 id="landing-features-title" className="sr-only">Por qué elegir Computer Selector Helper</h2>
          <div className="FeatureCard">
            <div className="FeatureCard__icon"><FaMicrochip /></div>
            <h3>Análisis Técnico</h3>
            <p>Cruzamos requisitos de CPU, RAM y GPU con el mercado actual para darte specs reales.</p>
          </div>
          <div className="FeatureCard">
            <div className="FeatureCard__icon"><FaShieldAlt /></div>
            <h3>Sin Publicidad</h3>
            <p>Recomendaciones 100% objetivas. No estamos patrocinados por ninguna marca de laptops.</p>
          </div>
          <div className="FeatureCard">
            <div className="FeatureCard__icon"><FaLaptopCode /></div>
            <h3>Para Todos</h3>
            <p>Desde estudiantes y gamers hasta programadores y editores de video profesionales.</p>
          </div>
        </section>

        {/* F-02: recent quiz results */}
        {history.length > 0 && (
          <section className="LandingHistory" aria-labelledby="landing-history-title">
            <div className="LandingHistory__header">
              <h2 id="landing-history-title" className="LandingHistory__title">
                <FaHistory aria-hidden="true" /> Tus consultas recientes
              </h2>
              <button type="button" className="LandingHistory__clear" onClick={handleClearHistory}>
                <FaTrashAlt aria-hidden="true" /> Limpiar
              </button>
            </div>
            <div className="LandingHistory__grid">
              {history.map((entry) => (
                <Link
                  key={entry.id}
                  to={`/quiz?plan=${entry.encodedAnswers}`}
                  className="HistoryCard"
                >
                  <span className="HistoryCard__specs">
                    {[entry.summary.processor, entry.summary.ram, entry.summary.gpu]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                  {entry.summary.budget && (
                    <span className="HistoryCard__budget">
                      Presupuesto: {BUDGET_LABELS[entry.summary.budget] || entry.summary.budget} MXN
                    </span>
                  )}
                  <span className="HistoryCard__cta">Ver de nuevo <FaArrowRight aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default Landing
