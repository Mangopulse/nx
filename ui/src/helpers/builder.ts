import Block from "@/app/[lang]/builder/[id]/Entities/Block";
import Component from "@/app/[lang]/builder/[id]/Entities/Component";
import Instance from "@/app/[lang]/builder/[id]/Entities/Instance";
import Property from "@/app/[lang]/builder/[id]/Entities/Property";
import BasicFooter from "@/app/[lang]/builder/[id]/components/Blocks/BasicFooter";
import BasicWidget from "@/app/[lang]/builder/[id]/components/Blocks/BasicWidget";
import CoverBlock from "@/app/[lang]/builder/[id]/components/Blocks/CoverBlock";
import HeadingRow from "@/app/[lang]/builder/[id]/components/Blocks/HeadingRow";
import ArticleRowComponent from "@/app/[lang]/builder/[id]/components/BuildingComponents/ArticleRow";
import DescriptionComponent from "@/app/[lang]/builder/[id]/components/BuildingComponents/Description";
import HeadingComponent from "@/app/[lang]/builder/[id]/components/BuildingComponents/Heading";
import ImageComponent from "@/app/[lang]/builder/[id]/components/BuildingComponents/Image";
import SocialIconsComponent from "@/app/[lang]/builder/[id]/components/BuildingComponents/SocialIcons";
import {
    BLOCKS_POOL,
    BLOCK_TYPES,
    COMPONENT_TYPES,
    DYNAMIC_WIDGETS_VARIABLES,
    LOCAL_IMAGES_REPLACEMENTS,
    MAXIMUM_ARTICLE_COUNT,
    PROPERTY_TYPES,
} from "@/constants";


// getters
export const getComponentPropertyValueFromInstance = (
    instance: Instance | undefined,
    component: Component,
    propertyType: string
) => {
    if (!instance) return;
    const componentFound = instance.components.find(
        (comp) => comp.id === component.id
    );
    if (!componentFound) return;
    const propertyFound = componentFound?.properties?.find(
        (prop: Property) => prop.type === propertyType
    );
    return propertyFound;
};

export const getInstancePropertyValueFromInstance = (
    instance: Instance | undefined,
    propertyType: string
) => {
    return instance?.properties?.find((prop) => prop.type === propertyType);
};

export const getComponentByKeyFromInstance = (
    instance: Instance | undefined,
    componentKey: string
) => {
    if (!instance) return;
    const componentFound = instance.components.find(
        (comp) => comp.key === componentKey
    );
    return componentFound;
};

export const getInitialInstances = (instances: [any]) => {
    const out = instances.map((instance: any) => {
        const element = getInstanceElementByType(instance.type);
        instance.element = element;
        instance.components.map((component: any) => {
            const element = getComponentElementByType(component.type);
            component.element = element;
        });
        return new Instance(instance);
    });
    return out;
};

export const getInstanceElementByType = (type: string) => {
    try {
        switch (type) {
            case BLOCK_TYPES.HEADING_ROW:
                return HeadingRow;
            case BLOCK_TYPES.COVER:
                return CoverBlock;
            case BLOCK_TYPES.BASIC_WIDGET:
                return BasicWidget;
            case BLOCK_TYPES.FOOTER:
                return BasicFooter;
            default:
                return "none";
        }
    } catch (e) {}
};

export const getComponentElementByType = (type: string) => {
    try {
        switch (type) {
            case COMPONENT_TYPES.HEADING:
                return HeadingComponent;
            case COMPONENT_TYPES.DESCRIPTION:
                return DescriptionComponent;
            case COMPONENT_TYPES.ARTICLE_ROW:
                return ArticleRowComponent;
            case COMPONENT_TYPES.IMAGE:
                return ImageComponent;
            case COMPONENT_TYPES.SOCIAL_ICONS:
                return SocialIconsComponent;
            default:
                return "none";
        }
    } catch (e) {}
};

export const getTotalArticlesCount = (instances: Instance[]) => {
    let totalArticlesCount = 0;
    instances?.forEach((instance: Instance, i: number) => {
        if (instance.type === BLOCK_TYPES.BASIC_WIDGET) {
            const articleCount = parseInt(
                getPropertyValue(
                    PROPERTY_TYPES.ARTICLES_COUNT,
                    instance.properties
                ) || "0"
            );
            totalArticlesCount += articleCount;
        }
    });
    return totalArticlesCount;
};

export const getBlocks = () => {
    const blocks = [];
    for (const block in BLOCKS_POOL) {
        blocks.push(new Block(block));
    }
    return blocks;
};

