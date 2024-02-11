import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from "react-toastify";

const toastTokenExpired = () => {
  toast.error("Your session has expired. Please log in again.");
};

const isTokenExpired = (token) => {
    try {
            const decoded = jwtDecode(token);
            const now = Date.now().valueOf() / 1000;
            if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            console.log(`Token expirou em ${new Date(decoded.exp * 1000)}`);
            toastTokenExpired();
            return true;
        }
        return false;
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        toastTokenExpired();
        return true;
    }
};

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token || isTokenExpired(token)) {
            localStorage.clear();
            navigate('/login');
        }
    }, [navigate]);
};

export default useAuth;
