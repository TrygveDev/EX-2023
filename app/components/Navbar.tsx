import { faShip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mui/material";
import { User } from "firebase/auth";
import React from "react";
import Link from "next/link";

type Props = {
	user: User;
	isAdmin: boolean;
};

const Navbar = (props: Props) => {
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
					{props.isAdmin === true && <Link href="/admin">Admin</Link>}
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