export const getStyleFromProperties = (
    properties: Array<Property>
): React.CSSProperties => {
    const style: React.CSSProperties = {};
    properties?.forEach((prop: Property) => {
        if (prop.cssName) {
            if(prop.dataType === "url"){
                (style as any)[prop.cssName] = `url(${prop.value})`;
                return;
            }
            (style as any)[prop.cssName] = prop.value + (prop.unit ?? "");
        } else
            switch (prop.type) {
                case PROPERTY_TYPES.PADDING: {
                    style.paddingRight = prop.value?.inline + "px";
                    style.paddingLeft = prop.value?.inline + "px";
                    style.paddingBottom = prop.value?.block + "px";
                    style.paddingTop = prop.value?.block + "px";
                }
            }
    });
    return style;
};

export const getPropertyValue = (
    propertyType: string,
    properties: Array<Property> | undefined
): any | undefined => {
    if (!properties) return;
    const found = properties?.find((prop) => prop.type === propertyType);
    return found?.value;
};



export const replaceWidgetPlaceholders: any = (
    html: string,
    articlesCount: number
) => {
    if (!html) return "";
    const { title, image, url } = DYNAMIC_WIDGETS_VARIABLES;
    // replace titles
    for (let i = 1; i <= articlesCount; i++) {
        html = html.replace(
            title.placeholder,
            title.replaceWith.replace("INDEX", String(i))
        );
    }

    // replace image
    for (let i = 1; i <= articlesCount; i++) {
        html = html.replace(
            image.placeholder,
            image.replaceWith.replace("INDEX", String(i))
        );
    }

    // replace urls
    for (let i = 1; i <= articlesCount; i++) {
        html = html.replace(
            url.placeholder,
            url.replaceWith.replace("INDEX", String(i))
        );
    }

    return html;
};

export const replaceLocalImagesPlaceholders: any = (html: string) => {
    if (!html) return "";
    for (const item in LOCAL_IMAGES_REPLACEMENTS) {
        const { placeholder, replaceWith } = LOCAL_IMAGES_REPLACEMENTS[item];
        html = html.replaceAll(placeholder, replaceWith);
    }
    return html;
};

export const replaceHrefPlaceholders: any = (html: string) => {
    if (!html) return "";
    return html.replaceAll("nx-href", "href");
};

export const removeContentEditable: any = (html: string) => {
    if (!html) return "";
    return html.replaceAll("contenteditable", "nx"); //nx is not an attribute so it will be automatically removed
};

export const populateWidgetPlaceholders: any = (html: string, articlesCount: number=3) => {
    if (!html) return "";
    const { title, image, url } = DYNAMIC_WIDGETS_VARIABLES;
    
    // replace titles
    html = html.replaceAll(
        /@@TITLE-\d@@/g,
        title.placeholder
    );

    // replace images
    html = html.replaceAll(
        /@@IMAGE-\d@@/g,
        image.placeholder
    );

    // replace URLS
    html = html.replaceAll(
        /@@URL-\d@@/g,
        url.placeholder
    );
    return html;
};

export const generateJsonOutputFromInstances = (instances: Instance[]) => {
    const exportJson: any = [];
    instances.forEach((instance: Instance, i: number) => {
        const instanceDOM = document.querySelector(
            `div[id^=dropitem-${instance.id}]`
        );
        instanceDOM?.querySelector(`#instance-controls-${instance.id}`)?.remove();
        let html = instanceDOM?.innerHTML;
        if(!html) return;
        // replacements
        if (instance.type === BLOCK_TYPES.BASIC_WIDGET) {
            const articlesCount = parseInt(
                getPropertyValue(
                    PROPERTY_TYPES.ARTICLES_COUNT,
                    instance.properties
                )
            );
            const widgetLogic = getPropertyValue(
                PROPERTY_TYPES.RECOMMENDATION_LOGIC,
                instance.properties
            );
            instance.extra = instance.extra || {};
            instance.extra.postsCount = articlesCount;
            instance.extra.logic = widgetLogic;
            html = replaceWidgetPlaceholders(html, articlesCount);
        }
        html = replaceLocalImagesPlaceholders(html);
        html = replaceHrefPlaceholders(
            html,
            instance.type === BLOCK_TYPES.FOOTER
        );
        html = removeContentEditable(html);

        exportJson.push({
            id: instance.id,
            type: instance.type,
            name: instance.name,
            html: html,
            extra: instance.extra,
            components: instance.components,
            properties: instance.properties,
        });
    });
    return exportJson;
};

export const articleCountExceedsMaximum = (instances: Instance[]):boolean => {
    if(getTotalArticlesCount(instances) > MAXIMUM_ARTICLE_COUNT) return true;
    return false;    
}

