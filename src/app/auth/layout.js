import React from 'react'

function AuthLayout({ children }) {
  return (
    <div>
        <div>
            {children}
        </div>
        <div></div>
    </div>
  )
}

export default AuthLayout