import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Notifications from "~/components/Notifications";

import logo from "~/assets/header.svg";
import { Container, Content, Profile } from "./styles";

export default function Header() {
  const name = useSelector(state => state.user.profile.name);

  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="GoBarber" />
          <Link to="/dashboard">DASHBOARD</Link>
        </nav>
        <aside>
          <Notifications />
          <Profile>
            <div>
              <strong>{name}</strong>
              <Link to="/profile">Meu Perfil</Link>
            </div>
            <img
              src="https://api.adorable.io/avatars/50/abott@adorable.png"
              alt="Luis"
            />
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}