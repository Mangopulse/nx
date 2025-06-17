import Input from "@/components/form/Input";
import Button from "@/components/ui/button";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckCircledIcon,
    CheckIcon,
    EyeNoneIcon,
    EyeOpenIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { useController, useWatch } from "react-hook-form";
import CollectorPreview from "./CollectorPreview";
import Loader from "@/components/General/Loader";
import { SaveIcon } from "lucide-react";
import SwitchCard from "@/components/form/SwitchCard";
import IconButton from "@/components/form/IconButton";
import RadioGroup from "@/components/form/RadioGroup";
import ColorPicker from "@/app/[lang]/builder/[id]/components/Properties/ColorPicker";

const ConfigureCollectorForm = ({ form, previousStep, submitQuery }: any) => {
    const [showPreview, setShowPreview] = useState(false);
    const [
        titleText,
        subtitleText,
        buttonText,
        successMessageTitleText,
        successMessageSubTitleText,
    ] = useWatch({
        control: form.control,
        name: [
            "titleText",
            "subtitleText",
            "buttonText",
            "successMessageTitleText",
            "successMessageSubTitleText",
        ],
    });
    const template = form.getValues("template");
    const btnBgColor = useController({
        name: "btnBgColor",
        control: form.control,
    } as any);
    const btnTextColor = useController({
        name: "btnTextColor",
        control: form.control,
    } as any);

    return (
        <div className="flex flex-col items-center gap-10 justify-center pt-9">
            <div>
                <h1 className="text-2xl font-semibold text-center mb-1">
                    Customize your collector
                </h1>
                <p className="text-md text-center opacity-60">Make it yours</p>
            </div>
            <div className="w-full flex flex-col gap-4">
                <Input
                    label="Title Text"
                    name="titleText"
                    placeholder={titleText}
                    control={form.control}
                />
                {template !== "template-minimal" && (
                    <Input
                        label="Subtitle Text"
                        name="subtitleText"
                        placeholder={subtitleText}
                        control={form.control}
                    />
                )}
                <Input
                    label="Button Text"
                    name="buttonText"
                    placeholder={buttonText}
                    control={form.control}
                />
                <div className="flex items-start gap-7">
                    <ColorPicker
                        label="Button Background Color"
                        value={btnBgColor.field.value}
                        onChange={btnBgColor.field.onChange}
                    />
                    <ColorPicker
                        label="Button Text Color"
                        value={btnTextColor.field.value}
                        onChange={btnTextColor.field.onChange}
                    />
                </div>

                <Input
                    label="Success Title Text"
                    name="successMessageTitleText"
                    placeholder={successMessageTitleText}
                    control={form.control}
                />
                <Input
                    label="Success Subtitle Text"
                    name="successMessageSubTitleText"
                    placeholder={successMessageSubTitleText}
                    control={form.control}
                />
                <RadioGroup
                    items={[
                        { label: "Left to Right", value: "ltr" },
                        { label: "Right to Left", value: "rtl" },
                    ]}
                    name="direction"
                    form={form}
                    variant="tabs"
                    label="Direction"
                />
                <SwitchCard
                    form={form}
                    name="isActive"
                    label="Collector Active"
                    description="You can deactivate the collector to stop it from showing on your page."
                />
                <div className="grid grid-cols-2 gap-2">
                    <IconButton
                        size={"lg"}
                        className="flex items-center space-x-2"
                        onClick={previousStep}
                        variant={"outline"}
                    >
                        <ArrowLeftIcon />
                        <span>Back</span>
                    </IconButton>
                    <IconButton
                        size={"lg"}
                        className="flex items-center space-x-2"
                        onClick={() => setShowPreview(!showPreview)}
                        variant={"outline"}
                    >
                        {showPreview ? (
                            <>
                                <EyeNoneIcon />
                                Hide Preview
                            </>
                        ) : (
                            <>
                                <EyeOpenIcon />
                                Live Preview
                            </>
                        )}
                    </IconButton>
                </div>
            </div>

            <CollectorPreview
                {...{
                    titleText,
                    subtitleText,
                    buttonText,
                    showPreview,
                    setShowPreview,
                    remove: () => setShowPreview(false),
                    form,
                }}
            />
        </div>
    );
};

export default ConfigureCollectorForm;
