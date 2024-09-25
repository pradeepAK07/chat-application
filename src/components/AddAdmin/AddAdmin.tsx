import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { ADD_ROLE_TO_USER, GET_ALL_USERS } from "../../queries/userQuery";
import Select from "react-select";
import styles from "./AddAdmin.module.css";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRoles } from "../../helper/helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface addAdminSubmitForm {
  userName: string;
  userType: string;
}

const AddAdmin: React.FC = () => {
  const [users, setUsers] = useState<any>([]);
  const [roles, setRoles] = useState<any>([]);

  const addAdminFormSchema = Yup.object().shape({
    userName: Yup.string().required("select username"),
    userType: Yup.string().required("select user type")
  });

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<addAdminSubmitForm>({
    mode: "all",
    resolver: yupResolver(addAdminFormSchema)
  });

  const [getAllUsers] = useLazyQuery(GET_ALL_USERS, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setUsers(data.getAllUsers);
    },
    onError: (err) => {
      console.log(err);
    }
  });

  useEffect(() => {
    getAllUsers();
  }, []);

  const [addAdmin] = useMutation(ADD_ROLE_TO_USER);

  const handleAddAdmin = async (formData: any) => {
    try {
      await addAdmin({
        variables: {
          userName: formData.userName,
          userRole: formData.userType
        }
      });
      setValue("userName", "");
      setValue("userType", "");
      toast.success("role added successfully");
    } catch (err: any) {
      toast.error(err.message);
      console.log("add role to user api error", err?.message);
    }
  };

  return (
    <div className={styles.addAdminContainer}>
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-6">Add Admin</h2>
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            User Name:
          </label>
          <Select
            placeholder="Please select username"
            isSearchable={true}
            options={users?.map((user: any) => ({
              label: user?.userName,
              value: user?.userName
            }))}
            {...register("userName")}
            onChange={(newValue: any) => {
              if (newValue) {
                setValue("userName", newValue.value);
                clearErrors("userName");
                const { userRoles } = users?.find(
                  (items: any) => items?.userName === newValue.value
                );
                setRoles(userRoles);
              }
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.userName && (
            <span className="text-red-600 text-sm">
              {errors.userName.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Current Roles:</p>
          {roles?.length > 0 ? (
            roles.map((item: any) => (
              <p key={item?.userType} className="text-gray-600">
                {item?.userType}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No roles assigned</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Role to Add:
          </label>
          <Select
            placeholder="Please select role"
            options={userRoles}
            {...register("userType")}
            onChange={(newValue: any) => {
              if (newValue) {
                setValue("userType", newValue.value);
                clearErrors("userType");
              }
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.userType && (
            <span className="text-red-600 text-sm">
              {errors.userType.message}
            </span>
          )}
        </div>
        <button
          onClick={handleSubmit(handleAddAdmin)}
          type="submit"
          className="w-full bg-blue-500 text-white font-medium rounded-md py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Role
        </button>
      </div>
    </div>
  );
};

export default AddAdmin;
