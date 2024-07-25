import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from '../Pages/Home/Home'
import Search from '../Pages/Search/Search'
import Videopage from '../Pages/VideoPage/VideoPage'
import Channel from '../Pages/Channel/Channel'
import Library from '../Pages/Library/Library'
import Likedvideo from '../Pages/LikedVideo/LikedVideo'
import Watchhistory from '../Pages/WatchHistory/WatchHistory'
import Watchlater from '../Pages/WatchLater/WatchLater'
import Yourvideo from '../Pages/YourVideo/YourVideo'
import VideoCall from '../Pages/VideoCall/VideoCall'

const Allroutes = ({ seteditcreatechanelbtn , setvideouploadpage }) => {
  return (
    <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path='/search/:Searchquery' element={<Search/>}/>
        <Route path='/videopage/:vid' element={<Videopage/>}/>
        <Route path='/Library' element={<Library/>}/>
        <Route path='/Likedvideo' element={<Likedvideo/>}/>
        <Route path='/Watchhistory' element={<Watchhistory/>}/>
        <Route path='/Watchlater' element={<Watchlater/>}/>
        <Route path='/Yourvideo' element={<Yourvideo />} />
        <Route path="/videocall" element={<VideoCall />} />
        <Route path='/channel/:cid' element={<Channel seteditcreatechanelbtn={seteditcreatechanelbtn} setvideouploadpage={setvideouploadpage}/>}/>
    </Routes>
  )
}

export default Allroutes