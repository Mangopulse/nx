import {create} from 'zustand';

const useBuilderStore = create((set, get) => ({
    instances: [],
    setInstances: (update, callback) => set(state => {
        if(typeof update === 'function'){
            localStorage?.setItem('instances', JSON.stringify(update(state.instances)))
            return { instances: update(state.instances) }
        }
        localStorage?.setItem('instances', JSON.stringify(update))
        return ({ instances: update })
    }),

    selectedInstanceId: null,
    setSelectedInstanceId: (instance) => set(_state => ({ selectedInstanceId: instance })),

    selectedComponent: null,
    setSelectedComponent: (component) => set(_state => ({ selectedComponent: component })),   
    
    getSenderEnabled: true,
    setGetSenderEnabled: (bool) => set(_state => ({ getSenderEnabled: bool })),   

}));


export default useBuilderStore;



