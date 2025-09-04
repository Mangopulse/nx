import { nanoid } from "nanoid";
import Component from "./Component";
import { BLOCKS_POOL } from "@/constants";
import React from "react";

class Block {

    id: string;
    name: string;
    type: string;
    preview: string;
    components: Array<{type: string, key:string, defaultValue?:any}>;
    properties: Array<{type: string, defaultValue?:any}> | undefined;
    element: (props: any) => React.JSX.Element;
    extra?: any;

    constructor(type: string){
        this.id = nanoid(11);
        this.type = type;
        this.name = this.getName();
        this.preview = this.getPreview();
        this.components = this.getComponents();
        this.properties = this.getProperties();
        this.element = this.getElement();
        this.extra = this.getExtra();
    }


    getName(): string{
        return BLOCKS_POOL[this.type]?.name;
    }

    getPreview(): string{
        return BLOCKS_POOL[this.type]?.preview;
    }

    getComponents():  Array<{type: string, key:string, defaultValue?:any, aliasName?:string}>{
        return BLOCKS_POOL[this.type]?.components;
    }

    getProperties():  Array<{type: string, defaultValue?:any}> | undefined{
        return BLOCKS_POOL[this.type]?.properties;
    }

    getElement(): (props: any) => React.JSX.Element {
        return BLOCKS_POOL[this.type]?.element;
    }

    getExtra(): any{
        return BLOCKS_POOL[this.type]?.extra;
    }

}

export default Block;