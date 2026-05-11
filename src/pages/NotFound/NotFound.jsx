import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaLaptop } from 'react-icons/fa'
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <>
      <Helmet>
        <title>Página no encontrada — Computer Selector Helper</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="NotFound">
        <FaLaptop className="NotFound__icon" aria-hidden="true" />
        <h2>404 — Página no encontrada</h2>
        <p>El link que seguiste no existe o fue movido.</p>
        <button className="NotFound__btn" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    </>
  )
}

export default NotFound
