import React, { useRef, useState } from 'react'
import modalcss from "../../assets/styles/Modal.module.css"
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RightSection = ({ product, updateOrderDetails, handleToCart, orderDetails, selectedRadio }) => {
    const [noOfItems, setNoOfItems] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
      };
      const handleUpload = () => {
        if(!selectedFile){
            return alert('Please select a file before uploading')
        }
        if (selectedFile) {
          const formData = new FormData();
          formData.append('image', selectedFile);
    
          // Replace 'YOUR_BACKEND_ENDPOINT' with the actual endpoint where you want to send the image
          fetch('http://localhost:5400/api/admin/product/productAdd/uploadImages', {
            method: 'POST',
            body: formData,
          })
            .then(response => response.json())
            .then(data => {
              // Handle the response from the backend if needed
              localStorage.setItem("image_url", data?.url)
            //   console.log('Upload successful:', data);
            })
            .catch(error => {
              // Handle errors
              console.error('Error uploading image:', error);
            });
        } else {
          // Handle the case where no file is selected
          console.warn('No file selected');
        }
      };
    const incrementNo = () => {
        if (noOfItems < 9) {
            setNoOfItems(no => no + 1);
            updateOrderDetails("quantity", noOfItems + 1)
        }
    }
    const decrementNo = () => {
        if (noOfItems > 1) {
            setNoOfItems(no => no - 1);
            updateOrderDetails("quantity", noOfItems - 1)
        }
    }

    return (
        <div className={modalcss.product_details}>
            <h3>{product.product_name}</h3>
            <p style={{ margin: "-15px 0 10px", fontSize: "14px", width: "100%", height: "30px", overflow: 'hidden' }}>
                {product.product_desc}
            </p>
            <p style={{ fontWeight: 600 }}>$ {orderDetails.unit_price} / unit</p>
            <div className={modalcss.selectNo}>
                <button style={{ padding: "7px 9px" }} onClick={incrementNo}><FontAwesomeIcon icon={faPlus} /></button>
                <input style={{ display: "block", width: "35px" }} className={modalcss.selectNoInput} type='number' value={noOfItems} max={1} min={0} disabled />
                <button style={{ padding: "7px 9px" }} onClick={decrementNo}><FontAwesomeIcon icon={faMinus} /></button>
            </div>

            <div className={modalcss.wrap_sizes}>
                {
                    product.available_sizes.map((size, index) => (
                        <RadioBox key={index} index={index} orderDetails={orderDetails} updateOrderDetails={updateOrderDetails}>{size}</RadioBox>
                    ))
                }
            </div>


            <h4 style={{ margin: "10px 0" }}>Available Styles: </h4>
            <div style={{display:"flex",justifyContent:"center", alignItems:"center"}}>
      <input
        style={{ color: "#fff" ,backgroundColor: "#00494d" ,maxWidth:"230px"}}
        type='file'
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} style={{ color: "#fff", backgroundColor: "#00494d",fontSize: "14px", height:"42px", borderRadius:"3px"}}>Upload pics for customize order</button>
    </div>
        
            {/* <AddressDetails updateOrderDetails={updateOrderDetails}/> */}
            {   
                product.available_styles && product.available_styles.filter((e) => {return e.color === product.available_colors[selectedRadio]}).length > 0?
                <div className={`${modalcss.wrap_styles} ${modalcss.wrap_sizes}`}>
                    {
                    product.available_styles.filter((e) => {return e.color === product.available_colors[selectedRadio]}).map((style, index) => (
                        <>
                        <StylesRadio key={index} index={index} orderDetails={orderDetails} updateOrderDetails={updateOrderDetails}>{style.name}</StylesRadio>
                        </>
                        ))
                        
                    }
                </div>
                :
                <p>No Style for this color</p>
            }
            
            <button className={modalcss.place_order_btn} onClick={handleToCart}>
                Add to Cart
            </button>
        </div>
    )
}

export default RightSection;

const RadioBox = ({ children, index, updateOrderDetails, orderDetails }) => {
    const [isSelected, setIsSelected] = useState(0);

    return (
        <>
            <input type="radio" onChange={updateOrderDetails} name="size" id={index} checked={isSelected === index} />
            <label htmlFor={index} className={orderDetails.selectedSize === children ? modalcss.size_selected : modalcss.size_disselected}
                onClick={
                    () => {
                        setIsSelected(index)
                        updateOrderDetails("selectedSize", children)
                    }
                }
            >{children}</label>
        </>
    );
};

const StylesRadio = ({ children, index, updateOrderDetails, orderDetails }) => {
    const [isSelected, setIsSelected] = useState(0);

    return (
        <>
            <input type="radio" onChange={updateOrderDetails} name="size" id={index} checked={isSelected === index} />
            <label style={{width:"fit-content"}} htmlFor={index} className={orderDetails.selectedStyle === children ? modalcss.size_selected : modalcss.size_disselected}
                onClick={
                    () => {
                        setIsSelected(index)
                        updateOrderDetails("selectedStyle", children)
                    }
                }
            >{children}</label>
        </>
    );
};