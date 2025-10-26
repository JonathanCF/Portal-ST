import { useEffect, useState } from 'react';

export enum Permission {
  EMPRESA_LISTA = 'EMPRESA_LISTA',
  EMPRESA_CADASTRO = 'EMPRESA_CADASTRO',
  EMPRESA_EDICAO = 'EMPRESA_EDICAO',
  EMPRESA_APROVACAO = 'EMPRESA_APROVACAO',
  EMPRESA_MASTER = 'EMPRESA_MASTER',
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setPermissions(user.permissoes || []);
      } catch (error) {
        console.error('Erro ao carregar permissões:', error);
        setPermissions([]);
      }
    }
  }, []);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (...requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (...requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}