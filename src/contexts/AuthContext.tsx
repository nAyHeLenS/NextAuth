import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";
import Router from "next/router";
import { setCookie, parseCookies } from 'nookies' 

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

type SignInCredential = {
    email: string;
    password: string;
}

type AuthContextData = {
    signIn(credentials: SignInCredential): Promise<void>;
    user: User;
    isAuthenticated: boolean;
}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user

    // qnd acessar pela primeira vez
    useEffect(() => {
        const { 'nexttauth.token': token } = parseCookies()

        if(token){
            api.get('/me').then(response => {
                const { email, permissions, roles } = response.data

                setUser({ email, permissions, roles })
            })
        }

    }, )

    async function signIn({email, password}: SignInCredential){
        try {
            const response = await api.post('/sessions', {
                email,
                password
            })

            const {token, refreshToken, permissions, roles} = response.data

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30,//30 dias(1 mês) | por qunto tempo ficara salvo
                path: '/',// qualquer caminho da aplicação terá acesso a esse cookie
            })
            setCookie(undefined, 'nextauth.refreshtoken', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            })
            
            // salvando usuário
            setUser({
                email,
                permissions,
                roles
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            // redrecionamento
            Router.push('/dashboard')
            
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    )
}

// email e senha validos - diego@rocketseat.team | 123456
