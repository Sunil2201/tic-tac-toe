import React from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { Button } from "@material-ui/core";
import { border } from "./styles";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0, 0.6)"
  }
};

export const ResultModal = ({ isOpen, close, startNewGame, winner }) => {
  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={close}
      style={customStyles}
      ariaHideApp={false}
      className = "mainBox"
    >
      <ModalWrapper className="box">
        <ModalTitle>Game over</ModalTitle>
        <ModalContent>{winner}</ModalContent>

        <ModalFooter>
          <Button variant="contained" color="secondary" size="medium" className="btn1" onClick={close}>Close</Button>
          <Button variant="contained" color="secondary" size="medium" className="btn1" onClick={startNewGame}>Start over</Button>
        </ModalFooter>
      </ModalWrapper>
    </StyledModal>
  );
};
const StyledModal = styled(Modal)`

`;
const ModalWrapper = styled.div`
  
`;

const ModalTitle = styled.p`
  font-family: 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
`;

const ModalContent = styled.p`
  font-family: 'Roboto', sans-serif;
  flex: 1 1 auto;
  text-align: center;
`;
ModalContent.displayName = "ModalContent";

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 0 0 auto;
  width: 100%;
`;

