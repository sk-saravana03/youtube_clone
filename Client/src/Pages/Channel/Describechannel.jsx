import React from 'react'
import './Describechannel.css'
import { FaEdit,FaUpload } from "react-icons/fa"
import { useSelector } from 'react-redux'

const Describechannel = ({ setvideouploadpage , cid , seteditcreatechanelbtn }) => {
  // const channel=[
  //   {
  //       _id:3,
  //       name:"SK",
  //       email:"abcd@gmail.com",
  //       joinedon:"222-07-134",
  //       desc:"bithead"
  //   }
  // ]
const channel=useSelector(state=>state.chanelreducer)
// console.log(channel)

const currentchannel = channel.filter((c) => c._id === Number(cid))[0];
const currentuser=useSelector(state => state.currentuserreducer);
  // console.log(channel);
  // console.log(currentuser)
  return (
    <div className="container3_chanel">
      <div className="chanel_logo_chanel">
        <b>{currentuser?.result.name.charAt(0).toUpperCase()}</b>
      </div>
      <div className="description_chanel">
        <b>{currentuser?.result.name}</b>
        <p>{currentuser?.result.desc}</p>
      </div>
      {currentuser?._id === currentchannel?._id && (
        <>
        <p className="editbtn_chanel" onClick={()=>seteditcreatechanelbtn(true)}>
          <FaEdit/>
          <b>Edit Channel</b>
        </p>
        <p className="uploadbtn_chanel" onClick={()=>setvideouploadpage(true)}>
          <FaUpload/>
          <b>Upload Video</b>
        </p>
        </>
      )}
    </div>
  )
}

export default Describechannel