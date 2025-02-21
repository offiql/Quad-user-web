export interface User {
  _id: string;
  name: string;
  email: string;
  namespace: string;
  isConfirmed: boolean;
  createdAt: string;
  roles: string[];
  permissions: string[];
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permission: {
    _id: string;
    name: string;
    code: string;
  }[];
}

export interface Permission {
  _id: string;
  name: string;
  description: string;
}
