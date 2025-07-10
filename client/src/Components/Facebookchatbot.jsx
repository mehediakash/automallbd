import React from 'react'
import { FacebookProvider, CustomChat } from 'react-facebook';

const Facebookchatbot = () => {
  return (
    <div>
       <FacebookProvider appId="654094137617207" chatSupport>
        <CustomChat pageId="422457067623883" minimized={true}/>
      </FacebookProvider>    
    </div>
  )
}

export default Facebookchatbot
