import FileUpload from "@/components/general/fileUpload";
import SubmitButton from "@/components/general/forms/submitButton";
export default function MultiTeachersUpload(){
    return (
        <form>
            <FileUpload/>
            <SubmitButton className="w-full mt-4 py-12"/>
        </form>
    )
}