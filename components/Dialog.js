import React from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const Dialog = ({ onSave, onClose, isOpen, title, children, saveButtonText = "Save" }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={6}>{children}</ModalBody>
      {onSave && (
        <ModalFooter>
          <Button align="center" isFullWidth onClick={onSave} colorScheme="blue" mr={3}>
            {saveButtonText}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      )}
    </ModalContent>
  </Modal>
);

export default Dialog;
