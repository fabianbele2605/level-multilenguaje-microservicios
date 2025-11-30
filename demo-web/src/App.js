import React, { useState, useEffect, useRef } from 'react';
import { Server, Shield, Activity, Cpu, Database, Terminal, Play, Zap, Globe, Code } from 'lucide-react';

const SystemArchitecture = () => {
  const [activeService, setActiveService] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [packetPosition, setPacketPosition] = useState({ x: 0, y: 0, visible: false });

  // Definición de Nodos (Servicios) y sus posiciones
  const services = {
    client: { id: 'client', x: 50, y: 250, label: 'Cliente', icon: Globe, color: 'text-gray-300', bg: 'bg-gray-800' },
    java: {
      id: 'java', x: 200, y: 250, label: 'API Gateway', lang: 'Java Spring Boot', port: '8081', role: 'Enrutamiento',
      icon: Server, color: 'text-red-400', bg: 'bg-red-900/20', borderColor: 'border-red-500'
    },
    go: {
      id: 'go', x: 400, y: 250, label: 'Orquestador', lang: 'Go + Gorilla Mux', port: '8082', role: 'Coordinación',
      icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-900/20', borderColor: 'border-cyan-500'
    },
    rust: {
      id: 'rust', x: 400, y: 100, label: 'Validador', lang: 'Rust + Actix', port: '8084', role: 'Seguridad',
      icon: Shield, color: 'text-orange-400', bg: 'bg-orange-900/20', borderColor: 'border-orange-500'
    },
    python: {
      id: 'python', x: 600, y: 250, label: 'Analizador', lang: 'Python FastAPI', port: '8083', role: 'Data Processing',
      icon: Database, color: 'text-yellow-400', bg: 'bg-yellow-900/20', borderColor: 'border-yellow-500'
    },
    cpp: {
      id: 'cpp', x: 800, y: 250, label: 'Motor', lang: 'C++ httplib', port: '8085', role: 'High Performance',
      icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-900/20', borderColor: 'border-blue-500'
    },
  };

  const logEndRef = useRef(null);

  // Auto-scroll de logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (text, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time: timestamp, text, type }]);
  };

  const animatePacket = async (path) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setLogs([]); // Limpiar logs anteriores

    // Configuración inicial
    addLog(`[SYSTEM] Iniciando flujo: ${path.name}`, 'system');

    for (let i = 0; i < path.steps.length; i++) {
      const step = path.steps[i];
      const fromNode = services[step.from];
      const toNode = services[step.to];

      // Resaltar servicio activo
      setActiveService(step.from);

      // Registrar acción del paso
      if (step.log) {
        addLog(step.log, 'cmd');
      }

      // Simular delay de red
      await new Promise(r => setTimeout(r, 600));

      // Mover paquete
      setPacketPosition({ x: fromNode.x, y: fromNode.y, visible: true });

      // Animar transición (interpolación lineal simple para demo)
      const frames = 20;
      for (let f = 1; f <= frames; f++) {
        setPacketPosition({
          x: fromNode.x + (toNode.x - fromNode.x) * (f / frames),
          y: fromNode.y + (toNode.y - fromNode.y) * (f / frames),
          visible: true
        });
        await new Promise(r => setTimeout(r, 20));
      }

      // Lógica de respuesta/delay en nodo
      if (step.response) {
        setActiveService(step.to);
        await new Promise(r => setTimeout(r, 400));
        addLog(step.response, 'response');
      }
    }

    setPacketPosition({ ...packetPosition, visible: false });
    setActiveService(null);
    setIsAnimating(false);
    addLog("[SUCCESS] Flujo completado exitosamente", 'success');
  };

  const flows = {
    basic: {
      name: "Análisis Básico (Java → Go → Rust → Python)",
      steps: [
        { from: 'client', to: 'java', log: 'POST /api/go/analyze' },
        { from: 'java', to: 'go', log: 'Routing to Orchestrator (Go)' },
        { from: 'go', to: 'rust', log: 'Validating Request...' },
        { from: 'rust', to: 'go', response: 'Validation OK' },
        { from: 'go', to: 'python', log: 'Sending to Analyzer...' },
        { from: 'python', to: 'go', response: '{"analysis": {"count": 5, "avg": 3.0}}' },
        { from: 'go', to: 'java', log: 'Aggregating results' },
        { from: 'java', to: 'client', response: 'HTTP 200 OK' }
      ]
    },
    heavy: {
      name: "Cálculo Pesado (Python → C++)",
      steps: [
        { from: 'client', to: 'python', log: 'POST /heavy-analyze' }, // Entrada simplificada para demo
        { from: 'python', to: 'cpp', log: 'Offloading to C++ Engine...' },
        { from: 'cpp', to: 'python', response: '{"fibonacci": [0,1,1,2,3,5,8], "std_dev": 1.63}' },
        { from: 'python', to: 'client', response: 'HTTP 200 OK (Data Processed)' }
      ]
    },
    error: {
      name: "Validación de Errores (Rust Rejection)",
      steps: [
        { from: 'client', to: 'java', log: 'POST /api/go/analyze (Empty Array)' },
        { from: 'java', to: 'go', log: 'Routing to Orchestrator' },
        { from: 'go', to: 'rust', log: 'Validating Input...' },
        { from: 'rust', to: 'go', response: '[ERROR] Invalid Input (Empty Array)' },
        { from: 'go', to: 'java', log: 'Returning 400 Bad Request' },
        { from: 'java', to: 'client', response: 'HTTP 400 Bad Request' }
      ]
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-mono overflow-hidden">

      {/* Encabezado */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center shadow-lg z-10">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Code size={24} className="text-blue-400" /> Sistema Multilenguaje Distribuido
          </h1>
          <div className="flex gap-2 text-xs mt-1 text-slate-400">
            <span className="px-2 py-0.5 bg-red-900/30 rounded border border-red-800">Java</span>
            <span className="px-2 py-0.5 bg-cyan-900/30 rounded border border-cyan-800">Go</span>
            <span className="px-2 py-0.5 bg-orange-900/30 rounded border border-orange-800">Rust</span>
            <span className="px-2 py-0.5 bg-yellow-900/30 rounded border border-yellow-800">Python</span>
            <span className="px-2 py-0.5 bg-blue-900/30 rounded border border-blue-800">C++</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => animatePacket(flows.basic)}
            disabled={isAnimating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isAnimating ? 'opacity-50 cursor-not-allowed bg-slate-700' : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
          >
            <Play size={16} /> Análisis Básico
          </button>
          <button
            onClick={() => animatePacket(flows.heavy)}
            disabled={isAnimating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isAnimating ? 'opacity-50 cursor-not-allowed bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'}`}
          >
            <Zap size={16} /> Cálculo C++
          </button>
          <button
            onClick={() => animatePacket(flows.error)}
            disabled={isAnimating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${isAnimating ? 'opacity-50 cursor-not-allowed bg-slate-700' : 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.3)]'}`}
          >
            <Shield size={16} /> Test Error
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* Área principal del canvas */}
        <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
          {/* Fondo de cuadrícula */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>

          {/* Capa de conexiones SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: 'rgb(147, 51, 234)', stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>

            {/* Conexiones */}
            {/* Cliente -> Java */}
            <line x1={services.client.x + 40} y1={services.client.y} x2={services.java.x - 40} y2={services.java.y} stroke="#334155" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Java -> Go */}
            <line x1={services.java.x + 40} y1={services.java.y} x2={services.go.x - 40} y2={services.go.y} stroke="#334155" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Go -> Rust (Curva) */}
            <path d={`M ${services.go.x} ${services.go.y - 40} Q ${services.go.x} ${services.rust.y + 40} ${services.rust.x} ${services.rust.y + 40}`} fill="none" stroke="#334155" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Go -> Python */}
            <line x1={services.go.x + 40} y1={services.go.y} x2={services.python.x - 40} y2={services.python.y} stroke="#334155" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Python -> C++ */}
            <line x1={services.python.x + 40} y1={services.python.y} x2={services.cpp.x - 40} y2={services.cpp.y} stroke="#334155" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </svg>

          {/* Renderizar nodos */}
          {Object.values(services).map((svc) => {
            const isActive = activeService === svc.id;
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer
                            ${isActive ? 'scale-110 z-20' : 'scale-100 z-10'}
                        `}
                style={{ left: svc.x, top: svc.y }}
                onMouseEnter={() => setActiveService(svc.id)}
                onMouseLeave={() => !isAnimating && setActiveService(null)}
              >
                {/* Punto de estado */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border border-slate-900"></div>

                {/* Tarjeta del nodo */}
                <div className={`
                            flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 backdrop-blur-md shadow-2xl transition-colors
                            ${svc.bg} ${isActive ? svc.borderColor : 'border-slate-700'}
                        `}>
                  <Icon size={32} className={`${svc.color} mb-2`} />
                  <span className="text-xs font-bold text-slate-200">{svc.label}</span>
                </div>

                {/* Tooltip de detalles (siempre visible si está activo) */}
                <div className={`
                            absolute top-28 left-1/2 -translate-x-1/2 w-48 bg-slate-800/90 border border-slate-600 rounded p-3 text-xs shadow-xl
                            transition-all duration-300 pointer-events-none
                            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
                        `}>
                  {svc.lang && <div className="text-slate-300 mb-1"><span className="text-slate-500">Tech:</span> {svc.lang}</div>}
                  {svc.port && <div className="text-slate-300 mb-1"><span className="text-slate-500">Port:</span> <span className="font-mono text-green-400">{svc.port}</span></div>}
                  {svc.role && <div className="text-slate-300"><span className="text-slate-500">Rol:</span> {svc.role}</div>}
                </div>
              </div>
            );
          })}

          {/* Paquete en movimiento */}
          {packetPosition.visible && (
            <div
              className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] z-50 transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: packetPosition.x, top: packetPosition.y }}
            >
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>
          )}
        </div>

        {/* Barra lateral / Consola */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
          <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-slate-950">
            <Terminal size={14} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-300">System Logs</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-3 custom-scrollbar">
            {logs.length === 0 && (
              <div className="text-slate-600 text-center italic mt-10">Esperando requests...</div>
            )}
            {logs.map((log, i) => (
              <div key={i} className={`animate-in fade-in slide-in-from-left-2 duration-300
                        ${log.type === 'cmd' ? 'text-blue-400' : ''}
                        ${log.type === 'response' ? 'text-green-400' : ''}
                        ${log.type === 'system' ? 'text-yellow-500 border-b border-slate-800 pb-2 mb-2' : ''}
                        ${log.type === 'success' ? 'text-emerald-400 font-bold border-t border-slate-800 pt-2 mt-2' : ''}
                        ${log.type === 'info' ? 'text-slate-300' : ''}
                    `}>
                <span className="opacity-30 mr-2">[{log.time}]</span>
                {log.type === 'cmd' && <span className="mr-1">$</span>}
                {log.type === 'response' && <span className="mr-1">➜</span>}
                <span>{log.text}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500">
            <div className="flex justify-between mb-1">
              <span>Docker Compose Status:</span>
              <span className="text-green-500">Running</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded overflow-hidden">
              <div className="bg-green-500 w-full h-full opacity-50 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda / Pie de página */}
      <div className="bg-slate-950 border-t border-slate-800 p-2 text-center text-xs text-slate-500 flex justify-center gap-8">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div>Gateway (Java)</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-500"></div>Orch (Go)</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div>Valid (Rust)</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div>Analiz (Py)</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Calc (C++)</div>
      </div>
    </div>
  );
};

export default SystemArchitecture;