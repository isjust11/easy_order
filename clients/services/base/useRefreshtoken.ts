import axiosApi from "./api";

const getRereshToken = ()=>{
    return localStorage.getItem('refreshToken')
}

function signIn(){
    return window.location.href = '/sign-up'
}
export const useRefreshToken = () => {
  const refreshToken = async () => {

      // Gọi tới backend để lấy access token mới và trả về
    const res = await axiosApi.post("/auth/refresh-token", {
      refreshToken: getRereshToken,
    });

    if (getRereshToken != null) localStorage.setItem('refreshToken',res.data.tokens.accessToken);
    else signIn();
  };
  return refreshToken;
};