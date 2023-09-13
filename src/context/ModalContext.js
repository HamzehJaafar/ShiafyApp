import React, { createContext, useState, useContext } from 'react';
import MusicItemModal from '../components/MusicItemModal';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import CreatePlaylistModal from '../components/CreatePlaylistModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const openModal = (modalType, modalProps) => {
    console.log(modalType)
    setModal({ type: modalType, props: modalProps });
  };

  const closeModal = () => {
    setModal(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modal?.type === 'MusicItemModal' && <MusicItemModal {...modal.props} closeModal={closeModal} />}
      {modal?.type === 'AddToPlaylistModal' && <AddToPlaylistModal {...modal.props} closeModal={closeModal} />}
      {modal?.type === 'CreatePlaylistModal' && <CreatePlaylistModal {...modal.props} closeModal={closeModal} />}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
