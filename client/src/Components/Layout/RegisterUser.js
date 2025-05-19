import axios from "axios";
import { useState } from "react";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userId: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("/api/auth/registerUser", formData);
      alert("User registered successfully");
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <input name="userName" onChange={handleChange} placeholder="User Name" />
      <input name="userId" onChange={handleChange} placeholder="User ID" />
      <input name="password" onChange={handleChange} type="password" placeholder="Password" />
      <input name="role" onChange={handleChange} placeholder="Role" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterUser;
