import { useContext } from 'react';
import UserContext from '../../UserContext.jsx';

import AuthFailed from '../error_pages/AuthFailed.jsx';
import FolderFormWrapper from '../../components/folders/FolderFormWrapper.jsx';

function NewFolder() {
	const { user } = useContext(UserContext);

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="page-title">
                <h2>Create Folder</h2>
            </div>

            <FolderFormWrapper />
		</>
	);
}

export default NewFolder;
