import Image from "next/image";
import * as React from "react";
import imgLoader from "@/helpers/image"
import "./styles.scss"

export function Copyright() {
    return (
        <div className="copyright">
            <span>{new Date().getFullYear()}</span> &copy;{" "}
            <div className="inline-logo img-wrap">
              <Image 
                src="newsletterX-logo.webp"
                alt="newsletterX"
                fill
                loader={imgLoader}
              />
            </div>
        </div>
    );
}
