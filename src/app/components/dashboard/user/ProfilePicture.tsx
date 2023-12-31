import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface ProfilePictureProps {
    source?: string | null;
    className?: string;
    size?: number;
}

export function ProfilePicture(props: ProfilePictureProps) {
    const { source, className, size } = props;
    let element;
    let _size: number = ( size === undefined || size === null ) ? 265 : size;
    if ((source === undefined) || (source === null)) {
        element = <UserIcon className={className} />
    } else {
        element = <div className={className}><Image src={source} width={_size} height={_size} alt="User Profile Picture" /></div>
    }

    return element;
}
