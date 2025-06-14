'use client';
import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Info, CheckCircle2, User, Mail, Building, Briefcase, Globe, Phone } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
// import { Turnstile } from '@marsidev/react-turnstile';

const supabase = createClient(
  'https://ykobwfbnfaydxvuqjxby.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrb2J3ZmJuZmF5ZHh2dXFqeGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMDg4NDEsImV4cCI6MjA0OTc4NDg0MX0.TG6Y3lw_e6M7uqKj7w6lTLo4Hb6pF8BhOVF-sHQ6-Jg'
);

const CPSAssessment = () => {
  const [currentStep, setCurrentStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);
  const [captchaToken, setCaptchaToken] = useState();
  const turnstileRef = useRef();

  const questions = [
    {
      text: "Cuando me enfrento a un problema...",
      options: [
        { text: "Busco inmediatamente varias opciones y alternativas diferentes", style: "Generador" },
        { text: "Analizo la situación para comprenderla desde diferentes perspectivas", style: "Conceptualizador" },
        { text: "Evalúo las mejores prácticas y busco enfoques probados", style: "Optimizador" },
        { text: "Me enfoco en definir pasos específicos y factibles para la acción", style: "Implementador" }
      ]
    },
    {
      text: "Al trabajar en un proyecto creativo, mi enfoque natural es...",
      options: [
        { text: "Explorar múltiples ideas sin limitaciones iniciales", style: "Generador" },
        { text: "Conectar conceptos aparentemente no relacionados", style: "Conceptualizador" },
        { text: "Refinar y perfeccionar las ideas más prometedoras", style: "Optimizador" },
        { text: "Desarrollar planes detallados para hacer realidad las ideas", style: "Implementador" }
      ]
    },
    {
      text: "En reuniones de equipo, tiendo a...",
      options: [
        { text: "Contribuir con muchas ideas espontáneas", style: "Generador" },
        { text: "Ayudar al grupo a ver el panorama completo", style: "Conceptualizador" },
        { text: "Cuestionar y mejorar las propuestas presentadas", style: "Optimizador" },
        { text: "Enfocarme en cómo podemos llevar las ideas a la práctica", style: "Implementador" }
      ]
    },
    {
      text: "Cuando aprendo algo nuevo...",
      options: [
        { text: "Me gusta experimentar y probar diferentes enfoques", style: "Generador" },
        { text: "Busco entender los principios fundamentales detrás del concepto", style: "Conceptualizador" },
        { text: "Comparo con lo que ya sé y busco la mejor manera de aplicarlo", style: "Optimizador" },
        { text: "Me enfoco en aplicaciones prácticas inmediatas", style: "Implementador" }
      ]
    },
    {
      text: "Mi fortaleza principal al resolver problemas es...",
      options: [
        { text: "Generar múltiples posibilidades rápidamente", style: "Generador" },
        { text: "Ver patrones y conexiones que otros no perciben", style: "Conceptualizador" },
        { text: "Identificar debilidades y áreas de mejora", style: "Optimizador" },
        { text: "Transformar ideas en resultados tangibles", style: "Implementador" }
      ]
    },
    {
      text: "Cuando trabajo bajo presión...",
      options: [
        { text: "Genero soluciones creativas rápidamente", style: "Generador" },
        { text: "Mantengo una perspectiva amplia del problema", style: "Conceptualizador" },
        { text: "Me enfoco en perfeccionar la mejor opción disponible", style: "Optimizador" },
        { text: "Priorizo acciones concretas que den resultados inmediatos", style: "Implementador" }
      ]
    },
    {
      text: "En mi tiempo libre, prefiero actividades que...",
      options: [
        { text: "Me permitan explorar nuevas experiencias y posibilidades", style: "Generador" },
        { text: "Me ayuden a reflexionar y ver las cosas desde nuevas perspectivas", style: "Conceptualizador" },
        { text: "Me permitan perfeccionar habilidades o conocimientos existentes", style: "Optimizador" },
        { text: "Tengan aplicaciones prácticas y resultados visibles", style: "Implementador" }
      ]
    },
    {
      text: "Al enfrentar una decisión importante...",
      options: [
        { text: "Considero múltiples opciones antes de decidir", style: "Generador" },
        { text: "Analizo el contexto y las implicaciones a largo plazo", style: "Conceptualizador" },
        { text: "Evalúo cuidadosamente los pros y contras de cada alternativa", style: "Optimizador" },
        { text: "Me enfoco en qué opción puedo ejecutar más efectivamente", style: "Implementador" }
      ]
    },
    {
      text: "Mi estilo de comunicación tiende a ser...",
      options: [
        { text: "Entusiasta y lleno de nuevas ideas", style: "Generador" },
        { text: "Reflexivo y orientado a los conceptos", style: "Conceptualizador" },
        { text: "Analítico y enfocado en los detalles", style: "Optimizador" },
        { text: "Directo y orientado a la acción", style: "Implementador" }
      ]
    },
    {
      text: "Al final de un proyecto exitoso, me siento más satisfecho por...",
      options: [
        { text: "Haber explorado múltiples posibilidades creativas", style: "Generador" },
        { text: "Haber desarrollado una comprensión profunda del problema", style: "Conceptualizador" },
        { text: "Haber optimizado y perfeccionado la solución", style: "Optimizador" },
        { text: "Haber logrado resultados concretos y medibles", style: "Implementador" }
      ]
    }
  ];

  const profileDescriptions = {
    "Generador": {
      title: "Generador (Concreto + Activo)",
      characteristics: [
        "Orientado a la acción y la experiencia directa",
        "Aprende haciendo y experimentando",
        "Busca oportunidades y nuevas experiencias",
        "Prefiere la variedad y el cambio"
      ],
      strengths: [
        "Excelente para iniciar proyectos",
        "Detecta oportunidades que otros no ven",
        "Actúa rápidamente ante los problemas",
        "Aporta energía y entusiasmo"
      ],
      tips: [
        "Canaliza tu energía hacia objetivos específicos",
        "Busca feedback constante para ajustar tu rumbo",
        "Colabora con tipos más reflexivos para equilibrar tu impulsividad",
        "Documenta tus experiencias para aprender de ellas"
      ]
    },
    "Conceptualizador": {
      title: "Conceptualizador (Abstracto + Activo)",
      characteristics: [
        "Piensa en términos de conceptos y teorías",
        "Busca el significado y las conexiones profundas",
        "Prefiere la experimentación mental",
        "Se enfoca en el panorama general"
      ],
      strengths: [
        "Excelente para generar ideas innovadoras",
        "Ve patrones y conexiones complejas",
        "Aporta perspectivas únicas y originales",
        "Inspira visiones a largo plazo"
      ],
      tips: [
        "Practica convertir tus ideas en prototipos tangibles",
        "Colabora con implementadores para dar vida a tus conceptos",
        "Establece plazos para tus reflexiones y análisis",
        "Comunica tus ideas de manera simple y clara"
      ]
    },
    "Optimizador": {
      title: "Optimizador (Abstracto + Reflexivo)",
      characteristics: [
        "Analiza y evalúa ideas de manera sistemática",
        "Busca la perfección y la eficiencia",
        "Prefiere enfoques probados y refinados",
        "Se enfoca en mejorar lo existente"
      ],
      strengths: [
        "Identifica debilidades y áreas de mejora",
        "Desarrolla soluciones robustas y confiables",
        "Aporta rigor y calidad a los proyectos",
        "Previene errores y problemas futuros"
      ],
      tips: [
        "Equilibra la perfección con la velocidad de entrega",
        "Abraza la experimentación y el prototipado rápido",
        "Colabora con generadores para explorar nuevas posibilidades",
        "Celebra el progreso, no solo la perfección"
      ]
    },
    "Implementador": {
      title: "Implementador (Concreto + Reflexivo)",
      characteristics: [
        "Enfocado en la aplicación práctica",
        "Prefiere planes estructurados y detallados",
        "Orientado a resultados medibles",
        "Valora la eficiencia y la productividad"
      ],
      strengths: [
        "Transforma ideas en realidad",
        "Gestiona proyectos de manera efectiva",
        "Entrega resultados consistentes",
        "Aporta disciplina y seguimiento"
      ],
      tips: [
        "Reserva tiempo para la exploración creativa",
        "Experimenta con enfoques menos estructurados",
        "Colabora con conceptualizadores para ampliar tu perspectiva",
        "Celebra el proceso, no solo los resultados finales"
      ]
    }
  };

  const countries = [
    "México", "Estados Unidos", "España", "Colombia", "Argentina", "Chile", "Perú", "Venezuela", "Ecuador", "Bolivia",
    "Uruguay", "Paraguay", "Brasil", "Canadá", "Reino Unido", "Francia", "Alemania", "Italia", "Portugal", "Holanda",
    "Otro"
  ];

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
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
    // const hasCaptcha = !!captchaToken;
    
    return hasAllFields && validEmail && validPhone; // && hasCaptcha;
  };

  const startAssessment = async () => {
    if (!isRegistrationComplete()) return;
    
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
      
      // Reset captcha after successful submission
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      setCaptchaToken(null);
      
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert(`Error al guardar datos: ${error.message}`);
      
      // Reset captcha on error too
      if (turnstileRef.current) {
        turnstileRef.current.reset();
      }
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = (questionIndex, optionIndex) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = async () => {
    setIsLoading(true);
    
    const scores = {
      "Generador": 0,
      "Conceptualizador": 0,
      "Optimizador": 0,
      "Implementador": 0
    };

    Object.entries(responses).forEach(([questionIndex, optionIndex]) => {
      const style = questions[questionIndex].options[optionIndex].style;
      scores[style]++;
    });

    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const porcentajes = {};
    
    Object.entries(scores).forEach(([style, score]) => {
      porcentajes[style] = (score / total) * 100;
    });

    const resultData = {
      usuario_id: userId,
      generador: scores["Generador"],
      conceptualizador: scores["Conceptualizador"],
      optimizador: scores["Optimizador"],
      implementador: scores["Implementador"],
      porcentaje_generador: porcentajes["Generador"],
      porcentaje_conceptualizador: porcentajes["Conceptualizador"],
      porcentaje_optimizador: porcentajes["Optimizador"],
      porcentaje_implementador: porcentajes["Implementador"]
    };

    try {
      const { data, error } = await supabase
        .from('resultados')
        .insert([resultData])
        .select();

      if (error) throw error;

      console.log('Resultados guardados exitosamente:', data[0]);
      
      setShowResults({
        scores,
        porcentajes,
        dominante: Object.keys(porcentajes).reduce((a, b) => 
          porcentajes[a] > porcentajes[b] ? a : b
        )
      });
      
      setCurrentStep('results');
    } catch (error) {
      console.error('Error al guardar resultados:', error);
      alert(`Error al guardar resultados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
      pdf.text('MI PERFIL INNOVADOR', pageWidth/2, 25, { align: 'center' });
      
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

  const resetAssessment = () => {
    setCurrentStep('intro');
    setCurrentQuestion(0);
    setResponses({});
    setUserData({});
    setUserId(null);
    setIsLoading(false);
    setShowResults(false);
    setCaptchaToken(null);
  };

  const renderIntroStep = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 p-8 sm:p-12 mb-8">
          <h1 className="text-4xl sm:text-6xl font-light text-white mb-6 tracking-tight">
            MI PERFIL INNOVADOR
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 font-light mb-8 leading-relaxed">
            Descubre tu estilo único de pensamiento creativo
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {['Generador', 'Conceptualizador', 'Optimizador', 'Implementador'].map((style, index) => (
              <div key={style} className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6">
                <div className="text-2xl sm:text-3xl mb-3">
                  {index === 0 && '⚡'}
                  {index === 1 && '💡'}
                  {index === 2 && '🔬'}
                  {index === 3 && '🎯'}
                </div>
                <h3 className="text-white font-medium text-lg mb-2">{style}</h3>
                <p className="text-white/60 text-sm font-light">
                  {index === 0 && 'Ideas rápidas y variadas'}
                  {index === 1 && 'Visión y conexiones'}
                  {index === 2 && 'Análisis y mejora'}
                  {index === 3 && 'Acción y resultados'}
                </p>
              </div>
            ))}
          </div>

          <div className="text-left backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 mb-8">
            <h2 className="text-2xl sm:text-3xl font-light text-white mb-6">¿Cómo funciona?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-4">📝</div>
                <h3 className="text-white font-medium mb-2">10 preguntas</h3>
                <p className="text-white/60 text-sm font-light">Responde sobre tu estilo de trabajo y pensamiento</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-4">🧮</div>
                <h3 className="text-white font-medium mb-2">Análisis instant áneo</h3>
                <p className="text-white/60 text-sm font-light">Obtienes tu perfil basado en CPS</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-4">📊</div>
                <h3 className="text-white font-medium mb-2">Reporte personalizado</h3>
                <p className="text-white/60 text-sm font-light">Con fortalezas y consejos específicos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-8">Comencemos con tus datos</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-white/60" />
                <label className="text-white/90 font-light">Nombre completo *</label>
              </div>
              <input
                type="text"
                value={userData.nombre || ''}
                onChange={(e) => handleUserDataChange('nombre', e.target.value)}
                className="w-full p-3 backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-white/60" />
                <label className="text-white/90 font-light">Email *</label>
              </div>
              <input
                type="email"
                value={userData.email || ''}
                onChange={(e) => handleUserDataChange('email', e.target.value)}
                className="w-full p-3 backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="tu@email.com"
              />
              {userData.email && !isValidEmail(userData.email) && (
                <p className="text-red-400 text-xs mt-2">Por favor, ingresa un email válido</p>
              )}
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-5 h-5 text-white/60" />
                <label className="text-white/90 font-light">Teléfono *</label>
              </div>
              <input
                type="tel"
                value={userData.telefono || ''}
                onChange={(e) => handleUserDataChange('telefono', e.target.value)}
                className="w-full p-3 backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="+52 55 1234 5678"
              />
              {userData.telefono && !isValidPhone(userData.telefono) && (
                <p className="text-red-400 text-xs mt-2">Por favor, ingresa un teléfono válido</p>
              )}
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-5 h-5 text-white/60" />
                <label className="text-white/90 font-light">Empresa *</label>
              </div>
              <input
                type="text"
                value={userData.empresa || ''}
                onChange={(e) => handleUserDataChange('empresa', e.target.value)}
                className="w-full p-3 backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="Nombre de tu empresa"
              />
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-5 h-5 text-white/60" />
                <label className="text-white/90 font-light">Cargo *</label>
              </div>
              <input
                type="text"
                value={userData.cargo || ''}
                onChange={(e) => handleUserDataChange('cargo', e.target.value)}
                className="w-full p-3 backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="Tu cargo o posición"
              />
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-white/60" />
                <label className="text-white/90 font-light">País *</label>
              </div>
              <select
                value={userData.pais || ''}
                onChange={(e) => handleUserDataChange('pais', e.target.value)}
                className="w-full p-3 backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-colors"
              >
                <option value="" className="bg-slate-800">Selecciona tu país</option>
                {countries.map(country => (
                  <option key={country} value={country} className="bg-slate-800">{country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={userData.newsletter || false}
                  onChange={(e) => handleUserDataChange('newsletter', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-white focus:ring-white/20"
                />
                <div className="flex-1">
                  <label htmlFor="newsletter" className="text-white/90 font-light cursor-pointer">
                    Sí, quiero suscribirme a <strong className="font-normal">#Cápsula</strong>
                  </label>
                  <p className="text-white/60 text-sm mt-1 font-light">
                    Nuestro newsletter quincenal con la mejor curaduría de temas alrededor de creatividad, innovación, diseño, negocios y futuros.
                  </p>
                </div>
              </div>
            </div>

            {/* Turnstile CAPTCHA - Temporalmente comentado */}
            {/* 
            <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4 sm:p-6 mt-6">
              <div className="flex justify-center">
                <Turnstile
                  ref={turnstileRef}
                  siteKey="0x4AAAAAABhA-P-saUwd8wpl"
                  onSuccess={(token) => {
                    setCaptchaToken(token);
                  }}
                  onExpire={() => {
                    setCaptchaToken(null);
                  }}
                  onError={() => {
                    setCaptchaToken(null);
                  }}
                />
              </div>
            </div>
            */}

            <div className="text-center mt-8 sm:mt-12">
              <button
                onClick={startAssessment}
                disabled={!isRegistrationComplete() || isLoading}
                className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 rounded-2xl text-white font-light text-base sm:text-lg tracking-wide disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-xl"
              >
                {isLoading ? 'Guardando...' : 'Comenzar evaluación'}
              </button>
              <p className="text-white/50 text-xs mt-4 font-light">
                * Campos obligatorios
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssessmentStep = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-light text-white">Evaluación CPS</h1>
            <span className="text-white/60 text-sm sm:text-base font-light">
              {currentQuestion + 1} de {questions.length}
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-2 mb-8 sm:mb-12">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-light text-white mb-8 leading-relaxed">
              {questions[currentQuestion].text}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleResponse(currentQuestion, index)}
                  className={`w-full p-4 sm:p-6 text-left backdrop-blur-sm border rounded-2xl transition-all duration-300 ${
                    responses[currentQuestion] === index
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      responses[currentQuestion] === index
                        ? 'border-white bg-white'
                        : 'border-white/40'
                    }`}>
                      {responses[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-slate-900 rounded-full m-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="font-light text-sm sm:text-base">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-xl text-white/80 font-light transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <button
              onClick={goToNextQuestion}
              disabled={responses[currentQuestion] === undefined || isLoading}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 rounded-xl text-white font-light transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Procesando...' : (currentQuestion === questions.length - 1 ? 'Finalizar' : 'Siguiente')}</span>
              {!isLoading && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultsStep = () => {
    const maxPercentage = Math.max(...Object.values(showResults.porcentajes));
    const dominantStyle = Object.keys(showResults.porcentajes).find(
      key => showResults.porcentajes[key] === maxPercentage
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <h1 className="text-2xl sm:text-3xl font-light text-white">Evaluación completada</h1>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light text-white mb-2">Tu perfil innovador</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
            <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {Object.entries(showResults.porcentajes).map(([style, percentage]) => (
                  <div key={style} className="text-center">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="rgba(255,255,255,0.8)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${percentage * 2.51} 251`}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-light text-sm sm:text-base">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <h3 className="text-white font-light text-sm sm:text-base">{style}</h3>
                  </div>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-light text-white mb-6">Perfil detallado</h3>
              <div className="space-y-4">
                {Object.entries(showResults.porcentajes)
                  .sort(([,a], [,b]) => b - a)
                  .map(([style, percentage]) => (
                    <div key={style} className="flex items-center justify-between">
                      <span className="text-white font-light text-sm sm:text-base flex items-center gap-2">
                        {style}
                        {style === dominantStyle && <span className="text-yellow-400">⭐</span>}
                      </span>
                      <span className="text-white/80 font-light text-sm sm:text-base">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {profileDescriptions[dominantStyle] && (
            <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 mb-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-light text-white mb-2">Estilo dominante</h3>
                <h4 className="text-3xl sm:text-4xl font-light text-white mb-4">{dominantStyle}</h4>
                <p className="text-white/60 text-sm sm:text-base font-light">
                  {showResults.porcentajes[dominantStyle]?.toFixed(1)}% de preferencia hacia este perfil innovador
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div>
                  <h4 className="text-xl sm:text-2xl font-light text-white mb-4 flex items-center gap-2">
                    {profileDescriptions[dominantStyle].title}
                    <div 
                      className="relative"
                      onMouseEnter={() => setHoveredTooltip('title')}
                      onMouseLeave={() => setHoveredTooltip(null)}
                    >
                      <Info className="w-4 h-4 text-white/40 cursor-help" />
                      {hoveredTooltip === 'title' && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap z-10">
                          Basado en el modelo CPS de pensamiento creativo
                        </div>
                      )}
                    </div>
                  </h4>
                  
                  <h5 className="text-lg font-light text-white mb-3">Características</h5>
                  <ul className="space-y-2 text-white/80 font-light text-sm sm:text-base">
                    {profileDescriptions[dominantStyle].characteristics.map((char, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-white/40 mt-1">•</span>
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-lg font-light text-white mb-3">Fortalezas</h5>
                  <ul className="space-y-2 text-white/80 font-light text-sm sm:text-base">
                    {profileDescriptions[dominantStyle].strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-white/40 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-lg font-light text-white mb-3">Consejos</h5>
                  <ul className="space-y-2 text-white/80 font-light text-sm sm:text-base">
                    {profileDescriptions[dominantStyle].tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-white/40 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={downloadResults}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/40 rounded-2xl text-white font-light transition-all duration-300 shadow-xl"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Descargar PDF
            </button>
            
            <button
              onClick={resetAssessment}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-2xl text-white/80 font-light transition-all duration-300"
            >
              Nueva evaluación
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (currentStep === 'intro') {
    return renderIntroStep();
  } else if (currentStep === 'assessment') {
    return renderAssessmentStep();
  } else if (currentStep === 'results') {
    return renderResultsStep();
  }

  return null;
};

export default CPSAssessment;
