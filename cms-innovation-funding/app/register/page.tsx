'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();

    //   state form
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [occupation, setOccupation] = useState("");
    const [role, setRole] = useState("user");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // state UI
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        // Validasi Password
        if (password !== confirmPassword) {
            setError("Password dan konfirmasi password tidak sama");
            return;
        }

        // request ke API
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, occupation, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registrasi gagal");
            } else {
                setSuccessMsg("Registrasi berhasil, silakan login");

                // Redirect Setelah Sukses 
                setTimeout(() => router.push("/login"), 2000);
            }
        } catch {
            setError("Terjadi kesalahan jaringan");
        } finally {
            setLoading(false);
        }

    }
}