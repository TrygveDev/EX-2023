"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../libs/firebase";
import Loading from "../../loading";
import Navbar from "../../components/Navbar";

import { get, ref } from "firebase/database";
import { toast } from "react-hot-toast";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import BackArrow from "@/app/components/BackArrow";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [userData, setUserData] = useState();
	const [initializing, setInitializing] = useState(true);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				get(ref(db, `userData/${user.uid}`)).then((snapshop) => {
					const data = snapshop.val();
					if (data.isAdmin == "false") {
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
		<main className="max-w-screen min-h-screen bg-[var(--secondary)] flex flex-col">
			<Navbar user={user} />
			<div className="w-full pl-96 pr-96 pt-16 flex items-center flex-col gap-2">
				<div className="w-2/4 flex gap-5">
					<BackArrow />
					<h1 className="text-2xl mb-5">Endre eksiterende brukere</h1>
				</div>

				{Object.entries(userData).map((userObj: any, i: any) => {
					return (
						<Link
							key={i}
							href={`/admin/editUser/${userObj[0]}`}
							className="w-2/4 flex items-center justify-between gap-5 bg-[var(--secondary-button)] p-5 rounded text-lg cursor-pointer"
						>
							<p>
								{userObj[1].lname}, {userObj[1].fname}
							</p>
							<FontAwesomeIcon icon={faAngleRight} />
						</Link>
					);
				})}
			</div>
		</main>
	);
}
