"use client";
import * as React from "react";
import EmailCanvas from "./components/EmailCanvas";
import BlockPropertiesBar from "./components/BlockPropertiesBar";
import BlockToolBar from "./components/BlockPoolBar";
import HelpFloatingBtn from "@/components/Help/HelpFloatingBtn"
import { nanoid } from "nanoid";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    MeasuringStrategy,
    TouchSensor,
    DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { BLOCKS_POOL, BLOCK_TYPES } from "@/constants";
import useBuilderStore from "./builderStore";
import useOutsideClick from "@/hooks/useOutsideClick";
import InstanceCard from "./components/InstanceCard";
import Block from "./Entities/Block";
import Instance from "./Entities/Instance";
import BlockCard from "./components/BlockPoolBar/BlockCard";
import auth from "@/lib/Auth";
import ActionBar from "./components/ActionBar";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBlocks, getInitialInstances } from "@/helpers/builder";
import AuthLayout from "@/layouts/AuthLayout";
import newsletterRead from "@/services/builder/read";
import getSender from "@/services/website/getSender";
import EmailCanvasSkeleton from "@/skeletons/EmailCanvasSkeleton";
import { useToast } from "@/components/ui/use-toast";
import ErrorPage from "@/components/ErrorPage";
import ActionBarSkeleton from "@/skeletons/ActionBarSkeleton";
import useAuth from "@/hooks/useAuth";
import SenderWarning from "./components/ActionBar/components/SenderWarning";

