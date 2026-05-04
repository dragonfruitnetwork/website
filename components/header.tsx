import NavBar from "@/components/navbar";
import {Separator} from "@/components/ui/separator";

export default function Header() {
    return (
        <div>
            <header className="py-3 px-4 sm:px-8 lg:px-[10vw]">
                <NavBar/>
            </header>
            <Separator className="mb-8"/>
        </div>
    )
}