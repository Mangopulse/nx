import useAuth from "@/hooks/useAuth";
import auth from "@/lib/Auth";
import { ReactNode } from "react";

interface props {
    children: ReactNode;
}

export default function AuthLayout({ children }: props) {
    useAuth();
    return children;
}
