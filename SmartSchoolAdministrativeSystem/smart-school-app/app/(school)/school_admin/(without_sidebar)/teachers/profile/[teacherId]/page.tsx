/** server actions */
import { getTeacherDetails, getTeacherProfileStats } from "../../../../_actions/teachers";
import TeacherProfile from "@/app/(school)/_components/teachers/teacherProfile";

export default async function({params}: {params: {teacherId: string}}){
    const teacherDetails = await getTeacherDetails(params.teacherId);
    const teacherProfileStats = await getTeacherProfileStats(params.teacherId);

    return (<TeacherProfile stats={teacherProfileStats} teacherData={teacherDetails!}/>)
    
}