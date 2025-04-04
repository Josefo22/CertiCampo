import PropTypes from "prop-types";
import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, verifyToken } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe estar dentro del proveedor AuthContext");
    }
    return context
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const login = async (user) => {
        try {
            setErrors(null);
            console.log("Datos enviados al backend:", user);
            const res = await loginRequest(user);
            console.log("Respuesta del backend:", res.data);
            setUser(res.data);
            return res.data;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            if (error.response) {
                // Error de la API
                setErrors(error.response.data.message || "Error al iniciar sesión");
            } else if (error.request) {
                // Error de red (no hubo respuesta)
                setErrors("No se pudo conectar al servidor. Verifica tu conexión.");
            } else {
                // Otro tipo de error
                setErrors("Error al procesar la solicitud de inicio de sesión");
            }
            return null;
        }
    };

    useEffect(() => {
        async function checkLogin(){
            const cookies = Cookies.get();
            if (cookies.token){
                try {
                    const res = await verifyToken(cookies.token);
                    setUser(res.data);
                    console.log("Usuario Autenticado:", res.data);
                } catch (error) {
                    console.error("Error al verificar token:", error.response ? error.response.data : error.message);
                    setUser(null);
                }
            }
            setLoading(false);
        }
        checkLogin();
    }, []);
    
    return (
        <AuthContext.Provider value={{ login, user, errors, loading }}>
            {children}
        </AuthContext.Provider>
    )
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
