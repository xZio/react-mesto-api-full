import { Link } from "react-router-dom";
import { useFormAndValidation } from "../hooks/useFormAndValidation";

function Register({ handleRegister }) {
  const { values, handleChange } = useFormAndValidation();

  function handleSubmit(e) {
    e.preventDefault();
    let { email, password } = values;
    if (!email || !password) {
      return;
    }

    handleRegister(email, password);
  }

  return (
    <div className="register">
      <h2 className="register__title"> Регистрация</h2>
      <form className="register__form" onSubmit={handleSubmit}>
        <input
          className="register__input"
          value={values.email || ""}
          id="email"
          type="email"
          minLength="6"
          maxLength="40"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          required
        ></input>
        <input
          className="register__input"
          value={values.password || ""}
          id="password"
          type="password"
          minLength="6"
          maxLength="20"
          placeholder="Пароль"
          name="password"
          onChange={handleChange}
          required
        ></input>
        <button className="button button_type_reg"> Зарегистрироваться</button>
      </form>
      <div className="register__sing-in">
        <p className="register__paragraph">Уже зарегистрированы?</p>
        <Link to="/sign-in" className="register__link">
          Войти
        </Link>
      </div>
    </div>
  );
}
export default Register;
