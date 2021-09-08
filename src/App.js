import './App.css';
import { useState } from 'react'
import { CContainer, CRow, CCol } from '@coreui/react';
import jsQR from "jsqr";


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
        <CCol sm="auto">
          <p class="title">Register new piece</p>
          <label class="btn btn-dark" for="upload"><i class="cil-qr-code"></i></label>
          <input type="file" id="upload" onChange={onChange} />
          <p class="title">{title}{plainData}</p>
        </CCol>
        <CCol sm="auto">
          <p class="title">Register new piece</p>
          <label class="btn btn-dark" for="upload"><i class="cil-qr-code"></i></label>
          <input type="file" id="upload" onChange={onChange} />
          <p class="title">{title}{plainData}</p>
        </CCol>
      </CRow>
      <CRow>

      </CRow>
    </CContainer>
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
