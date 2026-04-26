# Sentinel

**Infraestructura de detección de riesgo digital para menores en México.**

Sentinel es un conjunto de herramientas B2B que permite a cualquier plataforma de mensajería, gaming o redes sociales detectar grooming y reclutamiento criminal dirigido a menores — en tiempo real, dentro del flujo normal de conversaciones.

El desarrollador integra el SDK con una llamada. El sistema hace el resto.

---

## El problema

México enfrenta una crisis de seguridad digital infantil. Los depredadores y organizaciones criminales reclutan menores a través de plataformas digitales usando jerga coloquial que los filtros genéricos no detectan. La moderación reactiva llega tarde — el daño ya ocurrió.

Sentinel detecta el patrón antes de que escale.

---

## Arquitectura

```
Plataforma del cliente
        │
        ▼
┌───────────────────────┐
│   Sentinel SDK        │  Motor local de 3 capas — analiza en milisegundos
│   (TypeScript)        │  sin enviar datos a ningún servidor externo
└──────────┬────────────┘
           │ solo zona gris (~10% de mensajes)
           ▼
┌───────────────────────┐
│   Sentinel API        │  Análisis contextual profundo con LLaMA 3.3 70B
│   (Python + FastAPI)  │  via Groq — desplegada en Railway
└───────────────────────┘
```

El motor local resuelve el 90% de los casos de forma instantánea. La IA solo interviene cuando hay sospecha real.

---

## Repositorios

| Componente | Descripción | Documentación |
|---|---|---|
| [`sentinel-sdk/`](./sentinel-sdk/) | SDK TypeScript — motor de detección local | [README](./sentinel-sdk/README.md) |
| [`sentinel-api/`](./sentinel-api/) | API Python — análisis con IA y persistencia | [README](./sentinel-api/README.md) |
| [`sentinel-docs/`](./sentinel-docs/) | Sitio de documentación | — |

---

## Equipo

- Samuel Tlahuel
- Luis Mérida
- David Peña
- Said Ferreira

---

## Licencia

MIT — Hackathon 404 · Marriott Reforma CDMX · Abril 2026
