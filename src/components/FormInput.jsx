import React from 'react';
import useMenuStore from '../store/useMenuStore';
import { Calendar, Utensils, Type } from 'lucide-react';
import { cleanText } from '../utils/nlpProcessor';

const FormInput = () => {
  const { menu, setMenu } = useMenuStore();

  const handleBlur = (day, value) => {
    const cleaned = cleanText(value);
    setMenu(day, cleaned);
  };

  const days = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
  ];

  return (
    <div className="form-container">
      <div className="form-days-grid">
        {days.map((day) => (
          <div key={day.key} className="input-group">
            <label className="input-label">
              <Calendar size={14} />
              <span>{day.label}</span>
            </label>
            <div className="input-wrapper">
              <Utensils className="input-icon" size={16} />
              <input
                type="text"
                className="text-input"
                placeholder="Ej: Milanesas + puré"
                defaultValue={menu[day.key]}
                onBlur={(e) => handleBlur(day.key, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="divider"></div>

      <div className="input-group">
        <label className="input-label">
          <Type size={14} />
          <span>Notas / Novedades</span>
        </label>
        <input
          type="text"
          className="text-input"
          placeholder="Ej: No olvides que tenemos envíos gratis!"
          defaultValue={menu.notas}
          onBlur={(e) => setMenu('notas', e.target.value)}
        />
      </div>


      <style jsx="true">{`
        .form-container {
          background: white;
          padding: 20px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow);
        }
        
        .form-days-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 600px) {
          .form-days-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
          opacity: 0.5;
        }

        .text-input {
          width: 100%;
          padding: 12px 12px 12px 38px;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: var(--radius-sm);
          font-family: inherit;
          font-size: 16px; /* Avoid iOS zoom */
          background: #fcfcfc;
          transition: all 0.2s ease;
        }

        .text-input:focus {
          outline: none;
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 3px hsla(var(--p-h), var(--p-s), var(--p-l), 0.1);
        }

        .divider {
           height: 1px;
           background: #eee;
           margin: 20px 0;
        }

        /* Notes input style update */
        .form-container > .input-group .text-input {
          padding-left: 12px;
        }

        .config-row { display: flex; justify-content: space-between; align-items: center; }
        .theme-selector {
           display: flex;
           gap: 8px;
           flex-wrap: wrap;
           margin-top: 8px;
        }
        .theme-chip {
           padding: 8px 16px;
           background: #f5f5f5;
           border-radius: 20px;
           font-size: 0.85rem;
           color: #666;
           border: 1px solid transparent;
        }
        .theme-chip.active {
           background: hsla(var(--p-h), var(--p-s), var(--p-l), 0.1);
           color: var(--primary);
           border-color: var(--primary);
        }
        .extra-configs { display: flex; flex-direction: column; gap: 15px; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
        .decor-chips { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 5px; }
        .decor-chip { padding: 6px 12px; border-radius: 8px; border: 1px solid #ddd; background: white; font-size: 0.8rem; }
        .decor-chip.active { background: #333; color: white; border-color: #333; }
        .flex-center-start {
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </div>
  );
};

export default FormInput;
