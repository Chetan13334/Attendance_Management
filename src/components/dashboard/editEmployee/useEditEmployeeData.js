import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateEmployeeAsync,
  deleteEmployeeAsync,
  clearCurrentEmployee,
} from "../../../redux/slices/employeeSlice";

export const useEditEmployeeData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const employees = useSelector((state) => state.employees.list);
  const loading = useSelector((state) => state.employees.loading);

  const [formData, setFormData] = useState(null);
  const [photo, setPhoto] = useState("https://placehold.co/160x160/cbd5e1/000?text=P");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const selected = employees.find((emp) => emp.id === id);
    if (selected) {
      setFormData(selected);
      if (selected.Photo) setPhoto(selected.Photo);
    }
    return () => dispatch(clearCurrentEmployee());
  }, [id, employees, dispatch]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setPhoto(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setFormData({ ...formData, Gender: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedData = { ...formData, Photo: photo };
    const result = await dispatch(
      updateEmployeeAsync({ id: formData.id, updatedData })
    );
    if (updateEmployeeAsync.fulfilled.match(result)) {
      alert("✅ Employee updated successfully!");
      navigate("/employee_details");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    const result = await dispatch(deleteEmployeeAsync(formData.id));
    if (deleteEmployeeAsync.fulfilled.match(result)) {
      alert("🗑️ Employee deleted.");
      navigate("/employee_details");
    }
  };

  return {
    formData,
    photo,
    showPassword,
    loading,
    setShowPassword,
    handlePhotoChange,
    handleChange,
    handleGenderChange,
    handleSave,
    handleDelete,
    navigate
  };
};