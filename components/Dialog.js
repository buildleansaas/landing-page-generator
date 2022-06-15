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

const Dialog = ({ onSave, onClose, isOpen, title, children, saveButtonText = "Save", ...props }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="4xl" {...props}>
    <ModalOverlay />
    <ModalContent borderRadius={0}>
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
