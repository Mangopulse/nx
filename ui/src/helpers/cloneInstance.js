import Instance from "@/app/[lang]/builder/[id]/Entities/Instance";

export function cloneInstance(instance) {
    if (instance instanceof Instance) {
        // Create a new instance of the same class
        const clonedInstance = new Instance();

        // Copy properties from the original instance to the cloned instance
        for (const key in instance) {
            if (instance.hasOwnProperty(key)) {
                // Ensure that you're not cloning functions as-is (customize this if needed)
                clonedInstance[key] = instance[key];
            }
        }

        return clonedInstance;
    }

    if (typeof instance !== "object" || instance === null) {
        return instance; // If it's not an object or not an instance of Instance, return it as is
    }

    if (Array.isArray(instance)) {
        // Clone an array
        return instance.map((item) => cloneInstance(item));
    }

    // Clone a generic object
    const cloned = {};
    for (const key in instance) {
        if (instance.hasOwnProperty(key)) {
            cloned[key] = cloneInstance(instance[key]);
        }
    }
    return cloned;
}
