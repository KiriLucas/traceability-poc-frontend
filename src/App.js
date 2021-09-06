import logo from './upload.svg';
import jsQR from "jsqr";
import './App.css';
import { useState } from 'react'

function App() {

  const [batata2, setBatata2] = useState('')
  const batata3 = 'QRCode data: '

  const onChange = ({ target: { files } }) => {
    createImageBitmap(files[0]).then(bmp => {
      const canvas = document.createElement('canvas')
      canvas.width = bmp.width
      canvas.height = bmp.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bmp, 0, 0)

      const batata = ctx.getImageData(0, 0, bmp.width, bmp.height)
      const ready = jsQR(batata.data, batata.width, batata.height)

      setBatata2(ready.data)

      console.log(ready)

    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <label for="upload">SELECT QRCODE</label>
        <input type="file" id="upload" onChange={onChange} />
        <p>{batata3}{batata2}</p>
      </header>
    </div>
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
