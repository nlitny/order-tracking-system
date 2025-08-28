import { AuthResponse } from "./types";

export const axiosInstance = {
  post: async (url: string, data: any): Promise<{ data: AuthResponse }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (url === "/auth") {
      if (data.email === "existing@example.com") {
        if (!data.password) {
          return {
            data: {
              status: "login",
              message: "Welcome back! Please enter your password to continue",
            },
          };
        } else if (data.password === "wrongpass") {
          throw new Error("Invalid password. Please try again.");
        } else {
          return {
            data: {
              status: "success",
              message: "Login successful! Redirecting to your dashboard...",
              user: {
                id: "1",
                email: data.email,
                first_name: "John",
                last_name: "Doe",
              },
            },
          };
        }
      } else if (data.email && !data.first_name) {
        return {
          data: {
            status: "register",
            message: "Let's create your account! Please provide your details",
          },
        };
      } else if (data.first_name) {
        return {
          data: {
            status: "success",
            message: "Account created successfully! Welcome to our platform",
            user: {
              id: "2",
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
            },
          },
        };
      }
    }
    throw new Error("Something went wrong. Please try again.");
  },
};
