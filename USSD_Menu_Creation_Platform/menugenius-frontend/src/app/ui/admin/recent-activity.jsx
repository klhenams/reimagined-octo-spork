import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";


const activities = [
    {
        id: 1,
        name: "Deleted a template",
        time: 1,
        user: "/images/Elipse 5.png",
    },
    {
        id:2,
        name: "Created a new template",
        time: 3,
        user: "/images/Elipse 5.png",
    },
    {
        id:3,
        name: "Edited a template",
        time: 5,
        user: "/images/Elipse 5.png",
    },
    // {
    //     id:4,
    //     name: "Edited a template",
    //     time: 5,
    //     user: "/images/Elipse 5.png",
    // },
]

export default function RecentActivity(){
    return(
        <div className="w-full h-auto lg:h-72 bg-white rounded-2xl p-4 lg:p-6">
          <div className="text-indigo-900 text-lg font-bold mb-3">Recent Activities</div> 
          {activities.map((activity) => {
            return(
            <div key={activity.id} className="flex items-center p-2 gap-4">
            <Image
            src={activity.user}
            width="40"
            height="40"
            alt="user"
            className="rounded-full"
            />
            <div>
                <p className="text-slate-700 text-sm font font-medium">{activity.name}</p>
                <p className="text-slate-400 text-xs font-medium">{activity.time} min ago</p>
            </div>
          </div>
        )
      })}
          <div className="flex items-center text-blue-600 gap-2 justify-end text-base font-bold">View all
            <BsArrowRight />
          </div>
        </div>
    )
}