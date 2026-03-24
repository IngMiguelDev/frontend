# Documentacion del proyecto CRM Angular 17

## Resumen

Aplicacion CRM frontend construida con Angular 17 usando:

- standalone components
- Angular CDK DragDrop
- RxJS
- signals
- mocks con persistencia en `localStorage`

Permite gestionar oportunidades en tablero Kanban, ver detalle, registrar notas y mover oportunidades entre estados.

## Arquitectura

Se organizo el proyecto con una estructura limpia y escalable dentro de `src/app`:

```text
app/
├── core/
│   ├── guards/
│   ├── models/
│   └── services/
├── features/
│   └── opportunities/
│       ├── components/
│       ├── mocks/
│       ├── pages/
│       └── services/
├── layout/
├── shared/
│   ├── components/
│   ├── pipes/
│   └── utils/
├── app.component.ts
├── app.config.ts
└── app.routes.ts
```

### Capas

- `core/`: modelos, servicios base y guards.
- `shared/`: componentes, pipes y utilidades reutilizables.
- `features/opportunities/`: dominio principal del CRM.
- `layout/`: shell global con sidebar, topbar y contenedor principal.

## Archivos clave

- [app.routes.ts](/home/jose/proyecto_prueba_growtek/frontend/src/app/app.routes.ts)
- [crm-shell.component.ts](/home/jose/proyecto_prueba_growtek/frontend/src/app/layout/crm-shell.component.ts)
- [opportunity.model.ts](/home/jose/proyecto_prueba_growtek/frontend/src/app/core/models/opportunity.model.ts)
- [opportunities.service.ts](/home/jose/proyecto_prueba_growtek/frontend/src/app/features/opportunities/services/opportunities.service.ts)
- [opportunities-board-page.component.ts](/home/jose/proyecto_prueba_growtek/frontend/src/app/features/opportunities/pages/opportunities-board-page.component.ts)
- [opportunity-detail-page.component.ts](/home/jose/proyecto_prueba_growtek/frontend/src/app/features/opportunities/pages/opportunity-detail-page.component.ts)

## Rutas

- `/` → tablero Kanban
- `/opportunity/:id` → detalle de oportunidad

## Datos y estado

- Los mocks viven en `features/opportunities/mocks/`.
- La logica CRUD vive en `opportunities.service.ts`.
- `RxJS` se usa para simular operaciones asincronas.
- `signals` se usan para estado local de UI como filtros, drawer, seleccion y sidebar.

## HTML y CSS inline

Se uso `template` y `styles` inline en varios componentes standalone porque:

- mejora la cohesion en componentes pequenos
- acelera la construccion de una primera version funcional
- encaja bien con componentes autocontenidos

Esto no afecta la arquitectura. La escalabilidad depende mas de la separacion por capas, el tipado y la logica en servicios.

## Cuando separar `.html` y `.scss`

Conviene separarlos cuando:

- el template crece mucho
- los estilos son extensos
- el componente tendra mucha evolucion
- varias personas trabajan sobre la misma vista

Para este proyecto, `pages/` y `layout/` podrian migrarse a archivos separados en una siguiente iteracion.

## Principios aplicados

- standalone sin modulos
- componentes con responsabilidad clara
- logica fuera de la UI
- tipado fuerte
- facilidad para cambiar mocks por API real

## Documentacion relacionada

- [componentes-standalone.md](/home/jose/proyecto_prueba_growtek/frontend/docs/componentes-standalone.md)
- [sidebar-toggle.md](/home/jose/proyecto_prueba_growtek/frontend/docs/sidebar-toggle.md)
