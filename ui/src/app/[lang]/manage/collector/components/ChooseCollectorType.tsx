import { useController, useWatch } from "react-hook-form";
import RadioCard from "./RadioCard";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import Button from "@/components/ui/button";
import Loader from "@/components/General/Loader";
import { SaveIcon } from "lucide-react";
import IconButton from "@/components/form/IconButton";
import RadioGroup from "@/components/form/RadioGroup";

const ChooseCollectorTypeForm = ({ form, nextStep }: any) => {
    const { field } = useController({
        name: "type",
        control: form.control,
    } as any);


    const side = useWatch({
        control: form.control,
        name: "popupSide"
    })

    return (
        <div className="flex flex-col items-center gap-10 justify-center pt-9">
            <div>
                <h1 className="text-2xl font-semibold text-center mb-1">
                    Choose your email collector type
                </h1>
                <p className="text-md text-center opacity-60">
                    How would you like the collector to appear on your website?
                </p>
            </div>

            <div className="grid grid-cols-3 gap-9 items-start justify-start">
                <div className="space-y-2 relative">
                    <RadioCard
                        title="Bottom Popup"
                        description="The collector will popup(fade in) from the bottom of the screen"
                        image={
                            side == "left"
                                ? "collector-bottom-popup.svg"
                                : "collector-bottom-popup-right.svg"
                        }
                        value="bottom-popup"
                        field={field}
                    />
                    {field.value === "bottom-popup" && (
                        <div className="absolute w-full">
                            <RadioGroup
                                form={form}
                                items={[
                                    {
                                        label: "Left",
                                        value: "left",
                                    },
                                    {
                                        label: "Right",
                                        value: "right",
                                    },
                                ]}
                                name="popupSide"
                                variant="tabs"
                            />
                        </div>
                    )}
                </div>
                <RadioCard
                    title="Center Popup"
                    description="The collector will popup(fade in) in the center of the screen"
                    image="collector-center-popup.svg"
                    value="center-popup"
                    field={field}
                />
                <RadioCard
                    title="Embeded Collector"
                    description="You can embed the collector in any place you want in your page"
                    image="collector-inline.svg"
                    value="embeded"
                    field={field}
                    comingSoon={true}
                />
            </div>
            <div className="flex items-center w-full mt-6">
                <div className="flex items-center gap-3 ml-auto">
                    <IconButton onClick={nextStep} variant={"outline"}>
                        <p>Next</p>
                        <ArrowRightIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ChooseCollectorTypeForm;
