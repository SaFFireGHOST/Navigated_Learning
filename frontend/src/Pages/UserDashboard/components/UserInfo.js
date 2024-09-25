import React from 'react'

const UserInfo = () => {
  return (
    <div style={{width:"100%",padding:"15px 10px",background:"#ccc"}}>
      <h1>Hello, {localStorage.getItem("name")}</h1>
      <h6>Learn Courses better on Navigated Learning</h6>
    </div>
  )
}

export default UserInfo