import React from 'react';

const AuthService = { 
    keycloak: null,
    authenticated: false,
    username: null,
    userid: null,
    email: null,
}

export default AuthService;

export const AuthContext = React.createContext(
    {
        kc: null,
        teste: 'Teste inicial',
    }
);