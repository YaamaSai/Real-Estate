import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ name, options, value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideTrigger = selectRef.current && !selectRef.current.contains(event.target);
      const isOutsidePortal = !event.target.closest('.custom-select-portal');
      
      if (isOutsideTrigger && isOutsidePortal) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const updateCoords = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('scroll', updateCoords);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen]);

  // Handle simple string array or object array for options
  const formattedOptions = options.map(opt =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = formattedOptions.find(opt => opt.value === value) || formattedOptions[0];

  return (
    <div className="relative w-full" ref={selectRef}>
      <button 
        type="button"
        className={`w-full flex items-center justify-center cursor-pointer select-none transition-all duration-300 relative z-20 ${
          className.includes('bg-') 
            ? '' 
            : 'px-5 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-700 hover:border-slate-450 focus:border-gold-500'
        } ${isOpen ? 'ring-2 ring-gold-500/20 border-gold-500 bg-white' : ''} ${className}`}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <span className="truncate text-center w-full px-8 pointer-events-none">{selectedOption?.label || "Select..."}</span>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown size={18} className={`text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-gold-500' : ''}`} />
        </div>
      </button>

      {isOpen && createPortal(
        <div 
          className="custom-select-portal fixed z-[10000] bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_-30px_60px_-12px_rgba(0,0,0,0.3)] overflow-hidden py-2 animate-fadeIn"
          style={{ 
            top: coords.top - 8, 
            left: coords.left, 
            width: coords.width,
            transform: 'translateY(-100%)'
          }}
        >
          {formattedOptions.map((option, idx) => (
            <div
              key={idx}
              className={`px-6 py-4 cursor-pointer transition-all duration-300 text-[11px] font-black uppercase tracking-[0.2em] text-center ${
                value === option.value 
                  ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-gold-600'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Selecting option: ${option.value} for ${name}`);
                onChange({ target: { name, value: option.value } });
                setIsOpen(false);
              }}
            >
              <div className="flex items-center justify-center gap-3">
                {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></div>}
                <span>{option.label}</span>
                {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></div>}
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default CustomSelect;
