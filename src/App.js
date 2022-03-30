import React from "react";
import styled from "styled-components";
import TicTacToe from "./TicTacToe";
import {Container,AppBar,Typography,Grow,Grid} from '@material-ui/core';
import "papercss/dist/paper.min.css";

function App() {
  return (
    <>
      <Main>
        <TicTacToe />
      </Main>
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex: 1 0 auto;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  width: 100%;
  flex: 0 0 auto;
`;

const FooterInner = styled.div`
  padding: 16px 0;
`;
export default App;