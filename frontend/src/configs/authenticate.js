const aunthenticate = () => {
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // console.log(userInfo,"userInfo");
  if (userInfo && userInfo.user[0].token) {
    return true;
  }
  return false;
};

export default aunthenticate;
