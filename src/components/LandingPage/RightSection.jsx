import React, { useRef, useState } from 'react'
import modalcss from "../../assets/styles/Modal.module.css"
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RightSection = ({ product, updateOrderDetails, handleToCart, orderDetails, selectedRadio }) => {
    const [noOfItems, setNoOfItems] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [enable, setEnable] = useState(false);
    const [selectedOption, setSelectedOption] = useState('option1');
    const [defaultOrder, setDefaultOrder] = useState(true)
    const [customOrder, setCustomOrder] = useState(true)
    const handleOptionChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        if (selectedValue === "option1") {
            setDefaultOrder(true);
            setCustomOrder(false)
        }
        else if (selectedValue === "option2") {
            setCustomOrder(true)
            setDefaultOrder(false)
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };
    const handleCancel = () => {
        setSelectedFile(null);

        // Remove the selected file from local storage
        localStorage.removeItem("image_url");

        // Clear the file input by resetting its value
        const fileInput = document.getElementById("image_upload"); // replace with your actual file input ID
        if (fileInput) {
            fileInput.value = null;
        }
    };
    const handleUpload = (e) => {
        if (!selectedFile) {
            return alert('Please select a file before uploading')
        }
        if (selectedFile) {
            e.target.innerHTML = "Adding..."

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
                    e.target.innerHTML = "Added"
                    setEnable(true)
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
            <select id="options" value={selectedOption} onChange={handleOptionChange}>
                <option disabled>-- Select --</option>
                <option value="option1">Default Order</option>
                <option value="option2">Custom Order</option>
            </select>

            {selectedOption === 'option2' && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <input
                        style={{ color: "#fff", backgroundColor: "#00494d", maxWidth: "230px" }}
                        type='file'
                        id="image_upload"
                        onChange={handleFileChange}
                    />
                    <button onClick={handleUpload} style={{ color: "#fff", backgroundColor: "#00494d", fontSize: "14px", height: "42px", borderRadius: "3px" }}>Upload pics for customize order</button>
                    {enable && <button style={{ color: "#fff", backgroundColor: "#00494d", fontSize: "14px", height: "42px", borderRadius: "3px" }} onClick={handleCancel}>Cancel</button>}
                </div>
            )}

            {selectedOption === 'option1' && defaultOrder && product.available_styles && product.available_styles.filter((e) => { return e.color === product.available_colors[selectedRadio] }).length > 0 ? (
                <div className={`${modalcss.wrap_styles} ${modalcss.wrap_sizes}`}>
                    {
                        product.available_styles.filter((e) => { return e.color === product.available_colors[selectedRadio] }).map((style, index) => (
                            <StylesRadio key={index} index={index} orderDetails={orderDetails} updateOrderDetails={updateOrderDetails}>{style.name}</StylesRadio>
                        ))
                    }
                </div>
            ) : (
                <p>No Style for this color</p>
            )}

            {/* <select id="options" value={selectedOption} onChange={handleOptionChange}>
                <option disabled>-- Select --</option>
                <option value="option1">Defalut Order</option>
                <option value="option2">Custom Order</option>
            </select>
            {customOrder && <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <input
                    style={{ color: "#fff", backgroundColor: "#00494d", maxWidth: "230px" }}
                    type='file'
                    id="image_upload"
                    onChange={handleFileChange}
                />
                <button onClick={handleUpload} style={{ color: "#fff", backgroundColor: "#00494d", fontSize: "14px", height: "42px", borderRadius: "3px" }}>Upload pics for customize order</button>
                {enable && <button style={{ color: "#fff", backgroundColor: "#00494d", fontSize: "14px", height: "42px", borderRadius: "3px" }} onClick={handleCancel}>Cancel</button>}
            </div>}

            {defaultOrder && product.available_styles && product.available_styles.filter((e) => { return e.color === product.available_colors[selectedRadio] }).length > 0 ?
                <div className={`${modalcss.wrap_styles} ${modalcss.wrap_sizes}`}>
                    {
                        product.available_styles.filter((e) => { return e.color === product.available_colors[selectedRadio] }).map((style, index) => (
                            <>
                                <StylesRadio key={index} index={index} orderDetails={orderDetails} updateOrderDetails={updateOrderDetails}>{style.name}</StylesRadio>
                            </>
                        ))

                    }
                </div>
                :
                <p>No Style for this color</p>
            } */}

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
            <label style={{ width: "fit-content" }} htmlFor={index} className={orderDetails.selectedStyle === children ? modalcss.size_selected : modalcss.size_disselected}
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