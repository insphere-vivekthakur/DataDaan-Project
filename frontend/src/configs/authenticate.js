const aunthenticate = () => {
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log(userInfo,"userInfo");
  if (userInfo && userInfo.token) {
    return true;
  }
  return false;
};

export default aunthenticate;
