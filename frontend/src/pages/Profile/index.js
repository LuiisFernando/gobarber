import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input } from "@rocketseat/unform";

import api from "~/services/api";

import { updateProfileRequest } from "~/store/modules/user/actions";
import { signOut } from "~/store/modules/auth/actions";

import { Container, ImageContainer } from "./styles";

export default function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.user.profile);

  const [file, setFile] = useState(profile.avatar ? profile.avatar.id : 0);
  const [preview, setPreview] = useState(
    profile.avatar
      ? profile.avatar.url
      : "https://api.adorable.io/avatars/50/abott@adorable.png"
  );

  function handleSubmit(data) {
    dispatch(updateProfileRequest(data));
  }

  function handleSignOut() {
    dispatch(signOut());
  }

  async function handleChange(e) {
    const data = new FormData();

    data.append("file", e.target.files[0]);

    const response = await api.post("files", data);

    const { id, url } = response.data;

    setFile(id);
    setPreview(url);

    dispatch(
      updateProfileRequest({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar: {
          url,
          id
        }
      })
    );
  }

  return (
    <Container>
      <Form initialData={profile} onSubmit={handleSubmit}>
        {/* <AvatarInput name="avatar_id" /> */}

        <ImageContainer>
          <label htmlFor="avatar">
            <img
              src={
                preview ||
                "https://api.adorable.io/avatars/50/abott@adorable.png"
              }
              alt=""
            />

            <input
              type="file"
              id="avatar"
              name="id"
              accept="image/*"
              data-file={file}
              onChange={e => handleChange(e)}
            />
          </label>
        </ImageContainer>

        <Input name="name" placeholder="Nome completo" />
        <Input name="email" type="email" placeholder="Seu endereço de e-mail" />

        <hr />

        <Input
          type="password"
          name="oldPassword"
          placeholder="Sua senha atual"
        />
        <Input type="password" name="password" placeholder="Nova senha" />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirmação de senha"
        />

        <button type="submit">Atualizar perfil</button>
      </Form>
      <button type="button" onClick={handleSignOut}>
        Sair do GoBarber
      </button>
    </Container>
  );
}
