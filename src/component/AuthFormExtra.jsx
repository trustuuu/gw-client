export default function AuthFormExtra(props) {
  const handleChange = (e) => {
    props.handleData(e.target.checked);
  };
  return (
    // <div className="flex items-center justify-between ">
    // <div className="flex items-center">
    <div>
      <div>
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          onChange={(e) => handleChange(e)}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 dark:border-yellow-300 rounded"
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm dark:text-yellow-600"
        >
          Remember me
        </label>
      </div>

      <div className="text-sm">
        <a
          href="#"
          className="font-medium text-purple-600 hover:text-purple-500"
        >
          Forgot your password?
        </a>
      </div>
    </div>
  );
}
