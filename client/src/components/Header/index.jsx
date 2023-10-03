import React from 'react';
import Button from '@mui/material/Button';

import styles from './Header.module.css';
import Container from '@mui/material/Container';

export const Header = () => {
  const isAuth = false;

  const onClickLogout = () => {};

  return (
    <div className={styles.root}>
      <Container maxWidth="lg" >
        <div className={styles.inner}>
          <a className={styles.logo} href="/">
            <div>
              <span className={"text-3xl caret-amber-600"} style={{color: "#d97706"}}>
                CITY
              </span>
              <span>
                Problems
              </span>
            </div>
          </a>

          <div>
            {isAuth ? (
              <>
                <a href="/posts/create">
                  <Button variant="contained">Написать статью</Button>
                </a>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <a href="/login">
                  <Button className={styles.buttons} variant="contained" style={{backgroundColor: "orange", borderColor:"black", fontFamily: "Montserrat"}}><p className={""} style={{color: "white"}}>Войти</p></Button>
                </a>
                <a href="/registration" className={"ml-4"}>
                  <Button className={"bg-amber-500 hover:bg-amber-500" } variant="contained" style={{backgroundColor: "white", borderColor:"black", fontFamily: "Montserrat"}}><p className={""} style={{color: "orange"}}>Зарегистрироваться</p></Button>
                </a>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 place-items-center mt-48">
          <p className={"self-end"} style={{display: "block"}}><span className={"text-3xl font-bold"} style={{fontFamily: "Montserrat"}}>В твоем городе возникла проблема?</span></p>
          <p className={"self-end"} style={{display: "block"}}><span className={""} style={{fontFamily: "Montserrat"}}>Опиши проблему или голосуй за другие проблемы</span></p>
          <Button className={"self-end w-96 mt-2"} style={{backgroundColor: "orange", borderColor:"black", fontFamily: "Montserrat"}} variant="contained">Рассказать о городской проблеме</Button>

        </div>
             </Container>
    </div>
  );
};
export default Header;