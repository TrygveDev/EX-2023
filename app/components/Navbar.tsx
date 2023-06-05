import { faShip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mui/material";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "../libs/firebase";
import { get, ref } from "firebase/database";
import { toast } from "react-hot-toast";

type Props = {
	user: User;
};

const Navbar = (props: Props) => {
	const [isAdmin, setIsAdmin] = useState<any>(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				get(ref(db, `userData/${user.uid}`))
					.then((snapshot) => {
						const data = snapshot.val();
						if (data.isAdmin == "true") setIsAdmin(true);
					})
					.catch((error) => {
						console.log(error);
						toast.error(
							"Whoops! En feil har skjedd. Prøv igjen senere.",
							{ duration: 5000 }
						);
					});
			}
		});
	}, []);

	return (
		<div className="w-full h-20 bg-[var(--primary-button)]">
			<div className="w-full h-full flex flex-row justify-evenly items-center">
				<Link href="/">
					<div className="flex gap-2 items-center justify-center text-[var(--secondary)]">
						<FontAwesomeIcon icon={faShip} />
						<h1>Bølger og Skvulp</h1>
					</div>
				</Link>

				<div className="flex gap-10 items-center text-[var(--secondary)]">
					<Link href="/">
						<p>Hjem</p>
					</Link>
					{isAdmin == true && <Link href="/admin">Admin</Link>}
					<Link href="/settings">
						<Avatar
							className="cursor-pointer border-2 border-[var(--secondary)]"
							src={
								props.user?.photoURL ? props.user.photoURL : ""
							}
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
