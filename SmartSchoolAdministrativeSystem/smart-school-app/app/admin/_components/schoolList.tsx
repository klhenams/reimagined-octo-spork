/** component imports */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/** icon imports */
import { UserIcon, EditIcon } from "lucide-react";

interface SchoolCardProps extends React.HTMLProps<Element> {
  name: string;
  region: string;
  district: string;
  badgeImagePath: string;
}

export const SchoolCard: React.FC<SchoolCardProps> = (props) => {
  return (
    <div className="shadow-neutral-500 shadow-sm p-4 rounded-sm flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={props.badgeImagePath} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1>{props.name}</h1>
          <small>{props.district}, {props.region}</small>
        </div>
      </div>
      <div className="flex justify-end gap-4 ">
        <UserIcon className="cursor-pointer hover:stroke-ssPrimary-100"/>
        <EditIcon className="cursor-pointer hover:stroke-ssPrimary-100"/>
      </div>
    </div>
  );
};

export function SchoolList({ children }: { children: React.ReactNode }) {
  return <div className="w-full grid grid-cols-3">{children}</div>;
}
