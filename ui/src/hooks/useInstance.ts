import { useContext } from "react";
import {InstanceContext} from "@/context/InstanceContext";
import Instance from "@/app/[lang]/builder/[id]/Entities/Instance";

export interface IInstanceState {
    instance: Instance | undefined,
    setInstance: (instance: Instance) => void
}

export default function useInstance() : IInstanceState{
    const instanceState = useContext(InstanceContext);
    if(!instanceState){
        return {
            instance: undefined,
            setInstance: () => {}
        }
    }
    return instanceState;
}