import React, { useState } from 'react';
import useMenuStore from '../store/useMenuStore';
import { parsePrompt } from '../utils/nlpProcessor';
import { Sparkles, Send } from 'lucide-react';

const PromptInput = () => {
  const [text, setText] = useState('');
  const { setFullMenu, updateConfig } = useMenuStore();

  const handleMagic = () => {
    if (!text.trim()) return;
    const { menu, config } = parsePrompt(text);
    
    if (Object.keys(menu).length > 0) {
      setFullMenu({
        lunes: '', martes: '', miercoles: '', jueves: '', viernes: '', // Reset
        notas: 'No te olvides que tenemos envíos gratis!', // Fallback por defecto
        ...menu
      });
    }

    if (Object.keys(config).length > 0) {
      updateConfig(config);
    }

    // Efecto visual de carga o confirmación (opcional)
  };

  return (
    <div className="prompt-container animate-in">
      <div className="input-group">
        <label className="input-label">Describe tu menú de la semana</label>
        <textarea 
          className="textarea-input"
          placeholder="Ej: Lentejas el lunes, milanesas el martes, pasta el miércoles... Estilo naturaleza y formato historia."
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button className="primary-btn magic-btn" onClick={handleMagic} disabled={!text.trim()}>
        <Sparkles size={20} />
        <span>¡Hacer Magia!</span>
      </button>
      <p className="hint-text">El sistema detectará días, platos y estilos automáticamente.</p>
      
      <style jsx="true">{`
        .prompt-container {
          background: white;
          padding: 20px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow);
        }
        .textarea-input {
          resize: none;
          min-height: 120px;
        }
        .magic-btn {
          background: linear-gradient(135deg, var(--primary), #4361ee);
          border: none;
        }
        .hint-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
};

export default PromptInput;
