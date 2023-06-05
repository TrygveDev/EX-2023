"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../libs/firebase";
import Loading from "../loading";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShip } from "@fortawesome/free-solid-svg-icons";

export default function Auth() {
	const router = useRouter();
	const [initializing, setInitializing] = useState<boolean>(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/");
			} else {
				setInitializing(false);
			}
		});
	}, [router]);

	return initializing ? (
		<Loading />
	) : (
		<main className="h-screen w-screen flex flex-col items-center justify-evenly bg-[var(--secondary)] p-7">
			<div className="w-full text-center">
				<FontAwesomeIcon icon={faShip} size={"5x"} />
				<h1 className="text-3xl font-extrabold">Bølger og Skvulp</h1>
			</div>
			<div className="w-3/4 lg:w-1/3 flex flex-col gap-4">
				<Link href="/auth/login">
					<button className="bg-[var(--primary-button)] h-16 text-lg w-full flex items-center justify-center rounded">
						Logg inn
					</button>
				</Link>
				<Link href="/auth/signup">
					<button className="bg-[var(--secondary-button)] h-16 text-lg w-full flex items-center justify-center rounded">
						Lag bruker
					</button>
				</Link>
			</div>
		</main>
	);
}
