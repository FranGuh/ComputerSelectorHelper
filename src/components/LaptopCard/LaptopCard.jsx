import React from 'react'
import './LaptopCard.css'

// UX-03: heading text differs for approximate matches
function LaptopCard({ model }) {
  if (!model) return null

  const heading = model.isApproximate
    ? 'Esta laptop se acerca a tu perfil:'
    : 'Te sugerimos esta laptop:'

  return (
    <div className="LaptopCard">
      <h3>{heading}</h3>
      <img
        src={model.image}
        alt={model.name}
        className="LaptopCard__image"
        loading="lazy"
        onError={(e) => { e.target.src = '/help.svg'; e.target.onerror = null; }}
      />
      <h4>{model.name}</h4>
      <p><strong>Uso recomendado:</strong> {model.use}</p>
      <p><strong>Especificaciones:</strong> {model.specs}</p>
      <p><strong>Precio aproximado:</strong> {model.price}</p>
      <a href={model.link} target="_blank" rel="noopener noreferrer" className="LaptopCard__button">
        Ver en tienda
      </a>
    </div>
  )
}

export default LaptopCard
