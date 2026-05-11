import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaLaptopCode, FaCheckCircle, FaArrowRight, FaShieldAlt, FaBolt, FaMicrochip } from 'react-icons/fa'
import './Landing.css'

const Landing = () => {
  const navigate = useNavigate()

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
            <h2 className="LandingHero__title">
              No compres por marca. <br />
              <span className="text-gradient">Elegí por rendimiento.</span>
            </h2>
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
        <section className="LandingFeatures">
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
      </div>
    </>
  )
}

export default Landing
