"use client";

import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	createUserWithEmailAndPassword,
	signInWithRedirect,
	updateProfile,
	GoogleAuthProvider,
	onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../../libs/firebase";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { ref, set } from "firebase/database";

export default function Signup() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fname, setFname] = useState("");
	const [lname, setLname] = useState("");
	const [loading, setLoading] = useState(false);

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
					<h1 className="text-2xl font-semibold">Lag en bruker</h1>
					<p className="font-extralight">Klar for å sette seil?</p>
				</div>
				{/* Input */}
				<div className="w-3/4 lg:w-1/3 flex flex-col gap-4">
					<div className="flex gap-2">
						<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
							<FontAwesomeIcon icon={faUser} size="lg" />
							<input
								className="bg-transparent w-full focus:outline-none"
								maxLength={16}
								placeholder="Fornavn"
								disabled={loading}
								onChange={(e) => setFname(e.target.value)}
							></input>
						</div>
						<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
							<FontAwesomeIcon icon={faUser} size="lg" />
							<input
								className="bg-transparent w-full focus:outline-none"
								maxLength={16}
								placeholder="Etternavn"
								disabled={loading}
								onChange={(e) => setLname(e.target.value)}
							></input>
						</div>
					</div>

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
				</div>

				{/* Buttons */}
				<div className="flex flex-col gap-3 w-3/4 lg:w-1/3">
					<button
						className="bg-[var(--primary-button)] h-16 text-lg w-full flex items-center justify-center rounded"
						disabled={loading}
						onClick={() => {
							setLoading(true);

							var format =
								/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
							if (
								fname.length > 25 ||
								fname.length < 1 ||
								fname.match(format) ||
								lname.length > 25 ||
								lname.length < 1 ||
								lname.match(format)
							) {
								setLoading(false);
								return toast.error(
									"Fornavnet eller etternavnet ditt kan ikke være over 25 bokstaver eller inneholde spesielle tegn!",
									{ duration: 5000 }
								);
							}

							createUserWithEmailAndPassword(
								auth,
								email,
								password
							)
								.then((userCredential) => {
									const user = userCredential.user;
									updateProfile(user, {
										displayName: fname,
									}).then(() => {
										set(ref(db, `userData/${user.uid}/`), {
											isAdmin: false,
											fname: fname,
											lname: lname,
											address: "",
											zip: "",
											city: "",
											boatplace: "",
											boatplaceUsage: "",
										})
											.then(() => {
												setLoading(false);
											})
											.catch((error) => {
												let message = error.message;
												message = message.split(":")[1];
												toast.error(message);
												setLoading(false);
											});
									});
								})
								.catch((error) => {
									let message = error.message;
									message = message.split(":")[1];
									toast.error(message);
									setLoading(false);
								});
						}}
					>
						Lag bruker
					</button>
				</div>
			</main>
		</>
	);
}
