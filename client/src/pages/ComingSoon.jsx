import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ComingSoon = () => {
  return (
    <div>
        <Navbar/>

        <div className="container soon-section flex flex-col justify-center items-center ">
            <div className="circle"></div>
            <img src="https://ai.flux-image.com/flux/501b08a4-6164-4de3-8c6e-8e29d59e311b.jpg" alt="" className='comingImg'/>
            <h1 className='comingText'>Coming Soon</h1>
            <p>We are going to Launch this Feature very soon</p>
        </div>
         
        <Footer/>
    </div>
  )
}

export default ComingSoon