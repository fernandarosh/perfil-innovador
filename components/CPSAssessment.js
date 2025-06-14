'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info, CheckCircle2, User, Mail, Building, Briefcase, Globe, Phone } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ywtdjwkxgvtntaicksbk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dGRqd2t4Z3Z0bnRhaWNrc2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjIyNjYsImV4cCI6MjA2NTQzODI2Nn0.OlBckntHtKRGgVAaSpmUtrpxUm3wCMefqftXJd0j-kY';
const supabase = createClient(supabaseUrl, supabaseKey);

const CPSAssessment = () => {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [currentStep, setCurrentStep] = useState('register');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  // Cargar script de Turnstile
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    // Función callback para Turnstile
    window.onTurnstileSuccess = function(token) {
      setCaptchaToken(token);
    };
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const questions = [
    {
      id: 1,
      options: [
        { text: "Alerta", tooltip: "Estar atento y vigilante ante los detalles del problema", dimension: "Experiencia" },
        { text: "Equilibrado", tooltip: "Mantener estabilidad entre diferentes perspectivas", dimension: "Ideación" },
        { text: "Listo", tooltip: "Preparado mentalmente para abordar desafíos", dimension: "Pensamiento" },
        { text: "Ansioso", tooltip: "Sentir urgencia por resolver el problema rápidamente", dimension: "Evaluación" }
      ]
    },
    {
      id: 2,
      options: [
        { text: "Paciente", tooltip: "Tomarse el tiempo necesario para entender completamente", dimension: "Experiencia" },
        { text: "Diligente", tooltip: "Trabajar con cuidado y persistencia en los detalles", dimension: "Ideación" },
        { text: "Contundente", tooltip: "Ser claro y directo en las conclusiones", dimension: "Pensamiento" },
        { text: "Preparado", tooltip: "Tener todo listo antes de actuar", dimension: "Evaluación" }
      ]
    },
    {
      id: 3,
      options: [
        { text: "Activo", tooltip: "Preferir la acción directa y la experimentación", dimension: "Experiencia" },
        { text: "Ingenuo", tooltip: "Abordar problemas con mente abierta y sin prejuicios", dimension: "Ideación" },
        { text: "Observador", tooltip: "Analizar cuidadosamente antes de actuar", dimension: "Pensamiento" },
        { text: "Realista", tooltip: "Enfocarse en lo que es práctico y alcanzable", dimension: "Evaluación" }
      ]
    },
    {
      id: 4,
      options: [
        { text: "Experimental", tooltip: "Probar diferentes enfoques para ver qué funciona", dimension: "Experiencia" },
        { text: "Diverso", tooltip: "Explorar múltiples alternativas y posibilidades", dimension: "Ideación" },
        { text: "Reflexivo", tooltip: "Tomarse tiempo para reflexionar antes de decidir", dimension: "Pensamiento" },
        { text: "Organizador", tooltip: "Organizar y estructurar la información disponible", dimension: "Evaluación" }
      ]
    },
    {
      id: 5,
      options: [
        { text: "Reservado", tooltip: "Preferir trabajar de manera reflexiva y privada", dimension: "Experiencia" },
        { text: "Serio", tooltip: "Abordar problemas con formalidad y rigor", dimension: "Ideación" },
        { text: "Gozador", tooltip: "Disfrutar del proceso de resolver problemas", dimension: "Pensamiento" },
        { text: "Juguetón", tooltip: "Usar creatividad y humor en la resolución", dimension: "Evaluación" }
      ]
    },
    {
      id: 6,
      options: [
        { text: "Práctico", tooltip: "Aprender probando diferentes soluciones", dimension: "Experiencia" },
        { text: "Creativo", tooltip: "Generar múltiples opciones antes de elegir", dimension: "Ideación" },
        { text: "Analítico", tooltip: "Evaluar cuidadosamente pros y contras", dimension: "Pensamiento" },
        { text: "Evaluador", tooltip: "Juzgar sistemáticamente las opciones disponibles", dimension: "Evaluación" }
      ]
    },
    {
      id: 7,
      options: [
        { text: "Resolutivo", tooltip: "Poner en práctica las soluciones rápidamente", dimension: "Experiencia" },
        { text: "Divergente", tooltip: "Expandir las posibilidades y pensar 'fuera de la caja'", dimension: "Ideación" },
        { text: "Abstracto", tooltip: "Encontrar patrones y conceptos generales", dimension: "Pensamiento" },
        { text: "Convergente", tooltip: "Enfocar las ideas hacia una solución específica", dimension: "Evaluación" }
      ]
    },
    {
      id: 8,
      options: [
        { text: "Directo", tooltip: "Ir al grano sin rodeos innecesarios", dimension: "Experiencia" },
        { text: "Posibilidades", tooltip: "Explorar todo el potencial de las situaciones", dimension: "Ideación" },
        { text: "Conceptual", tooltip: "Trabajar con ideas y teorías abstractas", dimension: "Pensamiento" },
        { text: "Realidades", tooltip: "Mantenerse conectado con hechos concretos", dimension: "Evaluación" }
      ]
    },
    {
      id: 9,
      options: [
        { text: "Involucrado", tooltip: "Participar activamente en el proceso", dimension: "Experiencia" },
        { text: "Cambiar Perspectivas", tooltip: "Ver el problema desde diferentes ángulos", dimension: "Ideación" },
        { text: "Teórico", tooltip: "Aplicar marcos conceptuales y modelos", dimension: "Pensamiento" },
        { text: "Enfocado", tooltip: "Concentrarse intensamente en objetivos específicos", dimension: "Evaluación" }
      ]
    },
    {
      id: 10,
      options: [
        { text: "Silencioso", tooltip: "Reflexionar internamente antes de compartir", dimension: "Experiencia" },
        { text: "Confiable", tooltip: "Ser consistente y digno de confianza", dimension: "Ideación" },
        { text: "Responsable", tooltip: "Asumir el deber de encontrar soluciones", dimension: "Pensamiento" },
        { text: "Imaginativo", tooltip: "Usar creatividad para generar ideas originales", dimension: "Evaluación" }
      ]
    },
    {
      id: 11,
      options: [
        { text: "Implementador", tooltip: "Llevar las ideas a la práctica efectivamente", dimension: "Experiencia" },
        { text: "Visionario", tooltip: "Imaginar claramente las soluciones futuras", dimension: "Ideación" },
        { text: "Descriptivo", tooltip: "Explicar detalladamente los problemas y soluciones", dimension: "Pensamiento" },
        { text: "Selectivo", tooltip: "Elegir las mejores opciones disponibles", dimension: "Evaluación" }
      ]
    },
    {
      id: 12,
      options: [
        { text: "Ejecutivo", tooltip: "Realizar las acciones necesarias eficientemente", dimension: "Experiencia" },
        { text: "Futurista", tooltip: "Pensar en implicaciones y consecuencias a largo plazo", dimension: "Ideación" },
        { text: "Racional", tooltip: "Usar lógica y razonamiento sistemático", dimension: "Pensamiento" },
        { text: "Detallista", tooltip: "Prestar atención a aspectos específicos y minuciosos", dimension: "Evaluación" }
      ]
    },
    {
      id: 13,
      options: [
        { text: "Movido", tooltip: "Impulsado a tomar acción y avanzar hacia soluciones", dimension: "Experiencia" },
        { text: "Imaginativo", tooltip: "Capaz de generar ideas creativas y originales", dimension: "Ideación" },
        { text: "Racional", tooltip: "Guiado por la lógica y el razonamiento sistemático", dimension: "Pensamiento" },
        { text: "Determinado", tooltip: "Firme en las decisiones y comprometido con los resultados", dimension: "Evaluación" }
      ]
    },
    {
      id: 14,
      options: [
        { text: "Desvinculado", tooltip: "Manteniendo distancia objetiva del problema", dimension: "Experiencia" },
        { text: "Orgulloso", tooltip: "Satisfecho con la calidad de las ideas generadas", dimension: "Ideación" },
        { text: "Esperanzado", tooltip: "Optimista sobre las posibilidades de encontrar soluciones", dimension: "Pensamiento" },
        { text: "Temeroso", tooltip: "Cauteloso ante los riesgos y consecuencias potenciales", dimension: "Evaluación" }
      ]
    },
    {
      id: 15,
      options: [
        { text: "Disciplinado", tooltip: "Metódico y constante en la aplicación de soluciones", dimension: "Experiencia" },
        { text: "Transformador", tooltip: "Enfocado en cambiar y adaptar enfoques según la necesidad", dimension: "Ideación" },
        { text: "Reflexivo", tooltip: "Pensativo y contemplativo en el análisis de opciones", dimension: "Pensamiento" },
        { text: "Decidido", tooltip: "Claro y firme al seleccionar la mejor alternativa", dimension: "Evaluación" }
      ]
    },
    {
      id: 16,
      options: [
        { text: "Controlado", tooltip: "Manejando el proceso de manera dirigida y efectiva", dimension: "Experiencia" },
        { text: "Especulativo", tooltip: "Explorando posibilidades y escenarios alternativos", dimension: "Ideación" },
        { text: "Contemplativo", tooltip: "Observando y analizando cuidadosamente los patrones", dimension: "Pensamiento" },
        { text: "Crítico", tooltip: "Evaluando rigurosamente el mérito de cada opción", dimension: "Evaluación" }
      ]
    },
    {
      id: 17,
      options: [
        { text: "Empático", tooltip: "Conectando emocionalmente con la situación y las personas", dimension: "Experiencia" },
        { text: "Práctico", tooltip: "Enfocado en aplicaciones útiles y realizables", dimension: "Ideación" },
        { text: "Emotivo", tooltip: "Guiado por sentimientos e intuición en el proceso", dimension: "Pensamiento" },
        { text: "Tardío", tooltip: "Tomándose el tiempo necesario antes de actuar", dimension: "Evaluación" }
      ]
    },
    {
      id: 18,
      options: [
        { text: "Activo", tooltip: "Implementando soluciones de manera inmediata y enérgica", dimension: "Experiencia" },
        { text: "Diferenciado", tooltip: "Capaz de identificar matices y diferencias importantes", dimension: "Ideación" },
        { text: "Analítico", tooltip: "Descomponiendo problemas en elementos comprensibles", dimension: "Pensamiento" },
        { text: "Seguro", tooltip: "Confiado en que los resultados cumplirán los estándares", dimension: "Evaluación" }
      ]
    }
  ];

  const countries = [
    'Afganistán', 'Albania', 'Alemania', 'Andorra', 'Angola', 'Antigua y Barbuda', 'Arabia Saudita', 'Argelia', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaiyán',
    'Bahamas', 'Bahrein', 'Bangladesh', 'Barbados', 'Bélgica', 'Belice', 'Benín', 'Bielorrusia', 'Birmania', 'Bolivia', 'Bosnia y Herzegovina', 'Botsuana', 'Brasil', 'Brunéi', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Bután',
    'Cabo Verde', 'Camboya', 'Camerún', 'Canadá', 'Catar', 'Chad', 'Chile', 'China', 'Chipre', 'Colombia', 'Comoras', 'Corea del Norte', 'Corea del Sur', 'Costa de Marfil', 'Costa Rica', 'Croacia', 'Cuba',
    'Dinamarca', 'Dominica',
    'Ecuador', 'Egipto', 'El Salvador', 'Emiratos Árabes Unidos', 'Eritrea', 'Eslovaquia', 'Eslovenia', 'España', 'Estados Unidos', 'Estonia', 'Etiopía',
    'Filipinas', 'Finlandia', 'Fiyi', 'Francia',
    'Gabón', 'Gambia', 'Georgia', 'Ghana', 'Granada', 'Grecia', 'Guatemala', 'Guyana', 'Guinea', 'Guinea Ecuatorial', 'Guinea-Bisáu',
    'Haití', 'Honduras', 'Hungría',
    'India', 'Indonesia', 'Irak', 'Irán', 'Irlanda', 'Islandia', 'Islas Marshall', 'Islas Salomón', 'Israel', 'Italia',
    'Jamaica', 'Japón', 'Jordania',
    'Kazajistán', 'Kenia', 'Kirguistán', 'Kiribati', 'Kuwait',
    'Laos', 'Lesoto', 'Letonia', 'Líbano', 'Liberia', 'Libia', 'Liechtenstein', 'Lituania', 'Luxemburgo',
    'Madagascar', 'Malasia', 'Malaui', 'Maldivas', 'Malí', 'Malta', 'Marruecos', 'Mauricio', 'Mauritania', 'México', 'Micronesia', 'Moldavia', 'Mónaco', 'Mongolia', 'Montenegro', 'Mozambique',
    'Namibia', 'Nauru', 'Nepal', 'Nicaragua', 'Níger', 'Nigeria', 'Noruega', 'Nueva Zelanda',
    'Omán',
    'Países Bajos', 'Pakistán', 'Palaos', 'Panamá', 'Papúa Nueva Guinea', 'Paraguay', 'Perú', 'Polonia', 'Portugal',
    'Reino Unido', 'República Centroafricana', 'República Checa', 'República del Congo', 'República Democrática del Congo', 'República Dominicana', 'República Sudafricana', 'Ruanda', 'Rumania', 'Rusia',
    'Samoa', 'San Cristóbal y Nieves', 'San Marino', 'San Vicente y las Granadinas', 'Santa Lucía', 'Santo Tomé y Príncipe', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leona', 'Singapur', 'Siria', 'Somalia', 'Sri Lanka', 'Suazilandia', 'Sudán', 'Sudán del Sur', 'Suecia', 'Suiza', 'Surinam',
    'Tailandia', 'Tanzania', 'Tayikistán', 'Timor Oriental', 'Togo', 'Tonga', 'Trinidad y Tobago', 'Túnez', 'Turkmenistán', 'Turquía', 'Tuvalu',
    'Ucrania', 'Uganda', 'Uruguay', 'Uzbekistán',
    'Vanuatu', 'Vaticano', 'Venezuela', 'Vietnam',
    'Yemen',
    'Yibuti',
    'Zambia', 'Zimbabue'
  ];

  const profileDescriptions = {
    'Generador': {
      title: 'Generador (Concreto + Activo)',
      characteristics: [
        'Orientado a la acción y la experiencia directa',
        'Aprende haciendo y experimentando',
        'Busca oportunidades y nuevas experiencias',
        'Prefiere la variedad y el cambio'
      ],
      strengths: [
        'Excelente para iniciar proyectos',
        'Detecta oportunidades que otros no ven',
        'Actúa rápidamente ante los problemas',
        'Aporta energía y entusiasmo'
      ],
      tips: [
        'Canaliza tu energía hacia objetivos específicos',
        'Busca feedback constante para ajustar tu rumbo',
        'Colabora con tipos más reflexivos para equilibrar tu impulsividad',
        'Documenta tus experiencias para aprender de ellas'
      ]
    },
    'Conceptualizador': {
      title: 'Conceptualizador (Abstracto + Reflexivo)',
      characteristics: [
        'Piensa en términos teóricos y conceptuales',
        'Analiza patrones y relaciones complejas',
        'Prefiere la reflexión profunda',
        'Busca entender el "por qué" de las cosas'
      ],
      strengths: [
        'Desarrolla marcos teóricos sólidos',
        'Identifica patrones ocultos',
        'Aporta perspectiva estratégica',
        'Excelente para análisis profundo'
      ],
      tips: [
        'Traduce tus ideas abstractas en términos prácticos',
        'Busca datos concretos para validar tus teorías',
        'Colabora con tipos más activos para implementar tus ideas',
        'Establece plazos para evitar el "análisis paralítico"'
      ]
    },
    'Optimizador': {
      title: 'Optimizador (Abstracto + Activo)',
      characteristics: [
        'Enfocado en mejorar y perfeccionar',
        'Busca eficiencia y resultados',
        'Orientado a objetivos y resultados',
        'Prefiere soluciones probadas y efectivas'
      ],
      strengths: [
        'Excelente para implementar soluciones',
        'Optimiza procesos y sistemas',
        'Logra resultados consistentes',
        'Aporta disciplina y estructura'
      ],
      tips: [
        'Mantente abierto a enfoques innovadores',
        'No te limites solo a soluciones conocidas',
        'Balancea la eficiencia con la creatividad',
        'Involucra a otros tipos para generar nuevas ideas'
      ]
    },
    'Implementador': {
      title: 'Implementador (Concreto + Reflexivo)',
      characteristics: [
        'Enfocado en la aplicación práctica',
        'Evalúa cuidadosamente antes de actuar',
        'Busca soluciones factibles y realistas',
        'Prefiere la planificación detallada'
      ],
      strengths: [
        'Excelente para ejecutar planes',
        'Evalúa riesgos cuidadosamente',
        'Aporta estabilidad y confiabilidad',
        'Asegura que las ideas sean viables'
      ],
      tips: [
        'No te paralices en la planificación excesiva',
        'Acepta que no toda la información estará disponible',
        'Colabora con generadores para acelerar el proceso',
        'Experimenta con pequeños prototipos antes de la implementación completa'
      ]
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleUserDataChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isRegistrationComplete = () => {
    const required = ['nombre', 'email', 'empresa', 'cargo', 'pais', 'telefono'];
    const hasAllFields = required.every(field => userData[field] && userData[field].trim() !== '');
    const validEmail = isValidEmail(userData.email || '');
    const validPhone = isValidPhone(userData.telefono || '');
    
    return hasAllFields && validEmail && validPhone;
  };

  const startAssessment = async () => {
    if (!isRegistrationComplete() || !captchaToken) {
      alert('Por favor completa el CAPTCHA');
      return;
    }
      
      setIsLoading(true);
      
      try {
        const userToSave = {
          nombre: userData.nombre.trim(),
          email: userData.email.trim().toLowerCase(),
          telefono: userData.telefono.trim(),
          empresa: userData.empresa.trim(),
          cargo: userData.cargo.trim(),
          pais: userData.pais,
          newsletter: userData.newsletter || false
        };
        
  const { data, error } = await supabase
    .from('usuarios')
    .insert([userToSave])
    .select();
        
        if (error) throw error;
        
        setUserId(data[0].id);
        console.log('Usuario guardado exitosamente:', data[0]);
        setCurrentStep('assessment');
        
      } catch (error) {
        console.error('Error al guardar usuario:', error);
        alert(`Error al guardar datos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

  const handleRatingChange = (optionIndex, rating) => {
    const questionId = questions[currentQuestion].id;
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [optionIndex]: rating
      }
    }));
  };

  const getCurrentQuestionRatings = () => {
    const questionId = questions[currentQuestion].id;
    return responses[questionId] || {};
  };

  const isQuestionComplete = () => {
    const ratings = getCurrentQuestionRatings();
    const values = Object.values(ratings);
    const hasAllRatings = values.length === 4;
    const hasUniqueRatings = new Set(values).size === 4;
    const hasValidRange = values.every(v => v >= 1 && v <= 4);
    return hasAllRatings && hasUniqueRatings && hasValidRange;
  };

  const canGoNext = () => {
    return isQuestionComplete();
  };

  const goNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (canGoNext()) {
      calculateResults();
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = async () => {
    const totals = {
      Experiencia: 0,
      Ideación: 0,
      Pensamiento: 0,
      Evaluación: 0
    };

  // ✅ SOLO usar las preguntas específicas del método CPS
  const questionsToUse = [3, 4, 6, 7, 8, 9, 11, 12, 13, 15, 16, 18];

  // ✅ FILTRAR: Solo sumar las preguntas especificadas
  questionsToUse.forEach(questionId => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const questionResponses = responses[questionId] || {};
      question.options.forEach((option, index) => {
        const rating = questionResponses[index] || 0;
        totals[option.dimension] += rating;
      });
    }
  });

      const cuadrantes = {
        'Generador': totals.Experiencia + totals.Ideación,
        'Conceptualizador': totals.Ideación + totals.Pensamiento,
        'Optimizador': totals.Pensamiento + totals.Evaluación,
        'Implementador': totals.Evaluación + totals.Experiencia
      };

  // ✅ FÓRMULA CORREGIDA: Calcular porcentajes basados en el total real
  const totalCuadrantes = Object.values(cuadrantes).reduce((a, b) => a + b, 0);
  const porcentajes = {};
  Object.keys(cuadrantes).forEach(cuadrante => {
    porcentajes[cuadrante] = (cuadrantes[cuadrante] / totalCuadrantes) * 100;
  });

      const dominantStyle = Object.keys(porcentajes).find(
        key => porcentajes[key] === Math.max(...Object.values(porcentajes))
      );

      setIsLoading(true);
      
      try {
        const evaluationToSave = {
          usuario_id: userId,
          respuestas: responses,
          experiencia: totals.Experiencia,
          ideacion: totals.Ideación,
          pensamiento: totals.Pensamiento,
          evaluacion: totals.Evaluación,
          generador_pct: porcentajes.Generador,
          conceptualizador_pct: porcentajes.Conceptualizador,
          optimizador_pct: porcentajes.Optimizador,
          implementador_pct: porcentajes.Implementador,
          estilo_dominante: dominantStyle
        };

        const { data, error } = await supabase
          .from('evaluaciones')
          .insert([evaluationToSave])
          .select();

        if (error) throw error;

        console.log('Evaluación guardada exitosamente:', data[0]);
        setShowResults({ totals, cuadrantes, porcentajes });
        
      } catch (error) {
        console.error('Error al guardar evaluación:', error);
        setShowResults({ totals, cuadrantes, porcentajes });
      } finally {
        setIsLoading(false);
      }
    };

  const resetAssessment = () => {
    setCurrentStep('register');
    setCurrentQuestion(0);
    setResponses({});
    setUserData({});
    setUserId(null);
    setShowResults(false);
  };

  const downloadResults = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Obtener el estilo dominante
      const maxPercentage = Math.max(...Object.values(showResults.porcentajes));
      const dominantStyle = Object.keys(showResults.porcentajes).find(
        key => showResults.porcentajes[key] === maxPercentage
      );
      
      // Configurar fuente
      pdf.setFont('helvetica');
      
      // ENCABEZADO
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text('MI PERFIL INNOVADOR', pageWidth/2, 20, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.text('Evaluación CPS - Creative Problem Solving', pageWidth/2, 30, { align: 'center' });
      
      // INFORMACIÓN PERSONAL
      let yPos = 55;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INFORMACIÓN PERSONAL', 20, yPos);
      
      yPos += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Nombre: ${userData.nombre}`, 20, yPos);
      yPos += 7;
      pdf.text(`Email: ${userData.email}`, 20, yPos);
      yPos += 7;
      pdf.text(`Empresa: ${userData.empresa}`, 20, yPos);
      yPos += 7;
      pdf.text(`Cargo: ${userData.cargo}`, 20, yPos);
      yPos += 7;
      pdf.text(`País: ${userData.pais}`, 20, yPos);
      
      // ESTILO DOMINANTE
      yPos += 20;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ESTILO DOMINANTE', 20, yPos);
      
      yPos += 10;
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPos - 5, pageWidth - 40, 15, 'F');
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${dominantStyle} - ${showResults.porcentajes[dominantStyle]?.toFixed(1)}%`, 25, yPos + 5);
      
      // RESULTADOS POR CUADRANTE
      yPos += 25;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RESULTADOS POR CUADRANTE', 20, yPos);
      
      yPos += 10;
      Object.entries(showResults.porcentajes).forEach(([cuadrante, porcentaje], index) => {
        // Nombre del cuadrante
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${cuadrante}:`, 20, yPos);
        
        // Porcentaje
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${porcentaje.toFixed(1)}%`, 80, yPos);
        
        // Barra de progreso
        const barWidth = 80;
        const barHeight = 4;
        const barX = 110;
        const barY = yPos - 2;
        
        // Fondo de la barra
        pdf.setFillColor(220, 220, 220);
        pdf.rect(barX, barY, barWidth, barHeight, 'F');
        
        // Progreso de la barra
        const fillColor = cuadrante === dominantStyle ? [0, 0, 0] : [150, 150, 150];
        pdf.setFillColor(...fillColor);
        pdf.rect(barX, barY, (porcentaje / 100) * barWidth, barHeight, 'F');
        
        yPos += 12;
      });
      
      // DESCRIPCIÓN DEL PERFIL DOMINANTE
      if (profileDescriptions[dominantStyle]) {
        yPos += 15;
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`PERFIL: ${profileDescriptions[dominantStyle].title.toUpperCase()}`, 20, yPos);
        
        yPos += 15;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Características:', 20, yPos);
        
        yPos += 8;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        profileDescriptions[dominantStyle].characteristics.forEach((char, index) => {
          const lines = pdf.splitTextToSize(`• ${char}`, pageWidth - 40);
          lines.forEach(line => {
            if (yPos > pageHeight - 30) {
              pdf.addPage();
              yPos = 30;
            }
            pdf.text(line, 25, yPos);
            yPos += 6;
          });
        });
        
        yPos += 5;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Fortalezas:', 20, yPos);
        
        yPos += 8;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        profileDescriptions[dominantStyle].strengths.forEach((strength, index) => {
          const lines = pdf.splitTextToSize(`• ${strength}`, pageWidth - 40);
          lines.forEach(line => {
            if (yPos > pageHeight - 30) {
              pdf.addPage();
              yPos = 30;
            }
            pdf.text(line, 25, yPos);
            yPos += 6;
          });
        });
        
        yPos += 5;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Consejos para el desarrollo:', 20, yPos);
        
        yPos += 8;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        profileDescriptions[dominantStyle].tips.forEach((tip, index) => {
          const lines = pdf.splitTextToSize(`• ${tip}`, pageWidth - 40);
          lines.forEach(line => {
            if (yPos > pageHeight - 30) {
              pdf.addPage();
              yPos = 30;
            }
            pdf.text(line, 25, yPos);
            yPos += 6;
          });
        });
      }
      
      // PIE DE PÁGINA
      const footerY = pageHeight - 20;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, pageWidth/2, footerY, { align: 'center' });
      
      // DESCARGAR EL PDF
      const fileName = `perfil-innovador-${userData.nombre.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el PDF. Inténtalo de nuevo.');
    }
  };

  const SpiderChart = ({ data }) => {
    const size = 400;
    const center = size / 2;
    const maxRadius = 130;
    const levels = 5;
    
    const dataArray = Object.entries(data);
    const maxValue = Math.max(...Object.values(data));
    
    const angleStep = (2 * Math.PI) / 4;
    
    const polarToCartesian = (angle, radius) => {
      const x = center + radius * Math.cos(angle - Math.PI / 2);
      const y = center + radius * Math.sin(angle - Math.PI / 2);
      return { x, y };
    };
    
    const dataPoints = dataArray.map(([key, value], index) => {
      const angle = index * angleStep;
      const radius = (value / maxValue) * maxRadius;
      return polarToCartesian(angle, radius);
    });
    
    const axisLines = dataArray.map((_, index) => {
      const angle = index * angleStep;
      const end = polarToCartesian(angle, maxRadius);
      return `M ${center} ${center} L ${end.x} ${end.y}`;
    });
    
    const concentricCircles = Array.from({ length: levels }, (_, i) => {
      const radius = ((i + 1) / levels) * maxRadius;
      return radius;
    });
    
    const dataPath = dataPoints.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width={size} height={size} className="overflow-visible">
            {concentricCircles.map((radius, index) => (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
            
            {axisLines.map((line, index) => (
              <path
                key={index}
                d={line}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
            ))}
            
            <path
              d={dataPath}
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
              className="drop-shadow-lg"
            />
            
            {dataPoints.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                className="drop-shadow-md"
              />
            ))}
            
            {dataArray.map(([key, value], index) => {
              const angle = index * angleStep;
              const labelPosition = polarToCartesian(angle, maxRadius + 55);
              const maxPercentage = Math.max(...Object.values(data));
              const isDominant = value === maxPercentage;
              
              return (
                <g key={key}>
                  <text
                    x={labelPosition.x}
                    y={labelPosition.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`${isDominant ? 'fill-white font-medium' : 'fill-white/70'} text-sm`}
                    style={{ fontSize: isDominant ? '14px' : '13px' }}
                  >
                    {key}
                  </text>
                  <text
                    x={labelPosition.x}
                    y={labelPosition.y + 16}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white/70 text-xs font-light"
                    style={{ fontSize: '12px' }}
                  >
                    {value.toFixed(1)}%
                  </text>
                  {isDominant && (
                    <text
                      x={labelPosition.x}
                      y={labelPosition.y + 30}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white/60 text-xs"
                      style={{ fontSize: '10px' }}
                    >
                      ⭐ Dominante
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        
        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
          {dataArray.map(([key, value], index) => (
            <div key={key} className="flex items-center gap-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <div>
                <div className="text-white/90 text-sm font-light">{key}</div>
                <div className="text-white/60 text-xs">{value.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (showResults) {
    const maxPercentage = Math.max(...Object.values(showResults.porcentajes));
    const dominantStyle = Object.keys(showResults.porcentajes).find(
      key => showResults.porcentajes[key] === maxPercentage
    );

    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/5 rotate-45"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-white/5 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border border-white/10 rotate-12"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-8">
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-12 shadow-2xl">
            <div className="text-center mb-8 sm:mb-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-thin text-white mb-4 tracking-wide">Evaluación completada</h1>
            </div>

            {/* Hero section con resultado y gráfico */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12">
              
              {/* Lado izquierdo: Resultado principal */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                  <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-white/80 text-sm tracking-wide">PERFIL DOMINANTE</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-thin text-white mb-2">{dominantStyle}</h2>
                <p className="text-2xl sm:text-3xl text-white/70 mb-4">{showResults.porcentajes[dominantStyle]?.toFixed(1)}%</p>
                <p className="text-white/60 leading-relaxed text-lg max-w-md mx-auto lg:mx-0">
                  {profileDescriptions[dominantStyle]?.characteristics[0]}
                </p>
                
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 max-w-md mx-auto lg:mx-0">
                  <p className="text-white/80 text-sm">
                    💡 <strong>Insight:</strong> Tu perfil muestra una fuerte tendencia hacia este estilo innovador. 
                    Destacas en las características principales de {dominantStyle.toLowerCase()}.
                  </p>
                </div>
              </div>

              {/* Lado derecho: Gráfico mejorado */}
              <div className="flex justify-center">
                <SpiderChart data={showResults.porcentajes} />
              </div>
            </div>

            {/* Cards de información del perfil */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              
              {/* Características */}
              <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-normal text-white">Características</h3>
                </div>
                <ul className="space-y-3">
                  {profileDescriptions[dominantStyle]?.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
                      <span className="text-white/40 mt-1">•</span>
                      <span className="leading-relaxed">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fortalezas */}
              <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-normal text-white">Fortalezas</h3>
                </div>
                <ul className="space-y-3">
                  {profileDescriptions[dominantStyle]?.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
                      <span className="text-white/40 mt-1">•</span>
                      <span className="leading-relaxed">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Consejos */}
              <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-normal text-white">Consejos</h3>
                </div>
                <ul className="space-y-3">
                  {profileDescriptions[dominantStyle]?.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
                      <span className="text-white/40 mt-1">•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-12 sm:mt-16">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <button
                  onClick={downloadResults}
                  className="flex items-center justify-center gap-3 px-8 sm:px-12 py-3 sm:py-4 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 rounded-2xl text-white font-light text-base sm:text-lg tracking-wide transition-all duration-300 shadow-xl"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Descargar PDF
                </button>
                
                <button
                  onClick={resetAssessment}
                  className="backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-2xl font-light text-base sm:text-lg tracking-wide transition-all duration-300 shadow-xl"
                >
                  Nueva evaluación
                </button>
              </div>
              {/* Banner de Técnicas Creativas */}
              <div className="mt-6 sm:mt-8">
                <p className="text-sm sm:text-base text-white/80 backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 mx-auto max-w-md sm:max-w-lg">
                  ✨ Continúa tu desarrollo con nuestro{' '}
                  <a 
                    href="https://blackschool.rocks/tecnicas-creativas/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 underline font-medium transition-colors duration-200"
                  >
                    Taller de Técnicas Creativas
                  </a>
                </p>
              </div>      
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'register') {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/5 rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 border border-white/5 rotate-45"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 border border-white/5 rounded-full"></div>
          <div className="absolute bottom-40 right-10 w-20 h-20 border border-white/5 rotate-12"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto p-4 sm:p-8">
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl min-h-[600px]">
            <div className="text-center mb-12 sm:mb-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h1 className="text-3xl sm:text-5xl font-thin text-white mb-6 tracking-wide">Perfil innovador</h1>
              <p className="text-white/70 text-lg sm:text-xl font-light max-w-2xl mx-auto">Descubre tu estilo único de resolución de problemas</p>
            </div>

            <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto">
              <div>
                <label className="block text-white/80 text-base font-light mb-3">Nombre completo *</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/40" />
                  <input
                    type="text"
                    value={userData.nombre || ''}
                    onChange={(e) => handleUserDataChange('nombre', e.target.value)}
                    className="w-full pl-16 pr-6 py-4 sm:py-5 backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl text-white text-lg placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-base font-light mb-3">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/40" />
                  <input
                    type="email"
                    value={userData.email || ''}
                    onChange={(e) => handleUserDataChange('email', e.target.value)}
                    className={`w-full pl-16 pr-6 py-4 sm:py-5 backdrop-blur-sm bg-white/5 border rounded-2xl text-white text-lg placeholder-white/40 focus:outline-none transition-colors ${
                      userData.email && !isValidEmail(userData.email) 
                        ? 'border-red-400 focus:border-red-400' 
                        : 'border-white/20 focus:border-white/40'
                    }`}
                    placeholder="tu@email.com"
                  />
                </div>
                {userData.email && !isValidEmail(userData.email) && (
                  <p className="text-red-400 text-sm mt-2">Por favor ingresa un email válido</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-base font-light mb-3">Teléfono móvil *</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/40" />
                  <input
                    type="tel"
                    value={userData.telefono || ''}
                    onChange={(e) => handleUserDataChange('telefono', e.target.value)}
                    className={`w-full pl-16 pr-6 py-4 sm:py-5 backdrop-blur-sm bg-white/5 border rounded-2xl text-white text-lg placeholder-white/40 focus:outline-none transition-colors ${
                      userData.telefono && !isValidPhone(userData.telefono) 
                        ? 'border-red-400 focus:border-red-400' 
                        : 'border-white/20 focus:border-white/40'
                    }`}
                    placeholder="+52 55 1234 5678"
                  />
                </div>
                {userData.telefono && !isValidPhone(userData.telefono) && (
                  <p className="text-red-400 text-sm mt-2">Por favor ingresa un teléfono válido (8-15 dígitos)</p>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-base font-light mb-3">Empresa/Organización *</label>
                <div className="relative">
                  <Building className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/40" />
                  <input
                    type="text"
                    value={userData.empresa || ''}
                    onChange={(e) => handleUserDataChange('empresa', e.target.value)}
                    className="w-full pl-16 pr-6 py-4 sm:py-5 backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl text-white text-lg placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-base font-light mb-3">Cargo/Puesto *</label>
                <div className="relative">
                  <Briefcase className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/40" />
                  <input
                    type="text"
                    value={userData.cargo || ''}
                    onChange={(e) => handleUserDataChange('cargo', e.target.value)}
                    className="w-full pl-16 pr-6 py-4 sm:py-5 backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl text-white text-lg placeholder-white/40 focus:border-white/40 focus:outline-none transition-colors"
                    placeholder="Tu puesto actual"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-base font-light mb-3">País *</label>
                <div className="relative">
                  <Globe className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/40" />
                  <select
                    value={userData.pais || ''}
                    onChange={(e) => handleUserDataChange('pais', e.target.value)}
                    className="w-full pl-16 pr-6 py-4 sm:py-5 backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl text-white text-lg focus:border-white/40 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-black">Selecciona tu país</option>
                    {countries.map(country => (
                      <option key={country} value={country} className="bg-black">{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8">
                <div className="flex items-start gap-5">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={userData.newsletter || false}
                    onChange={(e) => handleUserDataChange('newsletter', e.target.checked)}
                    className="mt-2 w-6 h-6 rounded border-white/20 bg-white/5 text-white focus:ring-white/20"
                  />
                  <div className="flex-1">
                    <label htmlFor="newsletter" className="text-white/90 text-base font-light cursor-pointer">
                      Sí, quiero suscribirme a <strong className="font-normal">#Cápsula</strong>
                    </label>
                    <p className="text-white/60 text-base mt-2 font-light leading-relaxed">
                      Nuestro newsletter quincenal con la mejor curaduría de temas alrededor de creatividad, innovación, diseño, negocios y futuros.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12 sm:mt-16">
              {/* CAPTCHA de Turnstile */}
              <div className="mb-8 flex justify-center">
                <div 
                  className="cf-turnstile" 
                  data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAABhA-P-saUwd8wpl'}
                  data-callback="onTurnstileSuccess"
                  data-theme="dark"
                ></div>
              </div>
              
              <button
                onClick={startAssessment}
                disabled={!isRegistrationComplete() || !captchaToken || isLoading}
                className="w-full sm:w-auto px-12 sm:px-16 py-4 sm:py-5 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 rounded-2xl text-white font-light text-lg sm:text-xl tracking-wide disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-xl"
              >
                {isLoading ? 'Guardando...' : 'Comenzar evaluación'}
              </button>
              <p className="text-white/50 text-sm mt-6 font-light">
                * Campos obligatorios
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/5 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-white/5 rotate-45"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 border border-white/5 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 border border-white/5 rotate-12"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-8">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-12 shadow-2xl">
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl font-thin text-white tracking-wide">Perfil innovador</h1>
              <span className="text-white/60 font-light tracking-wide">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6 sm:mb-8">
              <div 
                className="h-full bg-gradient-to-r from-white to-white/70 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-8">
              <p className="text-white/90 text-base sm:text-lg leading-relaxed font-light">
                Responde honestamente el adjetivo que describa mejor a cómo reaccionas a la hora de resolver problemas. 
                Por cada fila debes enumerar del <strong className="font-normal text-white">1 al 4</strong>, siendo 
                <strong className="font-normal text-white"> 4 el mayor puntaje</strong> y 
                <strong className="font-normal text-white"> 1 el menor</strong>. 
                Cada número solo se puede usar una vez por fila.
              </p>
              <p className="text-white/70 text-sm sm:text-base mt-4 font-light flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                Si tienes dudas sobre el significado de algún concepto, toca el símbolo de información.
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-thin text-white mb-6 sm:mb-8 tracking-wide">
              Pregunta {questions[currentQuestion].id}
            </h2>

            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="group relative">
                <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 p-4 sm:p-6">
                  {/* Layout responsive: vertical en móvil, horizontal en desktop */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-lg sm:text-xl font-light text-white tracking-wide">{option.text}</span>
                      <button
                        onMouseEnter={() => setHoveredTooltip(`${currentQuestion}-${index}`)}
                        onMouseLeave={() => setHoveredTooltip(null)}
                        onClick={() => setHoveredTooltip(hoveredTooltip === `${currentQuestion}-${index}` ? null : `${currentQuestion}-${index}`)}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors duration-200 flex-shrink-0"
                      >
                        <Info className="w-3 h-3 text-white/60" />
                      </button>
                    </div>
                    
                    {/* Botones en grilla de 4 columnas para móvil, flex para desktop */}
                    <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-3 w-full sm:w-auto">
                      {[1, 2, 3, 4].map(rating => (
                        <button
                          key={rating}
                          onClick={() => handleRatingChange(index, rating)}
                          className={`h-10 sm:h-12 sm:w-12 rounded-xl border font-light text-base sm:text-lg tracking-wide transition-all duration-200 ${
                            getCurrentQuestionRatings()[index] === rating
                              ? 'bg-white text-black border-white shadow-lg transform scale-105'
                              : 'border-white/30 hover:border-white/50 hover:bg-white/10 text-white/80'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tooltip adaptativo */}
                {hoveredTooltip === `${currentQuestion}-${index}` && (
                  <div className="absolute left-0 top-full mt-2 z-20 backdrop-blur-xl bg-black/90 border border-white/20 rounded-xl px-4 py-3 w-full sm:max-w-xs shadow-2xl">
                    <p className="text-white/90 text-sm font-light">{option.tooltip}</p>
                    <div className="absolute -top-2 left-4 sm:left-8 w-4 h-4 bg-black/90 border-l border-t border-white/20 transform rotate-45"></div>
                  </div>
                )}
              </div>
            ))}

            {!isQuestionComplete() && (
              <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl p-4 sm:p-6">
                <p className="text-white/80 font-light text-sm sm:text-base">
                  💡 Recuerda: Debes usar cada número (1, 2, 3, 4) exactamente una vez en esta pregunta.
                </p>
              </div>
            )}
          </div>

          {/* Navegación responsive */}
          <div className={`flex mt-8 sm:mt-12 gap-4 ${currentQuestion === 0 ? 'justify-end' : 'justify-between'}`}>
            {currentQuestion > 0 && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-2xl text-white/80 hover:text-white transition-all duration-200 font-light tracking-wide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
            )}

            <button
              onClick={goNext}
              disabled={!canGoNext() || isLoading}
              className="flex items-center gap-2 sm:gap-3 px-8 sm:px-12 py-3 sm:py-4 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 rounded-2xl text-white font-light tracking-wide disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-xl flex-1 sm:flex-initial justify-center"
            >
              <span className="text-sm sm:text-base">
                {isLoading ? 'Guardando...' : currentQuestion === questions.length - 1 ? 'Ver resultados' : 'Siguiente'}
              </span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPSAssessment;
