import "./Input.css";

export const Input = ({
  name,
  register,
  errors,
  type,
  placeholder,
  validationSchema,
}) => {
  return (
    <>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        {...register(name, validationSchema)}
      />
      {errors && errors[name]?.type === "required" && (
        <span className="error">{errors[name]?.message}</span>
      )}
      {errors && errors[name]?.type === "minLength" && (
        <span className="error">{errors[name]?.message}</span>
      )}
      {errors && errors[name]?.type === "pattern" && (
        <span className="error">{errors[name]?.message}</span>
      )}
    </>
  );
};
