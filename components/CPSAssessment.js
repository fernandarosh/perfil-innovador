'use client';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, CheckCircle2, User, Mail, Building, Briefcase, Globe, Phone } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ywtdjwkxgvtntaickksbk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dGRqd2t4Z3Z0bnRhaWNrc2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjIyNjYsImV4cCI6MjA2NTQzODI2Nn0.OlBckntHtKRGgVAaSpmUtrpxUm3wCMefqftXJd0j-kY';

const supabase = createClient(supabaseUrl, supabaseKey);

const CPSAssessment = () => {
  const [currentStep, setCurrentStep] = useState('register');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

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
    }
  ];

  const startAssessment = () => {
    setCurrentStep('assessment');
  };

  if (currentStep === 'register') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-thin mb-8">Perfil Innovador</h1>
          <button 
            onClick={startAssessment}
            className="px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all"
          >
            Comenzar Evaluación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-thin mb-8">Evaluación en desarrollo</h1>
        <p className="text-white/70">La aplicación funcionará completamente una vez desplegada</p>
      </div>
    </div>
  );
};

export default CPSAssessment;
