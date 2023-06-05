"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../libs/firebase";
import Loading from "../loading";
import Navbar from "../components/Navbar";

import { get, ref } from "firebase/database";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [initializing, setInitializing] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				get(ref(db, `userData/${user.uid}`))
					.then((snapshot) => {
						const data = snapshot.val();
						if (data.isAdmin == "false") {
							return router.push("/");
						}
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
		<main className="max-w-screen min-h-screen bg-[var(--secondary)] flex flex-col">
			<Navbar user={user} />
			<div className="w-full pl-96 pr-96 pt-16 flex items-center flex-col gap-2">
				<h1 className="text-2xl w-3/4 mb-5">
					Administrator handlinger
				</h1>
				<Link
					href="/admin/addUser"
					className="w-3/4 flex items-center justify-center gap-5 bg-[var(--secondary-button)] p-5 rounded text-lg"
				>
					<button onClick={() => {}}>
						Opprette nye brukere
						<FontAwesomeIcon icon={faAngleRight} />
					</button>
				</Link>
				<Link
					href="/admin/editUser"
					className="w-3/4 flex items-center justify-center gap-5 bg-[var(--secondary-button)] p-5 rounded text-lg"
				>
					<button onClick={() => {}}>
						Endre eksisterende brukere
						<FontAwesomeIcon icon={faAngleRight} />
					</button>
				</Link>
			</div>
		</main>
	);
}
