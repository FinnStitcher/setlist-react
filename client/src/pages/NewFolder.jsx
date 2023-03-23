import { useContext } from 'react';
import UserContext from '../UserContext.jsx';

import AuthFailed from './AuthFailed.jsx';
import FolderForm from '../components/FolderForm.jsx';

function NewFolder() {
	const { user } = useContext(UserContext);

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="mb-4">
                <h2 className="page-title">Create Folder</h2>
            </div>

            <FolderForm />
		</>
	);
}

export default NewFolder;
