'use client'
import { useState, useEffect, useCallback } from 'react';
import { COLORS, str } from './utils';

const STORAGE_KEY = 'ici-ramos-activos';

export function useData() {
  const [evals,        setEvals]        = useState([]);
  const [ramos,        setRamos]        = useState([]);
  const [docs,         setDocs]         = useState([]);
  const [docentes,     setDocentes]     = useState([]);
  const [ramosActivos, setRamosActivos] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [synced,       setSynced]       = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch('/api/datos');
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      const ramoList = (json.ramos || [])
        .map(r => str(r))
        .filter(r => r.length > 0)
        .map((name, i) => ({ name, color: COLORS[i % COLORS.length] }));

      const ramoNames = new Set(ramoList.map(r => r.name));

      const evalList = (json.evals || []).map(e => ({
        ramo:  str(e.ramo),
        tipo:  str(e.tipo),
        fecha: e.fecha ? new Date(e.fecha + 'T12:00:00') : null,
        cont:  str(e.contenidos),
        peso:  str(e.peso),
      })).filter(e => e.ramo && e.fecha && !isNaN(e.fecha));

      evalList.forEach(e => {
        if (e.ramo && !ramoNames.has(e.ramo)) {
          ramoList.push({ name: e.ramo, color: COLORS[ramoList.length % COLORS.length] });
          ramoNames.add(e.ramo);
        }
      });

      const docList = (json.docs || []).map(d => ({
        ramo:   str(d.ramo),
        tipo:   str(d.tipo),
        titulo: str(d.titulo),
        link:   str(d.link),
        autor:  str(d.autor),
      })).filter(d => d.ramo && d.link);

      // Docentes — feature nueva (marketplace H9), datos reales desde la
      // pestaña "Docentes" de la Sheet. Sin rating/reseñas/agenda: eso
      // sigue sin existir, así que no se inventa acá.
      const docenteList = (json.docentes || []).map(d => ({
        nombre:     str(d.nombre),
        ramos:      Array.isArray(d.ramos) ? d.ramos.map(str).filter(Boolean) : [],
        credencial: str(d.credencial),
        tarifaHora: Number(d.tarifaHora) || 0,
        verificado: !!d.verificado,
        bio:        str(d.bio),
        contacto:   str(d.contacto),
        fono:       str(d.fono),
      })).filter(d => d.nombre && d.ramos.length > 0);

      setRamos(ramoList);
      setEvals(evalList);
      setDocs(docList);
      setDocentes(docenteList);
      setSynced(new Date());

      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const validos = parsed.filter(r => ramoNames.has(r));
          setRamosActivos(validos.length > 0 ? validos : []);
        } else {
          setRamosActivos([]);
        }
      } catch(e) {
        setRamosActivos([]);
      }

    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleRamo = useCallback((nombre) => {
    setRamosActivos(prev => {
      const todos  = ramos.map(r => r.name);
      const actual = prev || todos;
      let nuevo;
      if (actual.includes(nombre)) {
        nuevo = actual.filter(r => r !== nombre);
        if (nuevo.length === 0) nuevo = [];
      } else {
        nuevo = [...actual, nombre];
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevo)); } catch(e) {}
      return nuevo;
    });
  }, [ramos]);

  const seleccionarTodos = useCallback(() => {
    setRamosActivos(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
  }, []);

  const rColor = (name) => {
    const r = ramos.find(r => r.name === name);
    return r ? r.color : '#888';
  };

  const sinFiltro = ramosActivos === null;

  const evalsActivas = sinFiltro
    ? evals
    : evals.filter(e => ramosActivos.includes(e.ramo));

  const docsActivos = sinFiltro
    ? docs
    : docs.filter(d => ramosActivos.includes(d.ramo));

  const ramosActivosList = sinFiltro
    ? ramos
    : ramos.filter(r => ramosActivos.includes(r.name));

  return {
    evals: evalsActivas,
    evalsAll: evals,
    docs: docsActivos,
    docsAll: docs,
    docentes,
    ramos: ramosActivosList,
    ramosAll: ramos,
    ramosActivos,
    toggleRamo,
    seleccionarTodos,
    loading,
    error,
    synced,
    reload: load,
    rColor,
  };
}