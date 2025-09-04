import * as React from "react";
import { Container } from "../General/Container";
import { LayoutGrid } from "../General/LayoutGrid";
import HeroCopy from "./HeroCopy";
import HeroVisual from "./HeroVisual";

export default function Hero({lang="en"} : {lang?:"ar" | "en"}) {
    return (
        <Container className="pt-24 md:pt-32 lg:pt-32">
            <LayoutGrid className="items-center">
                <div className="col-span-12 lg:col-span-5">
                    <HeroCopy lang={lang}/>
                </div>
                <HeroVisual lang={lang}/>
            </LayoutGrid>
        </Container>
    );
}
