"use client";

import { Avatar, OutlinedInput, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	User,
	onAuthStateChanged,
	sendEmailVerification,
	sendPasswordResetEmail,
	signOut,
	updateProfile,
} from "firebase/auth";
import { auth, db } from "../libs/firebase";
import Loading from "../loading";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAnchor,
	faAngleRight,
	faEdit,
	faHome,
	faLocationDot,
	faMapLocation,
	faSave,
	faShip,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { get, ref, set } from "firebase/database";
import { toast } from "react-hot-toast";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [userData, setUserData] = useState({
		fname: "",
		lname: "",
		address: "",
		boatplace: "",
		city: "",
		zip: "",
		boatplaceUsage: [],
	});
	const [initializing, setInitializing] = useState(true);
	const [loading, setLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [fname, setFname] = useState("");
	const [lname, setLname] = useState("");
	const [address, setAddress] = useState("");
	const [boatplace, setBoatplace] = useState("");
	const [city, setCity] = useState("");
	const [zip, setZip] = useState("");
	const [boatplaceUsage, setBoatplaceUsage] = useState<any>();
	const [isLoggedInUserAdmin, setIsLoggedInUserAdmin] =
		useState<boolean>(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				get(ref(db, `userData/${user.uid}`))
					.then((snapshot) => {
						const data = snapshot.val();
						setUserData(data);
						setFname(data?.fname);
						setLname(data?.lname);
						setAddress(data?.address);
						setBoatplace(data?.boatplace);
						setCity(data?.city);
						setZip(data?.zip);
						setBoatplaceUsage(data?.boatplaceUsage);
						setIsLoggedInUserAdmin(data?.isAdmin);
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
		<main className="max-w-screen min-h-screen items-center bg-[var(--secondary)] flex flex-col">
			<Navbar user={user} isAdmin={isLoggedInUserAdmin} />
			<div className="w-2/3 pt-16 flex items-center flex-col gap-2 mb-20">
				<div className="w-2/4 flex items-center gap-2">
					<Avatar
						src={user?.photoURL ? user.photoURL : ""}
						className="w-32 h-32"
					/>
					<div className="w-full flex flex-col gap-2">
						<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
							<FontAwesomeIcon icon={faUser} size="lg" />
							<input
								className="bg-transparent w-full focus:outline-none"
								maxLength={25}
								defaultValue={userData.fname}
								placeholder="Fornavn"
								disabled={loading || !editMode}
								onChange={(e) => setFname(e.target.value)}
							></input>
						</div>
						<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
							<FontAwesomeIcon icon={faUser} size="lg" />
							<input
								className="bg-transparent w-full focus:outline-none"
								maxLength={25}
								defaultValue={userData.lname}
								placeholder="Etternavn"
								disabled={loading || !editMode}
								onChange={(e) => setLname(e.target.value)}
							></input>
						</div>
					</div>
				</div>

				<div className="w-2/4 flex flex-col gap-2">
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
						<FontAwesomeIcon icon={faShip} size="lg" />
						<input
							className="bg-transparent w-full focus:outline-none"
							maxLength={3}
							type="number"
							defaultValue={userData.boatplace}
							placeholder="Båtplass"
							disabled={loading || !editMode}
							onChange={(e) => setBoatplace(e.target.value)}
						></input>
					</div>
					<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
						<FontAwesomeIcon icon={faHome} size="lg" />
						<input
							className="bg-transparent w-full focus:outline-none"
							maxLength={30}
							placeholder="Adresse"
							defaultValue={userData.address}
							disabled={loading || !editMode}
							onChange={(e) => setAddress(e.target.value)}
						></input>
					</div>
					<div className="flex gap-2">
						<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
							<FontAwesomeIcon icon={faLocationDot} size="lg" />
							<input
								className="bg-transparent w-full focus:outline-none"
								maxLength={4}
								defaultValue={userData.zip}
								placeholder="Postkode"
								disabled={loading || !editMode}
								onChange={(e) => setZip(e.target.value)}
							></input>
						</div>
						<div className="w-full flex items-center gap-3 bg-[var(--secondary-button)] p-5 rounded text-lg">
							<FontAwesomeIcon icon={faMapLocation} size="lg" />
							<input
								className="bg-transparent w-full focus:outline-none"
								maxLength={30}
								placeholder="Poststed"
								defaultValue={userData.city}
								disabled={loading || !editMode}
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
							defaultValue={userData.boatplaceUsage}
							disabled={loading || !editMode}
							onChange={(e) => setBoatplaceUsage(e.target.value)}
						></input>
					</div>
					<p className="text-gray-500">
						Skriv uker separert med komma, eks: 1, 2, 3
					</p>
				</div>

				<div className="w-2/4 flex items-center justify-center">
					{editMode ? (
						<button
							className="w-3/4 flex items-center justify-center gap-2 bg-[var(--primary-button)] p-5 rounded text-lg"
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

								// Sette displayname

								updateProfile(user, {
									displayName: fname,
								}).then(() => {
									set(ref(db, `userData/${user.uid}/`), {
										fname: fname,
										lname: lname,
										address: address,
										zip: zip,
										city: city,
										boatplace: boatplace,
										boatplaceUsage: boatplaceUsage,
									})
										.then(() => {
											setLoading(false);
											toast.success("Endringer lagret!", {
												duration: 5000,
											});
										})
										.catch((error) => {
											let message = error.message;
											message = message.split(":")[1];
											toast.error(message);
											setLoading(false);
										});
								});

								setEditMode(false);
								setLoading(false);
							}}
						>
							<FontAwesomeIcon icon={faSave} />
							Lagre Endringer
						</button>
					) : (
						<button
							className="w-3/4 flex items-center justify-center gap-2 bg-[var(--primary-button)] p-5 rounded text-lg"
							onClick={() => setEditMode(true)}
						>
							<FontAwesomeIcon icon={faEdit} />
							Rediger Informasjon
						</button>
					)}
				</div>

				<div className="w-2/4 pt-10 flex flex-col items-center gap-2">
					{!user.emailVerified && (
						<button
							className="w-full flex items-center justify-center gap-5 bg-[var(--secondary-button)] p-5 rounded text-lg"
							onClick={() => {
								sendEmailVerification(auth.currentUser).then(
									() =>
										toast.success(
											"En epost med en link for å verifisere eposten din har blitt sendt til deg!",
											{ duration: 5000 }
										)
								);
							}}
						>
							Verifiser Email
							<FontAwesomeIcon icon={faAngleRight} />
						</button>
					)}

					<button
						className="w-full flex items-center justify-center gap-5 bg-[var(--secondary-button)] p-5 rounded text-lg"
						onClick={() =>
							sendPasswordResetEmail(auth, user.email).then(() =>
								toast.success(
									"En epost med instruksjoner for å endre passordet ditt har blitt sendt til deg!",
									{ duration: 7000 }
								)
							)
						}
					>
						Endre Passord
						<FontAwesomeIcon icon={faAngleRight} />
					</button>
					<button
						className="w-full flex items-center justify-center gap-5 bg-[var(--secondary-button)] p-5 rounded text-lg"
						onClick={() => signOut(auth)}
					>
						Logg ut
						<FontAwesomeIcon icon={faAngleRight} />
					</button>
				</div>
			</div>
		</main>
	);
}
