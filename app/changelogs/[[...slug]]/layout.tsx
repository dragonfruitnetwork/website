import React from "react";

import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <main>
            <Header/>
            <div className="md:container md:mx-auto px-8 md:px-[10dvw] space-y-5">
                {props.children}
            </div>
            <Footer/>
        </main>
    )
}