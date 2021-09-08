import logo from './upload.svg';
import jsQR from "jsqr";
import './App.css';
import { useState } from 'react'
import { CContainer, CRow, CCol, CNavbar, CNavItem } from '@coreui/react';


function App() {

  const [plainData, setPlainData] = useState('')
  const title = 'QRCode data: '

  const onChange = ({ target: { files } }) => {
    createImageBitmap(files[0]).then(image => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)

      const imageData = context.getImageData(0, 0, image.width, image.height)
      const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height).data

      setPlainData(qrCodeData)

    })
  }

  return (

    <CContainer>
      <CRow>
        <CCol xs={8}>
          <label class="btn btn-dark" for="upload"><i class="cil-qr-code"></i></label>
          <input type="file" id="upload" onChange={onChange} />
          <p class="title">{title}{plainData}</p>
        </CCol>
      </CRow>
    </CContainer>

    // <div class="container">
    //   <div class="c-body">
    //     <main class="c-main">
    //     <div class="row">teste
    //     <div class="col-lg">
    //       <label class="btn btn-dark" for="upload"><i class="cil-qr-code"></i></label>
    //       <input type="file" id="upload" onChange={onChange} />
    //       <p class="title">{title}{plainData}</p>
    // </div></div>
    //     </main>
    //   </div>
    // </div>

    // <div className="App">

    // </div>
  );
}

export default App;



// Difference between
// const onChange = ({target: {files}}) => {
//   createImageBitmap(files[0]).then(bmp =>{
//     console.log(bmp)
//   })  
//     // console.log(image.target.files[0])
//   }
// and
// const onChange = (image) => {
//   createImageBitmap(image.target.files[0]).then(bmp =>{
//     console.log(bmp)
//   })  
//     // console.log(image.target.files[0])
//   }
