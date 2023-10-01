import React, { createContext, useReducer } from 'react';

export const DownloadContext = createContext();

const initialState = {
    downloads: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'START_DOWNLOAD':
            return {
                ...state,
                downloads: [...state.downloads, action.payload]
            };
        case 'STOP_DOWNLOAD':
            return {
                ...state,
                downloads: state.downloads.filter(download => download.id !== action.payload.id)
            };
        default:
            return state;
    }
};

export const DownloadProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <DownloadContext.Provider value={{ state, dispatch }}>
            {children}
        </DownloadContext.Provider>
    );
};
