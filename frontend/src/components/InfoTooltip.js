import ok from "../images/ok.png";
import error from "../images/error.png";

function InfoTooltip({
  onClose,
  onOverlay,
  isInfoTooltipOpen,
  isRegistrationError,
}) {
  return (
    <div
      className={`popup ${isInfoTooltipOpen && "popup_opened"}`}
      onMouseDown={onOverlay}
    >
      <div className="popup__container popup__container_type_register">
        <button className="button button_type_esc" onClick={onClose}></button>

        <img
          src={isRegistrationError ? error : ok}
          alt={isRegistrationError ? "ошибка" : "ok"}
          className="popup__register-img"
        ></img>
        <h2 className="popup__register-title">
          {isRegistrationError
            ? "Что-то пошло не так! Попробуйте ещё раз."
            : "Вы успешно зарегистрировались!"}
        </h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