export default function Builder() {
    const user = useAuth();

    // const getSenderEnabled = useBuilderStore((store) => store.getSenderEnabled);
    // const setGetSenderEnabled = useBuilderStore(
    //     (store) => store.setGetSenderEnabled
    // );
    const instances = useBuilderStore((store) => store.instances);
    const setInstances = useBuilderStore((store) => store.setInstances);
    const setSelectedInstanceId = useBuilderStore(
        (store) => store.setSelectedInstanceId
    );
    const setSelectedComponent = useBuilderStore(
        (store) => store.setSelectedComponent
    );

    const handleKeyDownClick = (event) => {
        // console.log(event);
    };

    React.useEffect(() => {
        document.addEventListener("keydown", handleKeyDownClick);
        return document.removeEventListener("keydown", handleKeyDownClick);
    }, []);

    const { toast } = useToast();
    const { id } = useParams();
    const newsletterReadQ = useQuery({
        queryKey: ["newsletter-read", id],
        queryFn: () => newsletterRead({ id }),
        refetchOnWindowFocus: false,
    });
    const getSenderQ = useQuery({
        queryKey: ["get-sender"],
        queryFn: () => {
            return getSender({
                email: user?.sender?.email,
                id: user?.sender?.id,
            });
        },
        enabled: !user?.sender?.verified,
        refetchOnWindowFocus: "always",
    });
    if (
        getSenderQ.isSuccess &&
        getSenderQ.data?.sender?.verified &&
        !user.sender?.verified
    ) {
        auth.setSender(getSenderQ.data?.sender);
        getSenderQ.refetch();
        // setGetSenderEnabled(!getSenderEnabled)
    }
    const [flag, setFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState();

    // set initial instances from api read
    if (newsletterReadQ.isSuccess && !flag) {
        if (newsletterReadQ.data.code === 200) {
            const components = newsletterReadQ.data?.newsletter.htmlComponents;
            setInstances(getInitialInstances(components));
            setFlag(true);
            // to only do this once
        } else if (newsletterReadQ.data.code !== 200) {
            setErrorMessage(newsletterReadQ.data.errorMessage);
            toast({
                title: "Error in loading the tempalte",
                description: newsletterReadQ.data.errorMessage,
                variant: "destructive",
            });
        }
    }

    const [blocks, setBlocks] = React.useState(getBlocks());

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor, {
            activationConstraint: "",
        })
    );

    const [activeBlock, setActiveBlock] = React.useState();
    const [activeInstance, setActiveInstance] = React.useState();

    function regenerateBlockId(active) {
        const _blocks = [...blocks];
        const blockIndex = _blocks.findIndex((block) => block.id === active.id);
        if (blockIndex !== -1) {
            blocks[blockIndex].id = nanoid(11);
            setBlocks(_blocks);
        }
    }

    function handleDragStart(event) {
        const { active } = event;
        if (active.data.current?.block) {
            const b = active.data.current.block;
            setActiveBlock(b);
        } else if (active.data.current?.instance) {
            setActiveInstance(active.data.current.instance);
        }
    }

    function handleDragEnd(event) {
        setActiveBlock(null);
        setActiveInstance(null);
    }

    function handleDragOver(event) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const isActiveBlock =
            blocks.findIndex((block) => block.id === active.id) !== -1;
        const isActiveInstance =
            active.data.current?.instance instanceof Instance;
        const isOverInstance = over.data.current?.instance instanceof Instance;
        const isOverCanvas = over.id === "canvas";
        const sortableSwitching =
            active.data.current?.sortable?.containerId &&
            active.data.current?.sortable?.containerId ===
                over.data.current?.sortable?.containerId;

        //  dragging an Instance over another Instance
        if (sortableSwitching && isActiveInstance && isOverInstance) {
            setInstances((instances) => {
                const activeIndex = instances.findIndex(
                    (inst) => inst.id === active.id
                );
                const overIndex = instances.findIndex((t) => t.id === over.id);
                return arrayMove(instances, activeIndex, overIndex);
            });
        }
        // draggin a block over an instance or canvas
        if (isActiveBlock && (isOverInstance || isOverCanvas)) {
            const instance = new Instance(activeBlock);
            regenerateBlockId(active);
            setInstances((instances) => {
                const isAlreadyThere =
                    instances.findIndex((inst) => inst.id === instance.id) !==
                    -1;
                if (isAlreadyThere) return instances;
                if (isOverCanvas) {
                    instances.push(instance);
                } else if (isOverInstance) {
                    const overIndex = instances.findIndex(
                        (t) => t.id === over.id
                    );
                    instances.splice(overIndex + 1, 0, instance);
                }
                return instances;
            });
        }
    }

    const canvasRef = React.useRef(null);
    const propertiesBarRef = React.useRef(null);
    const exportRef = React.useRef(null);

    useOutsideClick(
        canvasRef,
        () => {
            setSelectedInstanceId(null);
            setSelectedComponent(null);
        },
        [
            propertiesBarRef,
            "[data-radix-popper-content-wrapper]",
            ".react-colorful",
        ]
    );

    if (errorMessage) return <ErrorPage errorMessage={errorMessage} />;

    return (
        <AuthLayout>
            {!newsletterReadQ.isLoading ? (
                <ActionBar
                    exportRef={exportRef}
                    canvasRef={canvasRef}
                    newsletterReadQ={newsletterReadQ}
                    getSenderQ={getSenderQ}
                />
            ) : (
                <ActionBarSkeleton />
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
            >
                <div className="flex justify-between bg-soft-gray">
                    <BlockToolBar
                        blockPool={blocks}
                        isSenderVerified={
                            getSenderQ.data?.sender?.verified === true
                        }
                    />
                    <div className="flex-grow flex items-center flex-col bg-gray-200/60 h-[calc(100vh-60px)] overflow-auto no-scrollbar pt-0 pb-8">
                        {newsletterReadQ.isLoading ? (
                            <EmailCanvasSkeleton />
                        ) : (
                            <>
                                {instances?.length ? (
                                    <div
                                        className=" text-sm select-none text-center opacity-40 py-2 mb-2 cursor-pointer transition-all hover:opacity-90"
                                        onClick={() => setInstances([])}
                                    >
                                        clear template
                                    </div>
                                ) : ''}
                                <EmailCanvas canvasRef={canvasRef} />
                            </>
                        )}
                    </div>

                    <BlockPropertiesBar
                        key="BlockPropertiesBar"
                        propertiesBarRef={propertiesBarRef}
                        isSenderVerified={
                            getSenderQ.data?.sender?.verified === true
                        }
                    />
                </div>

                <DragOverlay>
                    {activeInstance && (
                        <InstanceCard instance={activeInstance} />
                    )}
                    {activeBlock && (
                        <BlockCard block={activeBlock} isOverlay={true} />
                    )}
                </DragOverlay>
            </DndContext>

            <HelpFloatingBtn lang="en"/>
        </AuthLayout>
    );
}
