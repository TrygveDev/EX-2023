"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	User,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	updateProfile,
} from "firebase/auth";
import { auth, db } from "../../libs/firebase";
import Loading from "../../loading";
import Navbar from "../../components/Navbar";

import { get, ref, set } from "firebase/database";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAnchor,
	faEnvelope,
	faHome,
	faLocationDot,
	faLock,
	faMapLocation,
	faShield,
	faShip,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import BackArrow from "@/app/components/BackArrow";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [userData, setUserData] = useState();
	const [initializing, setInitializing] = useState(true);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fname, setFname] = useState("");
	const [lname, setLname] = useState("");
	const [address, setAddress] = useState("");
	const [boatplace, setBoatplace] = useState("");
	const [city, setCity] = useState("");
	const [zip, setZip] = useState("");
	const [boatplaceUsage, setBoatplaceUsage] = useState<any>();
	const [isAdmin, setIsAdmin] = useState<any>(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				get(ref(db, `userData/${user.uid}`)).then((snapshop) => {
					const data = snapshop.val();
					if (data?.isAdmin == "false") {
						return router.push("/");
					}
				});
				get(ref(db, `userData`))
					.then((snapshot) => {
						const data = snapshot.val();
						setUserData(data);
						setInitializing(false);
					})
					.catch((error) => {
						console.log(error);
						toast.error(
							"Whoops! En feil har skjedd. Prøv igjen senere.",
							{ duration: 5000 }
						);
					});
			} else {
				router.push("/auth");
			}
		});
	}, [router]);

	return initializing ? (
		<Loading />
	) : (
		<main className="max-w-screen min-h-screen bg-[var(--secondary)] flex flex-col mb-20">
			<Navbar user={user} />
			<div className="w-full pl-96 pr-96 pt-16 flex items-center flex-col gap-2">
				<div className="w-2/4 flex gap-5">
					<BackArrow />
					<h1 className="text-2xl w-2/4 mb-5">
						Opprett en ny bruker
					</h1>
				</div>

				<div className="w-2/4 flex flex-col gap-4">
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
				<div className="w-2/4 flex flex-col gap-2">
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
						<FontAwesomeIcon icon={faShip} size="lg" />
						<input
							className="bg-transparent w-full focus:outline-none"
							maxLength={3}
							type="number"
							placeholder="Båtplass"
							disabled={loading}
							onChange={(e) => setBoatplace(e.target.value)}
						></input>
					</div>
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
						<FontAwesomeIcon icon={faHome} size="lg" />
						<input
							className="bg-transparent w-full focus:outline-none"
							maxLength={30}
							placeholder="Adresse"
							disabled={loading}
							onChange={(e) => setAddress(e.target.value)}
						></input>
					</div>
					<div className="flex gap-2">
						<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
							<FontAwesomeIcon icon={faLocationDot} size="lg" />
							<input
								className="bg-transparent w-full focus:outline-none"
								maxLength={4}
								placeholder="Postkode"
								disabled={loading}
								onChange={(e) => setZip(e.target.value)}
							></input>
						</div>
						<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
							<FontAwesomeIcon icon={faMapLocation} size="lg" />
							<input
								className="bg-transparent w-full focus:outline-none"
								maxLength={30}
								placeholder="Poststed"
								disabled={loading}
								onChange={(e) => setCity(e.target.value)}
							></input>
						</div>
					</div>
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
						<FontAwesomeIcon icon={faAnchor} size="lg" />
						<input
							className="bg-transparent w-full focus:outline-none"
							maxLength={100}
							placeholder="Uker du skal bruke båtplassen"
							disabled={loading}
							onChange={(e) => setBoatplaceUsage(e.target.value)}
						></input>
					</div>
					<p className="text-gray-500">
						Skriv uker separert med komma, eks: 1, 2, 3
					</p>
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
						<FontAwesomeIcon icon={faShield} size="lg" />
						<input
							className="bg-transparent w-full focus:outline-none"
							maxLength={5}
							placeholder="Er brukeren en administrator? (true/false)"
							disabled={loading}
							onChange={(e) => setIsAdmin(e.target.value)}
						></input>
					</div>
				</div>

				{/* Buttons */}
				<div className="flex flex-col gap-3 w-2/4">
					<button
						className="bg-[var(--primary-button)] h-16 text-lg w-full flex items-center justify-center rounded"
						disabled={loading}
						onClick={() => {
							setLoading(true);

							// Validere input
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

							if (boatplace.length > 3) {
								setLoading(false);
								return toast.error(
									"Båtplassen din kan ikke være over 3 siffer!",
									{ duration: 5000 }
								);
							}

							if (address.length > 30) {
								setLoading(false);
								return toast.error(
									"Adressen din kan ikke være over 30 bokstaver!",
									{ duration: 5000 }
								);
							}

							if (zip.length > 4) {
								setLoading(false);
								return toast.error(
									"Postkoden din må være 4 siffer!",
									{ duration: 5000 }
								);
							}

							if (city.length > 30) {
								setLoading(false);
								return toast.error(
									"Poststedet ditt kan ikke være over 30 bokstaver!",
									{ duration: 5000 }
								);
							}
							const regex = /^\d+(,\s*\d+)*$/;
							if (boatplaceUsage) {
								if (
									boatplaceUsage.length > 100 ||
									!regex.test(boatplaceUsage)
								) {
									setLoading(false);
									return toast.error(
										"Ukene du skal bruke båtplassen din kan ikke være over 100 bokstaver eller inneholde spesielle tegn!",
										{ duration: 5000 }
									);
								}
							}

							if (isAdmin !== "true" && isAdmin !== "false") {
								setLoading(false);
								return toast.error(
									"Er brukeren en administrator? (true/false)",
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
											isAdmin: isAdmin,
											fname: fname,
											lname: lname,
											address: address,
											zip: zip,
											city: city,
											boatplace: boatplace,
											boatplaceUsage: boatplaceUsage,
										})
											.then(() => {
												router.push("/settings");
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
					<p className="text-gray-500">
						Når du lager en bruker blir du automatisk logget inn på
						den for å fullføre registreringen.
					</p>
				</div>
			</div>
		</main>
	);
}
