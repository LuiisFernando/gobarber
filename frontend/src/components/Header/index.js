import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Notifications from "~/components/Notifications";

import logo from "~/assets/header.svg";
import { Container, Content, Profile } from "./styles";

export default function Header() {
  const profile = useSelector(state => state.user.profile);
  const foto = profile.avatar
    ? profile.avatar.url
    : "https://api.adorable.io/avatars/50/abott@adorable.png";

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
              <strong>{profile.name}</strong>
              <Link to="/profile">Meu Perfil</Link>
            </div>
            <img src={foto} alt="perfil" />
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
