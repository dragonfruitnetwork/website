import {Metadata} from "next";

import Header from "@/components/header";
import Footer from "@/components/footer";

import {WikiClient} from "./wiki-client";

export const metadata: Metadata = {
    title: "Wiki",
    description: "Documentation for DragonFruit projects and services.",
    openGraph: {
        title: "DragonFruit Wiki",
        description: "Documentation for DragonFruit projects and services."
    }
};

export default async function WikiPage({params}: { params: Promise<{ slug?: string[] }> }) {
    const slug = (await params).slug ?? [];
    return (<>
        <Header/>
        <main className="container mx-auto px-4 py-8 grow">
            <WikiClient slug={slug}/>
        </main>
        <Footer/>
    </>);
}
