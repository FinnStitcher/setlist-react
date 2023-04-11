import {useContext} from 'react';
import UserContext from '../UserContext.jsx';

function useUserContext() {
    const context = useContext(UserContext);

    if (!context) {
        throw Error("Context was not found. useUserContext hook might have been called outside the appropriate context provider.");
    };

    return context;
}

export default useUserContext;