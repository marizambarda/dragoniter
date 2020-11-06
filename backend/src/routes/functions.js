function validateEmail(email){
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegexp.test(email);
}

function validateNickname(nickname){
  const nicknameRegexp = /^[0-9a-zA-Z_]+$/
  return nicknameRegexp.test(nickname);
}

module.exports = {
  validateEmail,
  validateNickname
}




