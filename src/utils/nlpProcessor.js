/**
 * nlpProcessor.js
 * Extrae platos y días de la semana de un prompt de texto libre.
 */

const DAYS = [
  { key: 'lunes', matches: ['lunes', 'lun', 'luns'] },
  { key: 'martes', matches: ['martes', 'mar', 'marts'] },
  { key: 'miercoles', matches: ['miercoles', 'miercoles', 'mie', 'mié', 'miercl'] },
  { key: 'jueves', matches: ['jueves', 'jue', 'juevs'] },
  { key: 'viernes', matches: ['viernes', 'vie', 'vierns'] }
];

const STYLES = [
  { key: 'naturaleza', matches: ['naturaleza', 'verde', 'saludable', 'botánico', 'botanico', 'fit'] },
  { key: 'tradicional', matches: ['tradicional', 'clasico', 'clásico', 'casero', 'madera'] },
  { key: 'elegante', matches: ['elegante', 'moderno', 'premium', 'minimalista'] }
];

const CORRECTIONS = {
  'vejetales': 'vegetales',
  'milaneza': 'milanesa',
  'milanezas': 'milanesas',
  'wook': 'wok',
  'canastita': 'canastita',
  'pastas': 'pasta',
  'estofado': 'estofado',
  'fideos': 'fideos',
  'pure': 'puré',
  'miercoles': 'miércoles',
  'mié': 'miércoles',
  'berenjenas': 'berenjenas',
  'verenjenas': 'berenjenas',
  'calabasa': 'calabaza'
};

export const cleanText = (text) => {
  if (!text) return '';
  
  let cleaned = text.trim()
    .replace(/[.,;:\-_!?¡¿]+$/, '') // Quitar puntuación al final
    .replace(/\b(mas|más)\b/gi, '+') // REGLA: Sustituir "mas" o "más" por "+"
    .toLowerCase();
  
  // Corregir palabras comunes usando un mapeo directo por palabra
  const words = cleaned.split(/\s+/);
  const correctedWords = words.map(word => {
    const baseWord = word.replace(/[.,;:\-_!?¡¿]/g, '').toLowerCase();
    if (CORRECTIONS[baseWord]) {
      return CORRECTIONS[baseWord];
    }
    return word;
  });

  const joined = correctedWords.join(' ');
  return joined.charAt(0).toUpperCase() + joined.slice(1);
};

export const parsePrompt = (text) => {
  const results = {
    menu: {},
    config: {}
  };

  const lowerText = text.toLowerCase();

  // 1. Detección de Estilos Visuales (en todo el texto)

  STYLES.forEach(style => {
    if (style.matches.some(match => lowerText.includes(match))) {
      results.config.theme = style.key;
    }
  });

  // 2. Detección de Formato
  if (lowerText.includes('cuadrado') || lowerText.includes('feed') || lowerText.includes('1:1')) {
    results.config.format = 'square';
  } else if (lowerText.includes('historia') || lowerText.includes('story') || lowerText.includes('9:16') || lowerText.includes('vertical')) {
    results.config.format = 'story';
  }


  // 3. Procesamiento de Menú por Días
  // Reemplazamos todos los saltos de línea por espacios para procesar como oración única
  const normalizedText = text.replace(/\n/g, ' ');
  
  // Encontramos los índices de cada día mencionado
  const dayIndices = [];
  DAYS.forEach(dayGroup => {
    dayGroup.matches.forEach(match => {
      const regex = new RegExp(`\\b${match}\\b`, 'gi');
      let m;
      while ((m = regex.exec(normalizedText)) !== null) {
        dayIndices.push({ 
          index: m.index, 
          day: dayGroup.key, 
          matchStr: m[0],
          length: m[0].length 
        });
      }
    });
  });

  // Ordenar por aparición en el texto
  dayIndices.sort((a, b) => a.index - b.index);

  // Extraer el texto entre cada día
  dayIndices.forEach((current, i) => {
    const next = dayIndices[i + 1];
    const start = current.index + current.length;
    const end = next ? next.index : normalizedText.length;
    
    let rawDish = normalizedText.substring(start, end).trim();
    
    // Limpiar puntuación inicial/final que pudo quedar de la separación
    let dish = rawDish
      .replace(/^[.,;:\s\-+]+/, '') // Quitar basura al inicio
      .replace(/[.,;:\s\-+]$/, '') // Quitar basura al final (pero cleanText hace esto mejor)
      .trim();

    if (dish) {
      results.menu[current.day] = cleanText(dish);
    }
  });

  // 4. Extraer Notas (texto que sobra al final o palabras clave de envío)
  // Si hay texto considerable después del último plato, o si no se detectaron días
  const lastMatch = dayIndices[dayIndices.length - 1];
  let remainingText = '';
  
  if (lastMatch) {
    // Buscamos si hay algo después del último día capturado que no sea el plato
    // En realidad el bucle anterior ya capturó hasta el final del texto para el último día.
    // Vamos a ver si el último plato contiene palabras de "envio" y separarlas.
    const lastDayKey = lastMatch.day;
    const lastDish = results.menu[lastDayKey] || '';
    const shippingKeywords = ['envio', 'envío', 'gratis', 'delivery', 'pedido', 'atencion', 'atención'];
    
    shippingKeywords.forEach(word => {
        if (lastDish.toLowerCase().includes(word)) {
            const parts = lastDish.split(new RegExp(`(${word}.*)`, 'i'));
            if (parts.length > 1) {
                results.menu[lastDayKey] = parts[0].trim().replace(/[.,;:\s\-+]+$/, '');
                results.menu.notas = cleanText(parts[1]);
            }
        }
    });
  }

  return results;
};


export const detectKeywords = (dish) => {
  if (!dish) return null;
  const lower = dish.toLowerCase();
  if (lower.includes('ensalada') || lower.includes('verde') || lower.includes('vegetal') || lower.includes('liviano')) {
    return 'saludable';
  }
  if (lower.includes('carne') || lower.includes('milanesa') || lower.includes('pasta') || lower.includes('pollo')) {
    return 'proteico';
  }
  return null;
};
