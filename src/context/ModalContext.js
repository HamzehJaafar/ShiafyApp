import React, {createContext, useState, useContext, useRef} from 'react';
import MusicItemModal from '../components/MusicItemModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import PlayerScreen from '../screens/PlayerScreen';
import {useSelector} from 'react-redux';

const ModalContext = createContext({
  openPlayer: () => {},
  closePlayer: () => {},
});

export const ModalProvider = ({children}) => {
  const [modal, setModal] = useState(null);
  const playerSheetRef = useRef(null);

  const musicModalRef = useRef(null);

  const addToPlaylistModal = useRef(null);
  const createPlaylistModal = useRef(null);

  const openMusicModal = () => {
    musicModalRef.current?.expand();
  };

  const closeMusicModal = () => {
    setModal(null);
    musicModalRef.current?.collapse();
  };

  const openAddToPlaylistModal = () => {
    addToPlaylistModal.current?.expand();
  };

  const closeAddToPlaylistModal = () => {
    setModal(null);
    addToPlaylistModal.current?.collapse();
  };

  const openCreatePlaylistModal = () => {
    createPlaylistModal.current?.expand();
  };

  const closeCreatePlaylistModal = () => {
    setModal(null);
    createPlaylistModal.current?.collapse();
  };

  const openModal = (modalType, modalProps) => {
    console.log(modalType);

    if (modalType === 'AddToPlaylistModal') {
      openAddToPlaylistModal;
      closeCreatePlaylistModal();
      closeMusicModal();
    }

    if (modalType === 'MusicItemModal') {
      closeCreatePlaylistModal();
      closeAddToPlaylistModal();
      openMusicModal();
    }

    if (modalType === 'CreatePlaylistModal') {
      closeAddToPlaylistModal();
      closeMusicModal;
      openCreatePlaylistModal();
    }

    setModal({type: modalType, props: modalProps});
  };

  const closeModal = () => {
    setModal(null);
  };

  const openPlayer = () => {
    playerSheetRef.current?.expand();
  };

  const closePlayer = () => {
    playerSheetRef.current?.collapse();
  };

  return (
    <ModalContext.Provider value={{openModal, closeModal, openPlayer}}>
      {children}
      {modal?.type === 'MusicItemModal' && (
        <MusicItemModal
          ref={musicModalRef}
          {...modal.props}
          closeModal={closeMusicModal}
        />
      )}
      {modal?.type === 'AddToPlaylistModal' && (
        <AddToPlaylistModal
          ref={addToPlaylistModal}
          {...modal.props}
          closeModal={closeAddToPlaylistModal}
        />
      )}
      {modal?.type === 'CreatePlaylistModal' && (
        <CreatePlaylistModal
          ref={createPlaylistModal}
          {...modal.props}
          closeModal={closeCreatePlaylistModal}
        />
      )}
      <PlayerScreen ref={playerSheetRef} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
