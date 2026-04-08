import React, { useState } from 'react';
import useMenuStore from './store/useMenuStore';
import PromptInput from './components/PromptInput';
import FormInput from './components/FormInput';
import MenuPreview from './components/MenuPreview';
import { LayoutDashboard, MessageSquare, Palette, Maximize } from 'lucide-react';
import { THEMES } from './data/themes';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('prompt'); // prompt | form
  const { config, updateConfig } = useMenuStore();

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="serif italic">Vianda <span className="brand-accent">Studio</span></h1>
          <p className="subtitle outfit">CREA MENÚS PREMIUM EN SEGUNDOS</p>
        </div>
      </header>

      <main className="main-content">
        <div className="input-section">
          {/* Tabs */}
          <div className="tabs-container glass">
            <button 
              className={`tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
              onClick={() => setActiveTab('prompt')}
            >
              <MessageSquare size={18} />
              <span>Modo Libre</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              <LayoutDashboard size={18} />
              <span>Formulario</span>
            </button>
          </div>

          <div className="tab-content animate-in">
            {activeTab === 'prompt' ? <PromptInput /> : <FormInput />}
          </div>

          {/* SHARED CONFIGURATION */}
          <div className="shared-config glass animate-in" style={{ animationDelay: '0.1s' }}>
            <div className="config-group">
                <label className="config-label"><Palette size={16} /> Estilo Visual</label>
                <div className="theme-chips">
                    {Object.values(THEMES).map(t => (
                        <button 
                            key={t.id}
                            className={`theme-chip ${config.theme === t.id ? 'active' : ''}`}
                            onClick={() => updateConfig({ theme: t.id })}
                        >
                            {t.name}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="config-group">
                <label className="config-label"><Maximize size={16} /> Formato de Salida</label>
                <div className="format-toggle">
                  <button 
                    className={`format-btn ${config.format === 'square' ? 'active' : ''}`}
                    onClick={() => updateConfig({ format: 'square' })}
                  >1:1 (Cuadrado)</button>
                  <button 
                    className={`format-btn ${config.format === 'story' ? 'active' : ''}`}
                    onClick={() => updateConfig({ format: 'story' })}
                  >9:16 (Historia)</button>

                </div>
            </div>

          </div>
        </div>

        <div id="preview-section" className="preview-section">
          <h2 className="section-title serif">Vista Previa</h2>
          <MenuPreview />
        </div>
      </main>

      <footer className="app-footer">
        <p className="outfit">© 2026 Vianda Studio · Hecho para Mamá ❤️</p>
      </footer>
    </div>
  );
}

export default App;
