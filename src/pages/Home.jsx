import React from 'react';
import { useMsal } from '@azure/msal-react';

const ROLE_DETAILS = {
  Admin: {
    label: 'Administrador',
    badgeClass: 'bg-danger',
    icon: 'bi-shield-lock-fill',
    description:
      'Posee control total sobre la plataforma BarrioDigital. Puede configurar y recargar cupos diarios en el Catálogo de Trámites, gestionar todo el ciclo de vida de las solicitudes ciudadanas, supervisar cuadrillas en terreno, consultar notificaciones, auditar eventos y visualizar los reportes e indicadores comunales.'
  },
  Funcionario: {
    label: 'Funcionario',
    badgeClass: 'bg-primary',
    icon: 'bi-person-badge-fill',
    description:
      'Encargado de la atención y gestión administrativa municipal. Puede consultar el catálogo de trámites vigentes, ingresar solicitudes en representación de vecinos, admitir requerimientos, derivar órdenes a cuadrillas en terreno, resolver trámites y revisar notificaciones y reportes.'
  },
  Vecino: {
    label: 'Vecino',
    badgeClass: 'bg-success',
    icon: 'bi-house-heart-fill',
    description:
      'Usuario ciudadano de la plataforma. Puede ingresar nuevas solicitudes de trámites municipales según disponibilidad de cupos diarios, hacer seguimiento al estado de sus requerimientos y consultar su bandeja de notificaciones para descargar certificados de trámites resueltos.'
  },
  Cuadrilla: {
    label: 'Cuadrilla',
    badgeClass: 'bg-warning text-dark',
    icon: 'bi-tools',
    description:
      'Equipo operativo de despliegue en terreno. Su función es visualizar las órdenes de trabajo asignadas en estado EN_TERRENO, ejecutar las labores en la vía pública o domicilio y registrar la resolución del requerimiento una vez finalizado.'
  },
  Auditor: {
    label: 'Auditor',
    badgeClass: 'bg-info text-dark',
    icon: 'bi-journal-check',
    description:
      'Encargado de la fiscalización, control interno y trazabilidad. Supervisa el historial cronológico e inmutable de eventos y transiciones de estado de cada solicitud registrada en el módulo de Auditoría, además de revisar los indicadores operativos.'
  }
};

export const Home = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const userRoles = activeAccount?.idTokenClaims?.roles || [];

  // Filtrar roles reconocidos en el sistema manteniendo orden de prioridad
  const rolePriority = ['Admin', 'Funcionario', 'Auditor', 'Cuadrilla', 'Vecino'];
  const matchedRoles = rolePriority.filter((role) => userRoles.includes(role));

  const primaryRoleKey = matchedRoles[0];
  const primaryRole = primaryRoleKey ? ROLE_DETAILS[primaryRoleKey] : null;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5 text-center">
              <div className="mb-3">
                <i
                  className={`bi ${primaryRole ? primaryRole.icon : 'bi-person-circle'} text-primary`}
                  style={{ fontSize: '3.2rem' }}
                ></i>
              </div>

              <h1 className="fw-bold text-primary mb-2">
                Bienvenido {primaryRole ? primaryRole.label : 'Usuario'}
              </h1>

              {activeAccount?.name && (
                <p className="text-muted mb-3">
                  Sesión iniciada como <strong>{activeAccount.name}</strong>
                </p>
              )}

              <hr className="my-4" />

              {matchedRoles.length > 0 ? (
                <div className="text-start">
                  {matchedRoles.map((roleKey) => {
                    const info = ROLE_DETAILS[roleKey];
                    return (
                      <div key={roleKey} className="p-3 mb-3 bg-light rounded border">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className={`badge ${info.badgeClass}`}>{info.label}</span>
                          <span className="fw-semibold text-dark">Funciones en el sistema</span>
                        </div>
                        <p className="mb-0 text-secondary" style={{ lineHeight: '1.6' }}>
                          {info.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-secondary fs-5 mb-0">
                  Tu cuenta ha sido autenticada correctamente en BarrioDigital, pero aún no tiene un rol asignado en Microsoft Entra ID. Contacta al administrador municipal.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};