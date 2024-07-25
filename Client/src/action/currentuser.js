export const setcurrentuser=(data)=>{
    return{
        type:"FETCH_CURRENT_USER",
        payload:data
    }
}

export const UPDATE_USER = "UPDATE_USER";

export const updateUser = (updatedUser) => {
  return {
    type: UPDATE_USER,
    payload: updatedUser,
  };
};