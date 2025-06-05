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
}