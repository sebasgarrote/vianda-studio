import React, { useRef, useState } from 'react';
import useMenuStore from '../store/useMenuStore';
import * as htmlToImage from 'html-to-image';
import { Download, Check, Loader2, Share2 } from 'lucide-react';
import { THEMES } from '../data/themes';

const MenuPreview = () => {
  const previewRef = useRef(null);
  const { menu, config } = useMenuStore();
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);

  const currentTheme = THEMES[config.theme] || THEMES.tradicional;
  const isSquare = config.format === 'square';

  const downloadImage = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const blob = await htmlToImage.toBlob(previewRef.current, { 
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff'
      });

      if (!blob) throw new Error('Blob generation failed');

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', `Menu_Vianda_${Date.now()}.png`);
      
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('Error al generar imagen:', err);
      alert('Error técnico al crear la imagen. Por favor, usa el botón de WhatsApp!');
    } finally {
      setDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    if (!previewRef.current) return;
    setSending(true);
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, { 
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true
      });
      
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `menu-${Date.now()}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Menú de la Semana',
          text: '¡Acá está nuestro menú! 🥗✨'
        });
      } else {
        const isHTTPS = window.location.protocol === 'https:';
        if (!isHTTPS && window.location.hostname !== 'localhost') {
            alert('¡Atención! Para compartir directo por WhatsApp necesitas entrar por una conexión segura (HTTPS).');
        } else {
            alert('Tu navegador no permite compartir imágenes directamente.');
        }
      }
    } catch (err) {
      console.log('Error sharing', err);
    } finally {
      setSending(false);
    }
  };

  const days = [
    { key: 'lunes', label: 'LUNES' },
    { key: 'martes', label: 'MARTES' },
    { key: 'miercoles', label: 'MIÉRCOLES' },
    { key: 'jueves', label: 'JUEVES' },
    { key: 'viernes', label: 'VIERNES' },
  ];

  return (
    <div className="preview-container" id="menu-preview-section">
      <div className="preview-wrapper glass" ref={previewRef}>
        <div className={`menu-card ${config.format}`}>
          {currentTheme.backgroundImage && (
            <div className="bg-layer" style={{ backgroundImage: `url(${currentTheme.backgroundImage})` }} />
          )}
          <div className="bg-overlay" />

          <div className="card-inner">
            <header className="card-header">
              <h1 className="serif">VIANDAS SALUDABLES</h1>
              <p className="subtitle outfit">¿Qué comemos esta semana?</p>
            </header>

            <div className="preview-days-grid">
              {days.map(day => (
                <div key={day.key} className="preview-day-card glass-card">
                  <span className="preview-day-name serif" style={{ color: currentTheme.colors.primary }}>{day.label}</span>
                  <p className="preview-dish-text outfit">{menu[day.key] || 'Cerrado'}</p>
                </div>
              ))}
              {isSquare && menu.notas && (
                <div className="preview-day-card glass-card info-card">
                    <p className="preview-dish-text outfit">{menu.notas}</p>
                </div>
              )}
            </div>

            {menu.notas && !isSquare && (
              <footer className="preview-card-footer glass-card">
                <p className="notas-text outfit">
                  <span className="novedad-badge serif" style={{ color: currentTheme.colors.primary }}>{menu.notas}</span>
                </p>
              </footer>
            )}
          </div>
        </div>
      </div>

      <div className="action-buttons-group">
        <button className="primary-btn download-btn" onClick={downloadImage} disabled={downloading}>
          {downloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
          <span>Descargar PNG</span>
        </button>
        <button className="secondary-btn share-btn" onClick={handleNativeShare} disabled={sending}>
          {sending ? <Loader2 className="animate-spin" size={20} /> : <Share2 size={20} />}
          <span>WhatsApp</span>
        </button>
      </div>

      <style jsx="true">{`
        .preview-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }
        .preview-wrapper {
          width: 100%;
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          overflow: hidden;
          background: #f0f0f0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
        }
        .menu-card {
          position: relative;
          width: 100%;
          max-width: 600px;
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          padding: 6%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .menu-card.square {
          aspect-ratio: 1 / 1;
          padding: 8px 12px 15px 12px; /* Top reduced to 8px to move title up */
        }
        @media (min-width: 900px) {
          .menu-card.square { padding: 30px 25px; }
        }
        .menu-card.story { 
          aspect-ratio: 9/16; 
          max-width: 420px; 
          padding: 2% 6% 8% 6%; /* Even less top padding */
        }

        .bg-layer { position: absolute; top:0; left:0; right:0; bottom:0; background-size: cover; background-position: center; z-index: 1; }
        .bg-overlay { position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(255,255,255,0.6); backdrop-filter: blur(4px); z-index: 2; }
        
        .card-inner { position: relative; z-index: 3; display: flex; flex-direction: column; height: 100%; justify-content: space-between; }
        .card-header { text-align: center; margin-bottom: 1%; } /* Reduced margin */
        /* --- MOBILE SIZES (Default) --- */
        .card-header h1 { font-size: 24px; margin: 0; color: #1a1a1a; text-transform: uppercase; }
        .square .card-header h1 { font-size: 20px; }
        .story .card-header h1 { 
          font-size: 26px; 
          word-spacing: -2px; /* Smoother, no se pegan tanto */
          white-space: nowrap; 
        } 
        .card-header .subtitle { font-size: 9px; color: #555; text-transform: uppercase; letter-spacing: 1px; }
        .story .card-header .subtitle { font-size: 11px; }
        
        .preview-day-name { font-size: 14px; font-weight: 700; border-bottom: 1px solid rgba(0,0,0,0.06); margin-bottom: 2px; }
        .story .preview-day-name { font-size: 16px; padding-bottom: 3px; }
        
        .preview-dish-text { font-size: 12px; line-height: 1.1; color: #222; }
        .story .preview-dish-text { font-size: 13.5px; line-height: 1.2; }
        
        .notas-text { font-size: 11px; }
        .story .notas-text { font-size: 13px; }

        /* --- WEB / DESKTOP SIZES (Over 900px) --- */
        @media (min-width: 900px) {
          .card-header h1 { 
            font-size: 36px; 
            word-spacing: normal; /* Reset para que no herede de mobile */
            white-space: normal; 
          }
          .square .card-header h1 { font-size: 32px; }
          .card-header .subtitle { font-size: 14px; }
          
          .preview-day-name { font-size: 18px; }
          
          .preview-dish-text { font-size: 16px; line-height: 1.2; }
          .story .preview-dish-text { font-size: 18px; } /* Larger for Web Story */
          
          .notas-text { font-size: 14px; }
          
          .menu-card { padding: 40px; }
          .menu-card.square { padding: 30px; }
          .preview-days-grid { gap: 15px; }
        }

        .preview-days-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; flex: 1; align-content: center; }
        .square .preview-days-grid { 
          gap: 6px 10px;
          margin-bottom: 10px;
        }
        .story .preview-days-grid { 
          grid-template-columns: 1fr; 
          gap: 7px; /* Reduced to avoid touching */
          align-content: start; 
          margin-top: 2%;
        }
        
        @media (min-width: 900px) {
          .preview-days-grid { gap: 15px; }
          .square .preview-days-grid { gap: 15px 25px; }
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.6);
          padding: 8px 10px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 900px) {
          .glass-card { padding: 15px 20px; border-radius: 12px; }
        }
        .novedad-badge { font-weight: 700; margin-right: 6px; }
        
        .info-card { background: hsla(var(--p-h), var(--p-s), var(--p-l), 0.05); border-color: hsla(var(--p-h), var(--p-s), var(--p-l), 0.2); }

        .action-buttons-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .secondary-btn { background: white; border: 2px solid var(--primary); color: var(--primary); padding: 16px; border-radius: 50px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
        
        @media (max-width: 600px) {
          .preview-wrapper { padding: 5px; }
          .secondary-btn, .primary-btn { padding: 12px 8px; font-size: 14px; }
        }
      `}</style>
    </div>
  );
};

export default MenuPreview;
