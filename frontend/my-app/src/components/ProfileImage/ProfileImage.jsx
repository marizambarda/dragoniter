import React from 'react';
import { Image } from 'react-bootstrap';
import defaultProfileImage from '../../img/defaultProfile.png';

function ProfileImage(props) {
  return (
    <Image
      {...props}
      src={props.src ? props.src : defaultProfileImage}
      roundedCircle
    />
  );
}

export default ProfileImage;
