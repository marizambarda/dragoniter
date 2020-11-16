function validateEmail(email){
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegexp.test(email);
}

function validateNickname(nickname){
  const nicknameRegexp = /^[0-9a-zA-Z_]+$/
  return nicknameRegexp.test(nickname);
}

function generatePasswordRecoveryCode(length) {
  let result = '';
  let characters = '0123456789';
  let charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  validateEmail,
  validateNickname,
  generatePasswordRecoveryCode
}




