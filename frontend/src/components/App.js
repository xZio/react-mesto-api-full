import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { ESC_CODE } from "../utils/utils.js";
import { api } from "../utils/Api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmPopup from "./ConfirmPopup";
import { Routes, Route, useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import ProtecedRoute from "./ProtecedRoute";
import * as auth from "../utils/auth.js";

function App() {
  const navigate = useNavigate();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [isRegistrationError, setIsRegistrationError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [deletedCard, setDeletedCard] = React.useState(null);
  const isOpen =
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isEditAvatarPopupOpen ||
    isConfirmPopupOpen ||
    selectedCard;
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  React.useEffect(() => {
    let jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .getContent(jwt)
        .then((res) => {
          setUserEmail(res.email);
          setLoggedIn(true);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("jwt");
        });
    }
  }, [navigate]);

  React.useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getCards()])
        .then(([data, cards]) => {
          setCurrentUser(data);
          setCards(cards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  React.useEffect(() => {
    function handleEcsClose(evt) {
      if (evt.key === ESC_CODE) {
        closeAllPopups();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEcsClose);
      return () => {
        document.removeEventListener("keydown", handleEcsClose);
      };
    }
  }, [isOpen]);

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then(() => {
        setIsRegistrationError(false);
        setIsInfoTooltipOpen(true);
        navigate("/sign-in");
      })
      .catch((err) => {
        setIsRegistrationError(true);
        setIsInfoTooltipOpen(true);
        console.log(err);
      });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    navigate("/sign-in");
  }

  function handleLogin(email, password) {
    auth
      .authorize(email, password)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        setLoggedIn(true);
        setUserEmail(email);
        navigate("/");
      })
      .catch((err) => {
        setIsRegistrationError(true);
        setIsInfoTooltipOpen(true);
        console.log(err);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);

    api
      .likeCard(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete() {
    setIsLoading(true);
    api
      .deleteCard(deletedCard._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== deletedCard._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleDeleteClick(card) {
    setDeletedCard(card);
    setIsConfirmPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard(null);
    setIsLoading(false);
    setIsInfoTooltipOpen(false);
  }

  function handleOverlayClick(evt) {
    if (evt.target === evt.currentTarget) {
      closeAllPopups();
    }
  }

  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api
      .setUserInfo({ name, about })
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api
      .updateAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    setIsLoading(true);
    api
      .addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <div className="page">
          <Header
            userEmail={userEmail}
            loggedIn={loggedIn}
            handleLogout={handleLogout}
          />
          <Routes>
            <Route
              path="/"
              element={
                <ProtecedRoute path="/" loggedIn={loggedIn}>
                  <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleDeleteClick}
                  />
                </ProtecedRoute>
              }
            />
            <Route
              path="/sign-up"
              element={<Register handleRegister={handleRegister} />}
            />
            <Route
              path="/sign-in"
              element={<Login handleLogin={handleLogin} />}
            />
          </Routes>

          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
            onUpdateAvatar={handleUpdateAvatar}
            isLoading={isLoading}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
          />
          <ConfirmPopup
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
            onConfirm={handleCardDelete}
            isLoading={isLoading}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
          />
          <InfoTooltip
            onClose={closeAllPopups}
            onOverlay={handleOverlayClick}
            isInfoTooltipOpen={isInfoTooltipOpen}
            isRegistrationError={isRegistrationError}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
