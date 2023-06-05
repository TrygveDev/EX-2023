import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const BackArrow = (props: Props) => {
	const route = useRouter();
	return (
		<FontAwesomeIcon
			className="cursor-pointer"
			icon={faAngleLeft}
			size="2x"
			onClick={() => route.back()}
		/>
	);
};

export default BackArrow;
