import {
    Accordion as Accordion_ui,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export interface IAccordionProps {
    items: Array<{
        trigger: React.ReactElement;
        content: React.ReactElement;
        id?: any
    }>;
    type?: "single" | "multiple";
    openedItems?: any;
    setOpenedItems?: (items: any) => void;
}

export default function Accordion({
    items,
    type = "single",
    openedItems,
    setOpenedItems,
}: IAccordionProps) {
    if(!items) return;
    return (
        <Accordion_ui
            type={type}
            className="w-full"
            value={openedItems}
            onValueChange={(e:any) => setOpenedItems && setOpenedItems(e)}
        >
            {items?.map((item, i) => (
                <AccordionItem value={"item-" + item.id} key={"item-" + item.id}>
                    <AccordionTrigger>{item.trigger}</AccordionTrigger>
                    <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion_ui>
    );
}
