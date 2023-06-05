"use client";

import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithRedirect,
} from "firebase/auth";
import { auth } from "../../libs/firebase";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function Login() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/");
			} else {
				setLoading(false);
			}
		});
	}, [router]);

	return loading ? (
		<Loading />
	) : (
		<>
			<main className=" h-screen w-screen flex flex-col items-center justify-evenly bg-[var(--secondary)]">
				{/* Title */}
				<div className="flex flex-col items-center justify-center">
					<h1 className="text-2xl font-semibold">
						Logg inn på din bruker
					</h1>
					<p className="font-extralight">
						Er du klar for å sette seil?
					</p>
				</div>
				{/* Input */}
				<div className="w-3/4 lg:w-1/3 flex flex-col gap-4">
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
						<FontAwesomeIcon icon={faEnvelope} size="lg" />
						<input
							className="bg-transparent w-full focus:outline-none"
							maxLength={50}
							placeholder="Email"
							disabled={loading}
							onChange={(e) => setEmail(e.target.value)}
						></input>
					</div>
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
						<FontAwesomeIcon icon={faLock} size="lg" />
						<input
							className="bg-transparent w-full focus:outline-none"
							maxLength={32}
							placeholder="Passord"
							disabled={loading}
							type="password"
							onChange={(e) => setPassword(e.target.value)}
						></input>
					</div>
					<p
						className="w-full text-center text-[#505050]"
						onClick={() => {
							if (email.length === 0) {
								return toast.error(
									"Fyll ut email feltet for å sende en passord reset mail.",
									{ duration: 8000 }
								);
							}
							sendPasswordResetEmail(auth, email)
								.then(() => {
									toast.success(
										`En passord reset mail har blitt sendt til ${email}`,
										{ duration: 8000 }
									);
								})
								.catch((error) => {
									let message = error.message;
									message = message.split(":")[1];
									toast.error(message);
									setLoading(false);
								});
						}}
					>
						Glemt passord?
					</p>
				</div>

				{/* Buttons */}
				<div className="flex flex-col gap-3 w-3/4 lg:w-1/3">
					<button
						className="bg-[var(--primary-button)] h-16 text-lg w-full flex items-center justify-center rounded"
						disabled={loading}
						onClick={() => {
							setLoading(true);
							signInWithEmailAndPassword(auth, email, password)
								.then(() => {})
								.catch((error) => {
									let message = error.message;
									message = message.split(":")[1];
									toast.error(message);
									setLoading(false);
								});
						}}
					>
						Logg inn
					</button>
				</div>
			</main>
		</>
	);
}
