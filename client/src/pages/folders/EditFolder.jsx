import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../../UserContext.jsx';
import ModalContext from '../../ModalContext.jsx';

import AuthFailed from '../error_pages/AuthFailed.jsx';
import Forbidden from '../error_pages/Forbidden.jsx';
import FolderForm from '../../components/folders/FolderForm.jsx';

function EditFolder() {
	const [flData, setFlData] = useState(null);
	const { user } = useContext(UserContext);
	const { setModal } = useContext(ModalContext);
	const { id: folderId } = useParams();

	// get data
	useEffect(() => {
		async function getFolderData() {
            try {
                const response = await fetch('/api/folders/' + folderId);
                const json = await response.json();

                if (!response.ok) {
                    const { message } = json;

                    throw Error(message);
                }

                // check user ownership
                if (user.user_id !== json.uploadedBy) {
                    const forbidden = "edit someone else's folder";
                    return <Forbidden forbidden={forbidden} />;
                }

                setFlData({
                    name: json.name,
                    selected: [...json.playlists],
                    deselected: []
                });
            } catch (err) {
                setModal({
                    active: 'modal',
                    msg: `${err.name}: ${err.message}`
                });

                console.log(err);
            }
		}

		getFolderData();
	}, []);

	if (!user) {
		return <AuthFailed />;
	}

	return (
		<>
			<div className="page-title">
				<h2>Update Folder</h2>
			</div>

			{flData && <FolderForm flData={flData} />}
		</>
	);
}

export default EditFolder;
