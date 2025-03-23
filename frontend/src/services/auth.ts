import axios from "axios";

export async function signUp (username: string, email: string, password: string) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        username,
        email,
        password
    }, {
        withCredentials: true
      }
    );

    return res.data;
}

export async function logIn (username: string, password: string) {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        username,
        password
    }, {
        withCredentials: true
      }
    );
    return res.data;
}

export async function logOut() {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
      {}, // body rỗng
      {
        withCredentials: true,
        // headers: {
        //     Authorization: `Bearer ${accessToken}`
        // }
      }
    );
    return res.data;
  }
  