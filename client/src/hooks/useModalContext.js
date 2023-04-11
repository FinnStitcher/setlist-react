import {useContext} from 'react';
import ModalContext from '../ModalContext.jsx';

function useModalContext() {
    const context = useContext(ModalContext);

    if (!context) {
        throw Error("Context was not found. useModalContext hook might have been called outside the appropriate context provider.");
    };

    return context;
}

export default useModalContext;