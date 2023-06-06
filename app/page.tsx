"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./libs/firebase";
import Loading from "./loading";
import Navbar from "./components/Navbar";
import hero from "./assets/hero.jpg";
import fb from "./assets/fb.jpg";
import insta from "./assets/insta.jpg";
import twitter from "./assets/twitter.jpg";
import Image from "next/image";
import { get, ref } from "firebase/database";

export default function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User>();
	const [initializing, setInitializing] = useState(true);
	const [isLoggedInUserAdmin, setIsLoggedInUserAdmin] = useState(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				get(ref(db, `userData/${user.uid}`)).then((snapshop) => {
					const data = snapshop.val();
					if (data?.isAdmin === false) {
						setIsLoggedInUserAdmin(false);
						return router.push("/");
					} else {
						setIsLoggedInUserAdmin(true);
					}
				});
				setInitializing(false);
			} else {
				router.push("/auth");
			}
		});
	}, [router]);

	return initializing ? (
		<Loading />
	) : (
		<main className="max-w-screen min-h-screen items-center bg-[var(--secondary)] flex flex-col mb-20">
			<Navbar user={user} isAdmin={isLoggedInUserAdmin} />
			<div className="w-1/2 pt-16">
				<div className="flex flex-col items-center gap-5">
					<div className="w-full h-72 rounded-xl drop-shadow-xl overflow-hidden flex items-end">
						<Image src={hero} alt="" />
					</div>
					<div className="w-full">
						<h1 className="text-3xl">Bølger og Skvulp</h1>
						<p className="text-xl pt-2">
							Bølger og Skvulp er en båtforening dedikert til å
							skape en unik og berikende opplevelse for
							båtentusiaster i vårt lokalsamfunn. Vi har et
							lidenskapelig fellesskap av medlemmer som deler den
							samme kjærligheten for båtliv og havet. Vi ser frem
							til å ønske deg velkommen ombord!
						</p>
					</div>
				</div>
				<div className="w-full flex flex-col items-center justify-center mt-28 mb-16">
					<h1 className="m-2">Sjekk ut våre sosiale medier!</h1>
					<div className="w-1/3 flex justify-center items-center gap-8">
						<Image
							src={fb}
							alt=""
							className="w-10 h-10 rounded-full drop-shadow-xl cursor-pointer"
						/>
						<Image
							src={insta}
							alt=""
							className="w-10 h-10 rounded-full drop-shadow-xl cursor-pointer"
						/>
						<Image
							src={twitter}
							alt=""
							className="w-10 h-10 rounded-full drop-shadow-xl cursor-pointer"
						/>
					</div>
				</div>
				<div className="flex flex-row gap-4">
					<div className="w-1/2 flex flex-col gap-2">
						<h1 className="text-2xl w-full text-center">
							Siste Nyheter
						</h1>
						<hr />
						<div>
							<h2 className="font-bold">
								Båtsesongen er i gang!
							</h2>
							<p className="truncate">
								Vi ønsker alle våre medlemmer en fantastisk
								start på båtsesongen! Våre båtplasser er nå
								åpne, og vi oppfordrer alle til å sjekke sine
								tildelte uker og gjøre nødvendige forberedelser
								før de legger ut på vannet. Vi ønsker dere alle
								trygge og hyggelige turer!
							</p>
						</div>

						<div>
							<h2 className="font-bold">
								Velkommen til våre nye medlemmer!
							</h2>
							<p className="truncate">
								Vi ønsker å gi en varm velkomst til våre nyeste
								medlemmer i Bølger og Skvulp-familien! Vi håper
								dere vil trives i fellesskapet og nyte de mange
								fordelene medlemskapet gir. Ta gjerne kontakt
								med oss hvis det er noe vi kan hjelpe dere med.
							</p>
						</div>

						<div>
							<h2 className="font-bold">Sommerfest på brygga!</h2>
							<p className="truncate">
								Vi gleder oss til å arrangere årets sommerfest
								på brygga! Det blir en fantastisk anledning til
								å møte andre medlemmer og dele båthistorier mens
								vi nyter deilige grillretter og forfriskende
								drikke. Mer informasjon om dato og påmelding
								kommer snart, så hold øynene åpne!
							</p>
						</div>
					</div>
					<div className="w-1/2 flex flex-col gap-2">
						<h1 className="text-2xl w-full text-center">
							Kjekk informasjon
						</h1>
						<hr />
						<div>
							<h2 className="font-bold">
								Båthavnens fasiliteter
							</h2>
							<p className="truncate">
								Vår båthavn tilbyr et bredt spekter av
								fasiliteter for våre medlemmer. Vi har moderne
								brygger og godt vedlikeholdte båtplasser som gir
								trygg og praktisk lagring for båtene. I tillegg
								har vi rent og tilgjengelig vann og strøm ved
								hver båtplass. Våre medlemmer kan også dra nytte
								av sanitær- og dusjfasiliteter samt tilgang til
								wifi i havneområdet.
							</p>
						</div>

						<div>
							<h2 className="font-bold">Båthavnens sikkerhet</h2>
							<p className="truncate">
								Vi prioriterer sikkerheten til våre medlemmer og
								deres eiendeler. Båthavnen er utstyrt med
								videoovervåkning og tilgangskontroll for å sikre
								at bare autoriserte personer får tilgang til
								området. Vi anbefaler også alle medlemmer å
								bruke solide låser og annet sikkerhetsutstyr for
								å beskytte sine båter.
							</p>
						</div>

						<div>
							<h2 className="font-bold">Værinformasjon</h2>
							<p className="truncate">
								For å hjelpe våre medlemmer med å planlegge sine
								båtutflukter, tilbyr vi oppdatert værinformasjon
								på vår nettside. Sjekk værvarsler, temperatur,
								vindstyrke og andre relevante detaljer før du
								legger ut på vannet. Husk at været kan endre seg
								raskt, så det er viktig å være oppmerksom og ta
								nødvendige forholdsregler.
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
