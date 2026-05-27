import React from 'react';
import logoSvg from '../assets/logo.svg';

/**
 * Logo component — renders the exact Bridl360 gold wireframe SVG logo.
 * Transparent background — works on any surface (light navbar, dark sidebar, footer).
 *
 * @param {string} className    - wrapper div class
 * @param {string} imgClassName - img element class (controls size)
 */
const Logo = ({ className = "", imgClassName = "h-10 w-auto object-contain" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={logoSvg}
        alt="Bridl360"
        className={imgClassName}
        draggable={false}
      />
    </div>
  );
};

export default Logo;
